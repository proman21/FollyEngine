.PHONY: default develop install build test clean

default: develop

run:
	python run.py

develop:
	pip install -e .
	# python setup.py develop

install:
	pip install .
	# python setup.py install

build:
	python setup.py build

test:
	python setup.py test

venv:
	python -m venv venv

clean:
	python setup.py clean
	rm -rf venv/ build/ dist/ *.egg-info
	find . -type f -name "*.pyc" -delete
	find . -type d -name "__pycache__" -delete
