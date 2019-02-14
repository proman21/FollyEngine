#!/usr/bin/env bash
set -eu

# Perform migrations on the database
python manage.py migrate

# Create administration user
python manage.py createadmin $FE_SU_USERNAME $FE_SU_EMAIL $FE_SU_PASSWORD

# Perform django checks based on environment
if [[ ${ENVIRON:-production} == "production " ]]; then
    python manage.py check --deploy
else
    python manage.py check
fi

# Run the django server
exec "$@"
