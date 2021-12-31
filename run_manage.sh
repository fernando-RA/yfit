python manage.py makemigrations

until python manage.py migrate; do
  sleep 2
  echo "Retry!";
done

echo "Django is ready.";

waitress-serve --port=$PORT undercard_18898.wsgi:application