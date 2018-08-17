# Real Engine: A Game Engine for the Real World

[![Build Status](https://travis-ci.org/RealEngine/Real_Engine.svg?branch=master)](https://travis-ci.org/RealEngine/Real_Engine)

## Project Structure

The project consists of:

- **User Interface (`frontend/`):** the frontend GUI
- **Backend Server (`backend/`):** a Python server that runs the GUI and talks to devices
- **Hardware (`hardware/`):** the device firmware and software

## Setup

First, make sure you have pipenv installed on your machine. Issue the following
command to check.

```sh
$ pipenv --version
```

If no version information is shown, pipenv hasn't installed properly.

Then, install the development dependencies using pipenv.

```
$ pipenv install --dev
```

You will now have `docker-compose` available in a Python virtual environment.
You can use `pipenv run docker-compose` to run docker-compose without needing to
activate the virtual environment. `pipenv run dc` is a shortcut to avoid typing.
