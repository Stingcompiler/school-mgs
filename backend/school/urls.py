"""
URL configuration for School app.
"""

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    LoginView, LogoutView, MeView, RefreshTokenView,
    StudentViewSet, InstallmentViewSet, ReceiptViewSet, ResultViewSet,
    PaymentView, DashboardStatsView, ContactMessageViewSet
)

router = DefaultRouter()
router.register(r'students', StudentViewSet, basename='student')
router.register(r'installments', InstallmentViewSet, basename='installment')
router.register(r'receipts', ReceiptViewSet, basename='receipt')
router.register(r'results', ResultViewSet, basename='result')
router.register(r'contact-messages', ContactMessageViewSet, basename='contact-message')

urlpatterns = [
    # Auth endpoints
    path('auth/login/', LoginView.as_view(), name='login'),
    path('auth/logout/', LogoutView.as_view(), name='logout'),
    path('auth/me/', MeView.as_view(), name='me'),
    path('auth/refresh/', RefreshTokenView.as_view(), name='refresh'),
    
    # Payment endpoint
    path('pay/', PaymentView.as_view(), name='pay'),
    
    # Dashboard stats
    path('dashboard/stats/', DashboardStatsView.as_view(), name='dashboard-stats'),
    
    # Router URLs
    path('', include(router.urls)),
]
