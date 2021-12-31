FROM python:3.7

ENV LANG C.UTF-8

ARG DEBIAN_FRONTEND=noninteractive
ARG UNDERCARD_LOCAL
ARG SECRET_KEY="secret"
ARG DATABASE_URL
ARG ONESIGNAL_APP_ID
ARG ONESIGNAL_USER_AUTH_KEY
ARG ONESIGNAL_REST_API_KEY

RUN echo "deb https://deb.debian.org/debian buster main" > /etc/apt/sources.list
RUN apt-get update && apt-get -y dist-upgrade
RUN apt install -y curl git gcc libpq-dev

WORKDIR /opt/webapp
COPY . .

RUN python -m pip install --upgrade pip
RUN pip install -r requirements.txt
RUN ./manage.py collectstatic --no-input

CMD python3 manage.py runserver