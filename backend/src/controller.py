# Make sure all non-model imports start with an underscore `_`
# We use globals() to dynamically load models from body['target']
# And we check that the target doesn't start with an underscore
# to prevent arbitrary code execution
import json as _json
import os as _os
import jwt as _jwt
import requests as _requests
import copy as _copy
from .models import Entry, Project, User


class Controller():
    db = None
    socketContainer = None
    message = None
    body = None
    currentUser = None

    def __init__(self, db, socketContainer, message):
        self.db = db
        self.socketContainer = socketContainer
        self.message = message

    # The type is like addEntry of getProject
    # Split the type into a method and a class
    def handle(self):
        if self.message == 'ping':
            # todo keepalive logic
            return 'pong'

        self.body = _json.loads(self.message)

        if self.body['type'] == 'authenticate':
            return self.do_auth()

        authorized = self.check_auth()
        if not authorized:
            return self.error('unauthorized')

        if self.body['type'] == 'bootstrap':
            return self.get_bootstrap()

        if 'target' not in self.body:
            return self.error('No target given')

        t = self.body['target'].title()
        if t not in globals() or t.startswith('_') or t == 'self':
            return self.error('Invalid target given')

        target = globals()[t]
        method = getattr(self, self.body['type'], None)

        if not method or self.body['type'] not in ['save', 'update', 'delete', 'subscribe', 'unsubscribe', 'get']:
            return self.error('Invalid type given')

        # Call the method with the class as param
        return method(target)

    def error(self, msg):
        return {
            'type': self.body['type'],
            'code': 'error',
            'message': msg if msg else '',
        }

    def get_bootstrap(self):
        output = _copy.copy(self.currentUser)
        # Remove session specific data as we only want the bootstrap to return
        # user data
        # dict.pop(key) errors if the key isn't found
        # But we expect a session to always include an exp(iration_date) so that's okay
        output.pop('exp')
        return {
            'type': self.body['type'],
            'code': 'success',
            'data': output,
        }

    def check_auth(self):
        if 'authorization' not in self.body:
            return False

        try:
            self.currentUser = _jwt.decode(self.body['authorization'], _os.environ.get('CY_SECRET_KEY'), algorithms=['HS256'])
        except _jwt.InvalidTokenError:
            return False

        return True

    def save(self, cls):
        data = self.body['data']

        # Create instance if id is not given
        if 'id' in data and data['id'] is not None:
            return self.error('ID given when saving, try using type=update')

        m = cls(data)

        self.db.session.add(m)
        self.db.session.commit()

        result = m.dump()
        return {
            'type': self.body['type'],
            'target': self.body['target'],
            'code': 'success',
            'data': result,
        }

    def update(self, cls):
        data = self.body['data']

        # Create instance if id is not given
        if 'id' not in data or data['id'] is None:
            return self.error('No id given')

        m = self.db.session.query(cls).get(data['id'])
        m.parse(data)

        self.db.session.add(m)
        self.db.session.commit()

        result = m.dump()
        return {
            'type': self.body['type'],
            'target': self.body['target'],
            'code': 'success',
            'data': result,
        }

    def delete(self, cls):
        data = self.body.get('data')
        if not data:
            return self.error('No data given')

        # Create instance if id is not given
        if 'id' not in data or data['id'] is None:
            return self.error('No id given')

        m = self.db.session.query(cls).get(data['id'])
        m.parse(data)

        self.db.session.delete(m)
        self.db.session.commit()

        result = m.dump()
        return {
            'type': self.body['type'],
            'target': self.body['target'],
            'code': 'success',
            'data': result,
        }

    def subscribe(self, cls):
        result = cls.find_all(self.db.session)

        scope = self.body['data'] if 'data' in self.body else {}

        # Mark the socket as subscribing so we know what is listening to what
        self.socketContainer.subscribe(self.body['requestId'], self.body['target'], scope)

        if 'requestId' not in self.body:
            return self.error('No requestId given')

        return {
            'type': 'publish',
            'target': self.body['target'],
            'code': 'success',
            'requestId': self.body['requestId'],
            'data': {
                'add': result.dump(),
                'update': [],
                'delete': [],
            }
        }

    def unsubscribe(self, cls):
        return self.error('TODO UNSUBSCRIBE')

    def do_auth(self):
        data = {
            'client_id': _os.environ.get('CY_PHABRICATOR_CLIENT_ID'),
            'client_secret': _os.environ.get('CY_PHABRICATOR_CLIENT_SECRET'),
            'redirect_uri': _os.environ.get('CY_REDIRECT_URI'),
            'code': self.body['data']['code'],
            'grant_type': 'authorization_code',
        }

        r1 = _requests.post(_os.environ.get('CY_PHABRICATOR_URL') + '/oauthserver/token/', params=data)

        if r1.status_code != 200:
            return self.error(r1.json()['error_description'])

        token = r1.json()['access_token']
        r2 = _requests.get(_os.environ.get('CY_PHABRICATOR_URL') + '/api/user.whoami', params={'access_token': token})
        res = r2.json()['result']
        user = self.db.session.query(User).filter(User.email == res['primaryEmail']).first()

        if not user:
            u = {
                'username': res['userName'],
                'email': res['primaryEmail'],
                'avatar_url': res['image'],
                'display_name': res['realName'],
            }
            user = User(u)
            self.db.session.add(user)
            self.db.session.commit()

        token = user.create_session()

        return {
            'type': 'authenticate',
            'code': 'success',
            'authorization': token,
        }
