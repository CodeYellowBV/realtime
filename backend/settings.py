import os
from dotenv import load_dotenv, find_dotenv

if 'CY_ENV_OVERRIDE_FILE' in os.environ:
    load_dotenv(os.environ['CY_ENV_OVERRIDE_FILE'])
load_dotenv(os.environ.get('CY_ENV_FILE', find_dotenv('.env')))

# Copy the settings for the frontend
FRONTEND_SETTINGS = {}
for e in os.environ:
    if e.startswith('CY_FRONTEND'):
        FRONTEND_SETTINGS[e] = os.environ.get(e)


class Settings(object):
    DEBUG = os.environ.get('CY_DEBUG')
    CSRF_ENABLED = True
    SECRET_KEY = os.environ.get('CY_SECRET_KEY')
    SQLALCHEMY_DATABASE_URI = 'postgresql+psycopg2://' + os.environ.get('CY_DB_USER') + '@' + \
                              os.environ.get('CY_DB_HOST', '') + '/' + os.environ.get('CY_DB_NAME')
    FRONTEND_SETTINGS = FRONTEND_SETTINGS
