import json
import os
import requests
from .models import Entry, Project, User


class Controller():
    db = None
    message = None
    body = None

    def __init__(self, db, message):
        self.db = db
        self.message = message

    # The type is like addEntry of getProject
    # Split the type into a method and a class
    def handle(self):
        if self.message == 'ping':
            # todo keepalive logic
            return 'pong'

        self.body = json.loads(self.message)

        if self.body['type'] == 'authenticate':
            return self.auth()

        # TODO just split on first uppercase
        if self.body['type'].startswith('save'):
            method = 'save'
        elif self.body['type'].startswith('get'):
            method = 'get'

        class_name = self.body['type'].split(method)[1]

        # Get the Class from string 'Class'
        target = globals()[class_name]

        # Call the method with the class as param
        return getattr(self, method)(target)

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
        return json.dumps(result)

    def auth(self):
        data = {
            'client_id': os.environ.get('CY_APP_PHABRICATOR_CLIENT_ID'),
            'client_secret': os.environ.get('CY_APP_PHABRICATOR_CLIENT_SECRET'),
            'redirect_uri': os.environ.get('CY_APP_REDIRECT_URI'),
            'code': self.body['data']['code'],
            'grant_type': 'authorization_code',
        }

        r1 = requests.post(os.environ.get('CY_APP_PHABRICATOR_URL') + '/oauthserver/token/', params=data)

        if r1.status_code != 200:
            return json.dumps({
                'type': 'authenticate',
                'code': 'fail',
                'message': r1.json()['error_description']
            })

        token = r1.json()['access_token']

        r2 = requests.get(os.environ.get('CY_APP_PHABRICATOR_URL') + '/api/user.whoami', params={'access_token': token})

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
            'data': user.dump(),
            'authorization': token,
        })
