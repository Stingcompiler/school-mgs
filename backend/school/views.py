"""
API Views for School Management System.
"""

from rest_framework import viewsets, status, views
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from django.conf import settings
from django.db.models import Q


from .models import Student, Installment, Receipt, UniformStatus, Result, SubjectResult, ContactMessage
from .serializers import (
    UserSerializer, StudentListSerializer, StudentDetailSerializer, StudentWriteSerializer,
    InstallmentSerializer, ReceiptSerializer, ResultSerializer,
    UniformStatusSerializer, PaymentSerializer, SubjectResultSerializer, ContactMessageSerializer
)




class LoginView(views.APIView):
    """
    Login view that sets JWT tokens in HttpOnly cookies.
    """
    permission_classes = [AllowAny]
    
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        
        if not username or not password:
            return Response(
                {'error': 'Please provide both username and password'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        user = authenticate(username=username, password=password)
        
        if user is None:
            return Response(
                {'error': 'Invalid credentials'},
                status=status.HTTP_401_UNAUTHORIZED
            )
        
        if not user.is_superuser:
            return Response(
                {'error': 'Access denied. Admin only.'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        # Generate tokens
        refresh = RefreshToken.for_user(user)
        access = refresh.access_token
        
        response = Response({
            'message': 'Login successful',
            'user': UserSerializer(user).data
        })
        
        # Set HttpOnly cookies
        response.set_cookie(
            key=settings.ACCESS_TOKEN_COOKIE,
            value=str(access),
            httponly=True,
            secure=settings.SIMPLE_JWT.get('AUTH_COOKIE_SECURE', False),
            samesite=settings.SIMPLE_JWT.get('AUTH_COOKIE_SAMESITE', 'Lax'),
            max_age=settings.SIMPLE_JWT['ACCESS_TOKEN_LIFETIME'].total_seconds()
        )
        response.set_cookie(
            key=settings.REFRESH_TOKEN_COOKIE,
            value=str(refresh),
            httponly=True,
            secure=settings.SIMPLE_JWT.get('AUTH_COOKIE_SECURE', False),
            samesite=settings.SIMPLE_JWT.get('AUTH_COOKIE_SAMESITE', 'Lax'),
            max_age=settings.SIMPLE_JWT['REFRESH_TOKEN_LIFETIME'].total_seconds()
        )
        
        return response


class LogoutView(views.APIView):
    """
    Logout view that clears JWT cookies.
    """
    permission_classes = [AllowAny]
    
    def post(self, request):
        response = Response({'message': 'Logged out successfully'})
        response.delete_cookie(settings.ACCESS_TOKEN_COOKIE)
        response.delete_cookie(settings.REFRESH_TOKEN_COOKIE)
        return response


class MeView(views.APIView):
    """
    Get current authenticated user info.
    """
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        return Response(UserSerializer(request.user).data)


class RefreshTokenView(views.APIView):
    """
    Refresh access token using refresh token from cookie.
    """
    permission_classes = [AllowAny]
    
    def post(self, request):
        refresh_token = request.COOKIES.get(settings.REFRESH_TOKEN_COOKIE)
        
        if not refresh_token:
            return Response(
                {'error': 'Refresh token not found'},
                status=status.HTTP_401_UNAUTHORIZED
            )
        
        try:
            refresh = RefreshToken(refresh_token)
            access = refresh.access_token
            
            response = Response({'message': 'Token refreshed'})
            response.set_cookie(
                key=settings.ACCESS_TOKEN_COOKIE,
                value=str(access),
                httponly=True,
                secure=settings.SIMPLE_JWT.get('AUTH_COOKIE_SECURE', False),
                samesite=settings.SIMPLE_JWT.get('AUTH_COOKIE_SAMESITE', 'Lax'),
                max_age=settings.SIMPLE_JWT['ACCESS_TOKEN_LIFETIME'].total_seconds()
            )
            return response
        except Exception:
            return Response(
                {'error': 'Invalid refresh token'},
                status=status.HTTP_401_UNAUTHORIZED
            )


class StudentViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Student CRUD operations.
    """
    permission_classes = [IsAuthenticated]
    queryset = Student.objects.all()
    
    def get_serializer_class(self):
        if self.action == 'retrieve':
            return StudentDetailSerializer
        if self.action in ['create', 'update', 'partial_update']:
            return StudentWriteSerializer
        return StudentListSerializer
    
    def get_queryset(self):
        queryset = Student.objects.select_related('uniform_status', 'book_status', 'result').all()
        
        # Search functionality
        search = self.request.query_params.get('search', None)
        if search:
            queryset = queryset.filter(
                Q(name__icontains=search) |
                Q(student_code__icontains=search) |
                Q(parent_name__icontains=search)
            )
        
        # Filter by academic level
        level = self.request.query_params.get('level', None)
        if level:
            queryset = queryset.filter(academic_level=level)
        
        # Filter by specialization
        spec = self.request.query_params.get('specialization', None)
        if spec:
            queryset = queryset.filter(specialization=spec)
        
        return queryset


class InstallmentViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Installment operations.
    """
    permission_classes = [IsAuthenticated]
    serializer_class = InstallmentSerializer
    queryset = Installment.objects.all()
    
    def get_queryset(self):
        queryset = Installment.objects.select_related('student').all()
        
        student_id = self.request.query_params.get('student', None)
        if student_id:
            queryset = queryset.filter(student_id=student_id)
        
        return queryset


class ReceiptViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet for Receipt (read-only).
    """
    permission_classes = [IsAuthenticated]
    serializer_class = ReceiptSerializer
    queryset = Receipt.objects.all()
    
    def get_queryset(self):
        queryset = Receipt.objects.select_related('student', 'installment').all()
        
        student_id = self.request.query_params.get('student', None)
        if student_id:
            queryset = queryset.filter(student_id=student_id)
        
        return queryset


class ResultViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Result operations.
    """
    permission_classes = [IsAuthenticated]
    serializer_class = ResultSerializer
    queryset = Result.objects.all()
    
    def get_queryset(self):
        queryset = Result.objects.select_related('student').all()
        
        student_id = self.request.query_params.get('student', None)
        if student_id:
            queryset = queryset.filter(student_id=student_id)
        
        return queryset

    @action(detail=False, methods=['post'])
    def add_subject(self, request):
        student_id = request.data.get('student_id')
        subject_name = request.data.get('subject_name')
        score = request.data.get('score')
        
        if not all([student_id, subject_name, score]):
             return Response(
                {'error': 'Missing required fields'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            student = Student.objects.get(id=student_id)
        except Student.DoesNotExist:
            return Response(
                {'error': 'Student not found'},
                status=status.HTTP_404_NOT_FOUND
            )

        result, created = Result.objects.get_or_create(student=student)
        
        SubjectResult.objects.create(
            result=result,
            subject_name=subject_name,
            score=score
        )
        
        return Response(
            ResultSerializer(result).data,
            status=status.HTTP_201_CREATED
        )


class PaymentView(views.APIView):
    """
    Create a payment: creates Installment + auto-generates Receipt.
    """
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        serializer = PaymentSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        student = Student.objects.get(id=serializer.validated_data['student_id'])
        
        # Create the installment
        installment = Installment.objects.create(
            student=student,
            installment_number=serializer.validated_data['installment_number'],
            amount=serializer.validated_data['amount']
        )
        
        # Create the receipt
        receipt = Receipt.objects.create(
            student=student,
            installment=installment,
            total_paid=student.total_paid,
            remaining_amount=student.remaining_amount
        )
        
        # Check if uniform/books were unlocked
        uniform_unlocked = installment.installment_number == 1 and installment.amount >= 100000
        books_unlocked = installment.installment_number == 1 and installment.amount >= 100000
        
        return Response({
            'message': 'Payment recorded successfully',
            'installment': InstallmentSerializer(installment).data,
            'receipt': ReceiptSerializer(receipt).data,
            'uniform_unlocked': uniform_unlocked,
            'books_unlocked': books_unlocked
        }, status=status.HTTP_201_CREATED)


class DashboardStatsView(views.APIView):
    """
    Get dashboard statistics.
    """
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        total_students = Student.objects.count()
        total_uniforms_delivered = UniformStatus.objects.filter(is_delivered=True).count()
        total_payments = Installment.objects.count()
        
        # Students by level
        students_by_level = {}
        for level in [1, 2, 3]:
            students_by_level[f'level_{level}'] = Student.objects.filter(academic_level=level).count()
        
        # Recent payments
        recent_payments = Installment.objects.select_related('student').order_by('-created_at')[:5]
        
        # Messages stats
        unread_messages = ContactMessage.objects.filter(is_read=False).count()
        recent_messages = ContactMessage.objects.order_by('-created_at')[:5]
        
        return Response({
            'total_students': total_students,
            'total_uniforms_delivered': total_uniforms_delivered,
            'total_payments': total_payments,
            'students_by_level': students_by_level,
            'recent_payments': InstallmentSerializer(recent_payments, many=True).data,
            'unread_messages': unread_messages,
            'recent_messages': ContactMessageSerializer(recent_messages, many=True).data
        })


class ContactMessageViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Contact Messages.
    Public can POST (create), Admin can GET/PATCH (list, retrieve, update).
    """
    queryset = ContactMessage.objects.all()
    serializer_class = ContactMessageSerializer
    
    def get_permissions(self):
        if self.action == 'create':
            return [AllowAny()]
        return [IsAuthenticated()]
    
    def get_queryset(self):
        queryset = ContactMessage.objects.all()
        
        # Filter by read status
        is_read = self.request.query_params.get('is_read', None)
        if is_read is not None:
            queryset = queryset.filter(is_read=is_read.lower() == 'true')
        
        return queryset
