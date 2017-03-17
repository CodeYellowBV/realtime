import os
from dotenv import load_dotenv, find_dotenv

load_dotenv(find_dotenv())

# class Settings(object):
# 	DEBUG = False
# 	TESTING = False
# 	CSRF_ENABLED = True
# 	SECRET_KEY = 'this-really-needs-to-be-changed'
# 	SQLALCHEMY_DATABASE_URI = 'postgresql+psycopg2://' + os.environ.get('CY_DB_USER') + '@/' os.environ.get('CY_DB_NAME')


# class ProductionSettings(Settings):
# 	DEBUG = False


# class StagingSettings(Settings):
# 	DEVELOPMENT = True
# 	DEBUG = True


# class DevelopmentSettings(Settings):
# 	DEVELOPMENT = True
# 	DEBUG = True


# class TestingSettings(Settings):
# 	TESTING = True
