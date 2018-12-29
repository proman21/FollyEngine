FROM python:3.6

RUN pip install pipenv

WORKDIR /app
COPY Pipfile* ./

RUN pipenv install --system --deploy

COPY . ./

EXPOSE 8000
