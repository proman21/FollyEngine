FROM python:3.6

WORKDIR /app
RUN pip install --no-cache-dir pipenv

COPY Pipfile* ./
RUN pipenv install --system --deploy

COPY folly_api/ ./folly_api

COPY gunicorn.conf gunicorn.conf
COPY logging.conf logging.conf

EXPOSE 8000

ENTRYPOINT ["gunicorn", "--config", "gunicorn.conf", "--log-config", "logging.conf", "-b", ":8000", "folly_api:app"]
