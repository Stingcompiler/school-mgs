"""
Models for School Management System.
"""

import uuid
from django.db import models
from django.utils import timezone


class Student(models.Model):
    """Student model with personal and academic information."""
    
    ACADEMIC_LEVELS = [
        (1, 'First Year'),
        (2, 'Second Year'),
        (3, 'Third Year'),
    ]
    
    SPECIALIZATIONS = [
        ('Gen', 'General'),
        ('Sci', 'Scientific'),
        ('Lit', 'Literary'),
    ]
    
    student_code = models.CharField(max_length=20, unique=True)
    name = models.CharField(max_length=200)
    phone = models.CharField(max_length=20, blank=True)
    address = models.TextField(blank=True)
    parent_name = models.CharField(max_length=200)
    parent_phone = models.CharField(max_length=20)
    academic_level = models.IntegerField(choices=ACADEMIC_LEVELS, default=1)
    specialization = models.CharField(max_length=3, choices=SPECIALIZATIONS, default='Gen')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.student_code} - {self.name}"
    
    @property
    def total_paid(self):
        """Calculate total amount paid by student."""
        return self.installments.aggregate(total=models.Sum('amount'))['total'] or 0
    
    @property
    def remaining_amount(self):
        """Calculate remaining amount (assuming 500,000 total for 5 installments of 100,000)."""
        total_fee = 500000
        return total_fee - self.total_paid


class Installment(models.Model):
    """Payment installment model."""
    
    INSTALLMENT_CHOICES = [
        (1, 'Installment 1'),
        (2, 'Installment 2'),
        (3, 'Installment 3'),
        (4, 'Installment 4'),
        (5, 'Installment 5'),
    ]
    
    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name='installments')
    installment_number = models.IntegerField(choices=INSTALLMENT_CHOICES)
    amount = models.DecimalField(max_digits=10, decimal_places=2, default=100000)
    payment_date = models.DateTimeField(default=timezone.now)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['installment_number']
        unique_together = ['student', 'installment_number']
    
    def __str__(self):
        return f"{self.student.name} - Installment {self.installment_number}"


class Receipt(models.Model):
    """Receipt model - read only, auto-generated."""
    
    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name='receipts')
    receipt_number = models.UUIDField(default=uuid.uuid4, unique=True, editable=False)
    total_paid = models.DecimalField(max_digits=10, decimal_places=2)
    remaining_amount = models.DecimalField(max_digits=10, decimal_places=2)
    installment = models.OneToOneField(Installment, on_delete=models.CASCADE, related_name='receipt')
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Receipt {self.receipt_number} - {self.student.name}"


class UniformStatus(models.Model):
    """Uniform delivery status - auto-updated when first installment is paid."""
    
    student = models.OneToOneField(Student, on_delete=models.CASCADE, related_name='uniform_status')
    is_delivered = models.BooleanField(default=False)
    delivered_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name_plural = 'Uniform Statuses'
    
    def __str__(self):
        status = "Delivered" if self.is_delivered else "Not Delivered"
        return f"{self.student.name} - Uniform: {status}"


class BookStatus(models.Model):
    """Book delivery status - auto-updated when first installment is paid (100,000)."""
    
    student = models.OneToOneField(Student, on_delete=models.CASCADE, related_name='book_status')
    is_delivered = models.BooleanField(default=False)
    delivered_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name_plural = 'Book Statuses'
    
    def __str__(self):
        status = "Delivered" if self.is_delivered else "Not Delivered"
        return f"{self.student.name} - Books: {status}"


class Result(models.Model):
    """Student academic result (aggregate)."""
    
    student = models.OneToOneField(Student, on_delete=models.CASCADE, related_name='result')
    total_score = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def update_total_score(self):
        """Recalculate total score from subjects."""
        total = self.subjects.aggregate(total=models.Sum('score'))['total'] or 0
        self.total_score = total
        self.save()
    
    def __str__(self):
        return f"{self.student.name} - Total Score: {self.total_score}"


class SubjectResult(models.Model):
    """Individual subject result."""
    
    result = models.ForeignKey(Result, on_delete=models.CASCADE, related_name='subjects')
    subject_name = models.CharField(max_length=100)
    score = models.DecimalField(max_digits=5, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ['result', 'subject_name']
    
    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        self.result.update_total_score()
        
    def delete(self, *args, **kwargs):
        super().delete(*args, **kwargs)
        self.result.update_total_score()

    def __str__(self):
        return f"{self.subject_name}: {self.score}"


class ContactMessage(models.Model):
    """Contact message from public visitors."""
    
    name = models.CharField(max_length=200)
    email = models.EmailField()
    phone = models.CharField(max_length=20, blank=True)
    subject = models.CharField(max_length=300)
    message = models.TextField()
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']
        verbose_name = 'رسالة تواصل'
        verbose_name_plural = 'رسائل التواصل'
    
    def __str__(self):
        return f"{self.name} - {self.subject[:50]}"
