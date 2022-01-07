release: python3 manage.py migrate
web: waitress-serve --port=$PORT undercard_18898.wsgi:application
worker: celery -A undercard_18898 worker --concurrency 2 --max-memory-per-child=100000 -l INFO --max-tasks-per-child=2
beat: celery -A undercard_18898 beat -l INFO