"""
Django signals for automatic business logic.
"""

from django.db.models.signals import post_save
from django.dispatch import receiver
from django.utils import timezone
from .models import Student, Installment, UniformStatus, BookStatus


@receiver(post_save, sender=Student)
def create_student_statuses(sender, instance, created, **kwargs):
    """Create UniformStatus and BookStatus when a new Student is created."""
    if created:
        UniformStatus.objects.create(student=instance)
        BookStatus.objects.create(student=instance)


@receiver(post_save, sender=Installment)
def update_statuses_on_first_installment(sender, instance, created, **kwargs):
    """
    Automatically set UniformStatus.is_delivered = True 
    and BookStatus.is_delivered = True
    when Installment #1 is created/paid and amount >= 100,000.
    """
    if created and instance.installment_number == 1 and instance.amount >= 100000:
        # Update Uniform Status
        uniform_status, _ = UniformStatus.objects.get_or_create(student=instance.student)
        if not uniform_status.is_delivered:
            uniform_status.is_delivered = True
            uniform_status.delivered_at = timezone.now()
            uniform_status.save()
            
        # Update Book Status
        book_status, _ = BookStatus.objects.get_or_create(student=instance.student)
        if not book_status.is_delivered:
            book_status.is_delivered = True
            book_status.delivered_at = timezone.now()
            book_status.save()
