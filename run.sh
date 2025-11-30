#!/bin/bash
export FLASK_APP=wsgi:app
gunicorn --bind 0.0.0.0:8000 wsgi:app --workers 4 --threads 2
