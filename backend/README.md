# FollyEngine Backend

## Backend Setup

Make sure you have Python 3.6 and pipenv installed on your machine.

Install the python packages for Django and the backend.

```sh
$ pipenv install
```

Make sure the Docker image for the backend is built

```sh
$ docker-compose build api
```

Run the migrations onto the database.

```sh
$ docker-compose run --rm api migrate
```

Create a new superuser so you can access the system

```sh
$ docker-compose run --rm api createsuperuser
```

Now you can bring up the whole stack using

```sh
$ docker-compose up -d
```
