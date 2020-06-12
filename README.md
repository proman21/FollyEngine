# Folly Engine: A Game Engine for the Real World.

Folly Engine is a tool for people designing interactive experiences using smart props.

## Background

This was a project I worked on for my university coursework. Our client was a interactive theatre designer who had worked on many audience-interactive public theatre experiences. Their goal with this project was to create a tool that allowed an experience designer with no prior experience with programming to build a game using smart props.

## Prior Art

The concept behind the project was inspired by tools like [Blueprints in Unreal Engine][1] and [Touch Designer][2].

The project also derived some of it's ideas from game design, one of which was incorporating a [Entity-Component System][3]

[1]: https://docs.unrealengine.com/en-US/Engine/Blueprints/index.html
[2]: https://derivative.ca/product
[3]: https://en.wikipedia.org/wiki/Entity_component_system

## Project Structure

The project consists of:

- **User Interface (`frontend/`):** the frontend GUI built using Angular
- **Backend Server (`backend/`):** a Python server that runs the GUI and talks to devices

## Setup

First, make sure you have **Docker** and **pipenv** installed on your machine.
Issue the following command to check.

```sh
$ pipenv --version
```

If no version information is shown, pipenv hasn't installed properly. Install
using.

```sh
$ pip install --user pipenv
```

Then, install the development dependencies using pipenv.

```sh
$ pipenv install --dev
```

You will now have `docker-compose` available in a Python virtual environment.
You can use `pipenv run docker-compose` to run docker-compose without needing to
activate the virtual environment. `pipenv run dc` is a shortcut to avoid typing.

`pipenv run dc up` will run the project at `http://localhost:8000/`.

## License

This repository is licensed under the MIT license. The text of license can be found in the `LICENSE` file.
