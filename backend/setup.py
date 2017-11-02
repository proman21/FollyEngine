import setuptools

setuptools.setup(
    name='RealEngine',
    version='0.1.0',
    description='Game Engine for Real Life',
    packages=[
        'flask_app',
        'flask_app.actions',
    ],
    install_requires=[
        'flask',
        'flask-sqlalchemy',
        'requests',
    ],
    test_suite='tests',
    tests_require=[
        'flask',
        'flask-sqlalchemy',
    ],
)
