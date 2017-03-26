import json
import os
import jwt
import requests
import copy
from .models import Entry, Project, User


class Controller():
    db = None
    hub = None
    message = None
    body = None
    current_user = None

    def __init__(self, db, hub, message):
        self.db = db
        self.hub = hub
        self.message = message

    # The type is like addEntry of getProject
    # Split the type into a method and a class
    def handle(self):
        if self.message == 'ping':
            # todo keepalive logic
            return 'pong'

        self.body = json.loads(self.message)

        if self.body['type'] == 'authenticate':
            return self.do_auth()

        authorized = self.check_auth()
        if not authorized:
            return self.error('unauthorized')

        if self.body['type'] == 'bootstrap':
            return self.get_bootstrap()

        if 'target' not in self.body:
            return self.error('No target given')

        if self.body['target'] not in globals():
            return self.error('Invalid target given')

        target = globals()[self.body['type']]
        method = getattr(self, self.body['type'])

        if not method:
            return self.error('No valid type given')

        # Call the method with the class as param
        return method(target)

    def error(self, msg):
        return json.dumps({
            'type': self.body['type'],
            'code': 'error',
            'message': msg if msg else '',
        })

    def get_bootstrap(self):
        output = copy.copy(self.current_user)
        # Remove session specific data as we only want the bootstrap to return
        # user data
        # dict.pop(key) errors if the key isn't found
        # But we expect a session to always include an exp(iration_date) so that's okay
        output.pop('exp')
        return json.dumps({
            'type': self.body['type'],
            'data': output,
        })

    def check_auth(self):
        if 'authorization' not in self.body:
            return False

        try:
            self.current_user = jwt.decode(self.body['authorization'], os.environ.get('CY_SECRET_KEY'), algorithms=['HS256'])
        except jwt.InvalidTokenError:
            return False

        return True

    def save(self, cls):
        data = self.body['data']

        # Create instance if id is not given
        if 'id' in data and data['id'] is not None:
            m = self.db.session.query(cls).get(data['id'])
            m.parse(data)

        else:
            m = cls(data)

        self.db.session.add(m)
        self.db.session.commit()

        result = m.dump()
        return json.dumps({
            'type': self.body['type'],
            'code': 'success',
            'data': result,
        })

    def do_auth(self):
        data = {
            'client_id': os.environ.get('CY_PHABRICATOR_CLIENT_ID'),
            'client_secret': os.environ.get('CY_PHABRICATOR_CLIENT_SECRET'),
            'redirect_uri': os.environ.get('CY_REDIRECT_URI'),
            'code': self.body['data']['code'],
            'grant_type': 'authorization_code',
        }

        r1 = requests.post(os.environ.get('CY_PHABRICATOR_URL') + '/oauthserver/token/', params=data)

        if r1.status_code != 200:
            return json.dumps({
                'type': 'authenticate',
                'code': 'error',
                'message': r1.json()['error_description']
            })

        token = r1.json()['access_token']
        r2 = requests.get(os.environ.get('CY_PHABRICATOR_URL') + '/api/user.whoami', params={'access_token': token})
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

        return json.dumps({
            'type': 'authenticate',
            'authorization': token,
        })
