@echo off
echo Starting Celery Worker...
cd backend
..\.venv\Scripts\python.exe -m celery -A app.workers.celery_app worker --loglevel=info --pool=solo
pause
