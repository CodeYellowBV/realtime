from dotenv import Dotenv
from os import path, environ as env

# First, parse env file and splice it into the OS environment
envpath = path.join(path.dirname(__file__), '..', '.env')
dotenv = Dotenv(envpath)
env.update(dotenv)

# Now, parse and set the settings dict
SETTINGS = {
    'DEBUG': env.get('CY_DEBUG', '').lower() == 'true',
    'DB_FILE': env.get('CY_DB_FILE', '').lower(),
}
