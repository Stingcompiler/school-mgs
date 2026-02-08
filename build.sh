#!/usr/bin/env bash
# exit on error
set -o errexit

echo "Deploying..."

# 1. Enter the backend folder
cd backend

# 2. Install Python requirements
pip install -r requirements.txt

# 3. Collect static files
python manage.py collectstatic --noinput

# 4. Run Migrations
python manage.py migrate