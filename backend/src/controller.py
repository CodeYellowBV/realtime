import json
import os
import requests
from models import Entry, Project


class Controller():

    # The type is like addEntry of getProject
    # Split the type into a method and a class
    def handle(self, db, message):
        if message == 'ping':
            # todo keepalive logic
            return 'pong'

        body = json.loads(message)

        if body['type'] == 'authenticate':
            return self.auth(db, body)
        # TODO just split on first uppercase
        elif body['type'].startswith('save'):
            method = 'save'
        elif body['type'].startswith('get'):
            method = 'get'

        class_name = body['type'].split(method)[1]

        # Get the Class from string 'Class'
        target = globals()[class_name]

        # Call the method with the class as param
        return getattr(self, method)(db, target, body)

    def save(self, db, cls, body):
        data = body['data']

        # Create instance if id is not given
        if 'id' in data and data['id'] is not None:
            m = db.session.query(cls).get(data['id'])
            m.parse(data)

        else:
            m = cls(data)

        db.session.add(m)
        db.session.commit()

        result = m.dump()
        return json.dumps(result)

    def auth(self, db, body):
        print('auth')
        data = {
            'client_id': os.environ.get('CY_APP_PHABRICATOR_CLIENT_ID'),
            'client_secret': os.environ.get('CY_APP_PHABRICATOR_CLIENT_SECRET'),
            'redirect_uri': os.environ.get('CY_APP_REDIRECT_URI'),
            'code': body['data']['code'],
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

        return json.dumps({
            'type': 'authenticate',
            'data': {
                'id': 'TODO',
                'username': res['userName'],
                'email': res['primaryEmail'],
                'avatar_url': res['image'],
                'display_name': res['realName'],
            }
        })
