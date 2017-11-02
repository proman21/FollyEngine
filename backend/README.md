# Real Engine -- Backend

## Prerequisies

You will need to have python 3.6.

## Run on a Unix-like OS

Navigate to the `backend` directory.

```sh
$ cd backend
```

Then create a virtual environment.

```sh
$ python -m venv venv
$ . venv/bin/activate
```

Then install in development mode (`-e`) using `pip`.

```sh
$ pip install -e .
```

Make a directory called `instance`

```sh
$ mkdir instance
```

Initialise the database.

```sh
$ python init_db.py
```

Then run the development server.

```sh
$ python run.py
```

## Run on Windows

```bat
> cd backend
> python -m venv venv
> venv\Scripts\activate.bat
> pip install -e.
> mkdir instance
> python init_db.py
> python run.py
```
