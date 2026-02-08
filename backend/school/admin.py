"""
Django admin configuration for School app.
"""

from django.contrib import admin
from .models import Student, Installment, Receipt, UniformStatus, Result, ContactMessage


@admin.register(Student)
class StudentAdmin(admin.ModelAdmin):
    list_display = ['student_code', 'name', 'academic_level', 'specialization', 'parent_name']
    list_filter = ['academic_level', 'specialization']
    search_fields = ['student_code', 'name', 'parent_name']


@admin.register(Installment)
class InstallmentAdmin(admin.ModelAdmin):
    list_display = ['student', 'installment_number', 'amount', 'payment_date']
    list_filter = ['installment_number']
    search_fields = ['student__name', 'student__student_code']


@admin.register(Receipt)
class ReceiptAdmin(admin.ModelAdmin):
    list_display = ['receipt_number', 'student', 'total_paid', 'remaining_amount', 'created_at']
    search_fields = ['student__name', 'receipt_number']


@admin.register(UniformStatus)
class UniformStatusAdmin(admin.ModelAdmin):
    list_display = ['student', 'is_delivered', 'delivered_at']
    list_filter = ['is_delivered']


@admin.register(Result)
class ResultAdmin(admin.ModelAdmin):
    list_display = ['student', 'total_score']
    search_fields = ['student__name']


@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ['name', 'email', 'subject', 'is_read', 'created_at']
    list_filter = ['is_read', 'created_at']
    search_fields = ['name', 'email', 'subject', 'message']
    readonly_fields = ['name', 'email', 'phone', 'subject', 'message', 'created_at']
    list_editable = ['is_read']
