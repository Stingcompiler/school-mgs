from django.test import TestCase
from school.models import Student, Installment, UniformStatus, Receipt

class SignalVerificationTest(TestCase):
    def test_uniform_automation(self):
        print("\n--- Testing Uniform Automation Logic ---")
        
        # 1. Create a student
        student = Student.objects.create(
            student_code="TEST001",
            name="Test Student",
            parent_name="Parent",
            parent_phone="123456",
            academic_level=1
        )
        print(f"Created Student: {student.name}")
        
        # Verify UniformStatus is created (default False)
        self.assertTrue(hasattr(student, 'uniform_status'))
        self.assertFalse(student.uniform_status.is_delivered)
        print("Initial UniformStatus created: False (Correct)")
        
        # 2. Pay Installment #2 (Should NOT unlock uniform)
        Installment.objects.create(
            student=student,
            installment_number=2,
            amount=100
        )
        student.refresh_from_db()
        self.assertFalse(student.uniform_status.is_delivered)
        print("Paid Installment #2: Uniform still locked (Correct)")
        
        # 3. Pay Installment #1 (Should unlock uniform)
        Installment.objects.create(
            student=student,
            installment_number=1,
            amount=100
        )
        student.refresh_from_db()
        self.assertTrue(student.uniform_status.is_delivered)
        print("Paid Installment #1: Uniform delivered! (Correct)")
        
        print("--- Verification Successful ---\n")

    def test_receipt_generation(self):
        print("\n--- Testing Receipt Generation ---")
        student = Student.objects.create(
            student_code="TEST002",
            name="Receipt Test",
            parent_name="Parent",
            parent_phone="123",
            academic_level=1
        )
        
        # Mock payment view logic
        installment = Installment.objects.create(
            student=student,
            installment_number=1,
            amount=100
        )
        receipt = Receipt.objects.create(
            student=student,
            installment=installment,
            total_paid=student.total_paid,
            remaining_amount=student.remaining_amount
        )
        
        self.assertIsNotNone(receipt.receipt_number)
        print(f"Receipt Generated: #{receipt.receipt_number}")
        print(f"Total Paid: {receipt.total_paid}, Remaining: {receipt.remaining_amount}")
        self.assertEqual(receipt.total_paid, 100)
        print("--- Receipt Verification Successful ---\n")
