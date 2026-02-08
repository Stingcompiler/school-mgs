"""
Serializers for School Management System.
"""

from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Student, Installment, Receipt, UniformStatus, BookStatus, Result, SubjectResult, ContactMessage


User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    """Serializer for the admin user."""
    
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'is_superuser']
        read_only_fields = ['id', 'is_superuser']


class BookStatusSerializer(serializers.ModelSerializer):
    """Serializer for book status."""
    
    class Meta:
        model = BookStatus
        fields = ['id', 'is_delivered', 'delivered_at']
        read_only_fields = ['id', 'delivered_at']


class UniformStatusSerializer(serializers.ModelSerializer):
    """Serializer for uniform status."""
    
    class Meta:
        model = UniformStatus
        fields = ['id', 'is_delivered', 'delivered_at']
        read_only_fields = ['id', 'delivered_at']




class SubjectResultSerializer(serializers.ModelSerializer):
    """Serializer for individual subject results."""
    
    class Meta:
        model = SubjectResult
        fields = ['id', 'subject_name', 'score']


class ResultSerializer(serializers.ModelSerializer):
    """Serializer for student results."""
    
    subjects = SubjectResultSerializer(many=True, read_only=True)

    class Meta:
        model = Result
        fields = ['id', 'student', 'total_score', 'subjects', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']


class InstallmentSerializer(serializers.ModelSerializer):
    """Serializer for installments."""
    
    class Meta:
        model = Installment
        fields = ['id', 'student', 'installment_number', 'amount', 'payment_date', 'created_at']
        read_only_fields = ['id', 'created_at']


class ReceiptSerializer(serializers.ModelSerializer):
    """Serializer for receipts (read-only)."""
    
    student_name = serializers.CharField(source='student.name', read_only=True)
    student_code = serializers.CharField(source='student.student_code', read_only=True)
    installment_number = serializers.IntegerField(source='installment.installment_number', read_only=True)
    
    class Meta:
        model = Receipt
        fields = [
            'id', 'receipt_number', 'student', 'student_name', 'student_code',
            'installment_number', 'total_paid', 'remaining_amount', 'created_at'
        ]
        read_only_fields = fields


class StudentWriteSerializer(serializers.ModelSerializer):
    """Serializer for creating/updating students."""
    
    total_score = serializers.DecimalField(max_digits=5, decimal_places=2, required=False, write_only=True)

    class Meta:
        model = Student
        fields = [
            'id', 'student_code', 'name', 'phone', 'address',
            'parent_name', 'parent_phone', 'academic_level', 'specialization',
            'total_score'
        ]

    def create(self, validated_data):
        total_score = validated_data.pop('total_score', None)
        student = super().create(validated_data)
        
        if total_score is not None:
            Result.objects.update_or_create(
                student=student,
                defaults={'total_score': total_score}
            )
        return student

    def update(self, instance, validated_data):
        total_score = validated_data.pop('total_score', None)
        student = super().update(instance, validated_data)
        
        if total_score is not None:
            Result.objects.update_or_create(
                student=student,
                defaults={'total_score': total_score}
            )
        return student

class StudentListSerializer(serializers.ModelSerializer):
    """Serializer for student list view."""
    
    uniform_delivered = serializers.BooleanField(source='uniform_status.is_delivered', read_only=True)
    books_delivered = serializers.BooleanField(source='book_status.is_delivered', read_only=True)
    total_score = serializers.DecimalField(source='result.total_score', max_digits=5, decimal_places=2, read_only=True)
    
    class Meta:
        model = Student
        fields = [
            'id', 'student_code', 'name', 'academic_level', 'specialization',
            'parent_name', 'parent_phone', 'total_paid', 'remaining_amount',
            'uniform_delivered', 'books_delivered', 'total_score', 'created_at'
        ]
        read_only_fields = ['id', 'total_paid', 'remaining_amount', 'uniform_delivered', 'books_delivered', 'total_score', 'created_at']



class StudentDetailSerializer(serializers.ModelSerializer):
    """Detailed serializer for single student view."""
    
    installments = InstallmentSerializer(many=True, read_only=True)
    receipts = ReceiptSerializer(many=True, read_only=True)
    uniform_status = UniformStatusSerializer(read_only=True)
    book_status = BookStatusSerializer(read_only=True)
    result = ResultSerializer(read_only=True)
    
    class Meta:
        model = Student
        fields = [
            'id', 'student_code', 'name', 'phone', 'address',
            'parent_name', 'parent_phone', 'academic_level', 'specialization',
            'total_paid', 'remaining_amount', 'created_at', 'updated_at',
            'installments', 'receipts', 'uniform_status', 'book_status', 'result'
        ]
        read_only_fields = ['id', 'total_paid', 'remaining_amount', 'created_at', 'updated_at']


class PaymentSerializer(serializers.Serializer):
    """Serializer for creating a payment (installment + receipt)."""
    
    student_id = serializers.IntegerField()
    installment_number = serializers.IntegerField(min_value=1, max_value=5)
    amount = serializers.DecimalField(max_digits=10, decimal_places=2, default=100000)
    
    def validate_student_id(self, value):
        try:
            Student.objects.get(id=value)
        except Student.DoesNotExist:
            raise serializers.ValidationError("Student not found.")
        return value
    
    def validate(self, data):
        student = Student.objects.get(id=data['student_id'])
        if Installment.objects.filter(
            student=student, 
            installment_number=data['installment_number']
        ).exists():
            raise serializers.ValidationError(
                f"Installment {data['installment_number']} already paid for this student."
            )
        return data


class ContactMessageSerializer(serializers.ModelSerializer):
    """Serializer for contact messages from public."""
    
    class Meta:
        model = ContactMessage
        fields = ['id', 'name', 'email', 'phone', 'subject', 'message', 'is_read', 'created_at']
        read_only_fields = ['id', 'created_at']

