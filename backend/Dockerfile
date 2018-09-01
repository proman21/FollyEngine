FROM python:3.6

RUN pip install pipenv

WORKDIR /app
COPY Pipfile* ./

RUN pipenv install --system --deploy

COPY . ./

EXPOSE 8000

CMD ["gunicorn", "-b", "0.0.0.0:8000", "follyengine.wsgi"]
