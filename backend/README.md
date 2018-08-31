# FollyEngine Backend

## Backend Setup

Make sure you have Python 3.7 and pipenv installed on your machine.

Install the python packages for the Django.

```sh
$ pipenv install
```

Run the migrations onto the database.

```sh
$ python manage.py migrate
```

Create a new superuser so you can access the system

```sh
$ python manage.py createsuperuser
```

Run the development server

```sh
$ python manage.py runserver
```
