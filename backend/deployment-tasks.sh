python3 manage.py migrate
celery -A undercard_18898 worker -D -l INFO
celery -A undercard_18898 beat --detach -l INFO 
