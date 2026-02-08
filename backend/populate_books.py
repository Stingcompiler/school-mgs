
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from school.models import Student, BookStatus

def populate_book_statuses():
    students = Student.objects.all()
    created_count = 0
    for student in students:
        if not hasattr(student, 'book_status'):
            BookStatus.objects.create(student=student)
            created_count += 1
            print(f"Created BookStatus for student: {student.name}")
    
    print(f"Total missing BookStatus created: {created_count}")

if __name__ == "__main__":
    populate_book_statuses()
