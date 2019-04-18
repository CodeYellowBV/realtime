# Make sure all non-model imports start with an underscore `_`
# We use globals() to dynamically load models from body['target']
# And we check that the target doesn't start with an underscore
# to prevent arbitrary code execution
import json as _json
import os as _os
import jwt as _jwt
import requests as _requests
import copy as _copy
from datetime import datetime, timedelta
from .models import Entry, Project, User, Ticket, Collection


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

        if self.body['type'] == 'env':
            return {
                'type': 'env',
                'code': 'env',
                'env': {
                    'CY_FRONTEND_PHABRICATOR_URL': _os.environ.get('CY_FRONTEND_PHABRICATOR_URL'),
                    'CY_FRONTEND_PHABRICATOR_CLIENT_ID': _os.environ.get('CY_FRONTEND_PHABRICATOR_CLIENT_ID')
                }
            }

        if self.body['type'] == 'authenticate':
            return self.do_auth()

        authorized = self.check_auth()
        if not authorized:
            return self.error('unauthorized')
        if self.body['type'] == 'bootstrap':
            return self.get_bootstrap()
        if self.body['type'] == 'unsubscribe':
            return self.unsubscribe(self.body['requestId'])
        if self.body['type'] == 'enableUser':
            return self.enableUser(self.body['data'])
        if self.body['type'] == 'disableUser':
            return self.disableUser(self.body['data'])

        # Burhan needed a quick hack to improve the real-phab summary plugin, so... here we go!
        if(self.body['type'] == 'tickets'):
            tickets = self.body['tickets']

            # Outdated versions of real-phab won't do this
            hasTicketNames = False
            ticketNames = []
            try:
                ticketNames = self.body['ticketNames']
                hasTicketNames = True
            except KeyError:
                print('outdated real-phab')
            print('hasTicketNames is ' + str(hasTicketNames))
            reply = {
                'code': 'success',
                'type': 'tickets',
                'requestId': self.body['requestId'],
                'entries': {}
            }
            ticketNameIndex = 0
            for ticket in tickets:
                if hasTicketNames:
                    ticketEntries = self.db.session.query(Ticket).filter(Ticket.number == ticket)

                    # Check if we already know the ticket name
                    hasTicketNameAlready = False
                    for ticketEntry in ticketEntries:
                        hasTicketNameAlready = True

                    print('hasTicketNameAlready is ' + str(hasTicketNameAlready))

                    if not hasTicketNameAlready:
                        print('Assign name ' + ticketNames[ticketNameIndex] + ' to number ' + str(ticket))
                        self.db.session.add(Ticket({
                            'number': ticket,
                            'name': ticketNames[ticketNameIndex]
                        }))
                    ticketNameIndex += 1
                currentEntries = self.db.session.query(Entry).filter(Entry.ticket == ticket)
                entriesAsDict = []
                for entry in currentEntries:
                    entriesAsDict.append({
                        'user': entry.user_id,
                        'project': entry.project_id,
                        'ticket': entry.ticket,
                        'description': entry.description,
                        'started_at': str(entry.started_at),
                        'ended_at': str(entry.ended_at),
                        'wbso': entry.wbso,
                        'id': entry.id
                    });
                reply['entries'][ticket] = entriesAsDict
            if hasTicketNames:
                self.db.session.commit()
            return reply

        # test these new methods and inspect closely
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
        output = _copy.copy(self.currentUser.dump())
        return {
            'type': self.body['type'],
            'code': 'success',
            'data': output
        }

    def check_auth(self):
        if 'authorization' not in self.body:
            return False

        try:
            userData = _jwt.decode(self.body['authorization'], _os.environ.get('CY_SECRET_KEY'), algorithms=['HS256'])
            self.currentUser = User(userData)
        except _jwt.InvalidTokenError:
            return False

        return True

    def save(self, cls):
        data = self.body['data']

        # Create instance if id is not given
        if 'id' in data and data['id'] is not None:
            return self.error('ID given when saving, try using type=update')

        try:
            m = cls(data, self.currentUser)
        except Exception as e:
            return self.error(str(e))

        self.db.session.add(m)
        self.db.session.commit()

        result = m.dump()
        return {
            'type': self.body['type'],
            'target': self.body['target'],
            'code': 'success',
            'data': result,
        }

    def enableUser(self, username):
        user = self.db.session.query(User).filter(User.username == username).first()
        user.still_working = True;
        self.db.session.commit()
        return {
            'type': 'enableUser',
            'code': 'success'
        }

    def disableUser(self, username):
        user = self.db.session.query(User).filter(User.username == username).first()
        user.still_working = False;
        self.db.session.commit()
        return {
            'type': 'disableUser',
            'code': 'success'
        }

    def update(self, cls):
        data = self.body['data']

        # Create instance if id is not given
        if 'id' not in data or data['id'] is None:
            return self.error('No id given')

        m = self.db.session.query(cls).get(data['id'])
        mSnapshot = m.dump()
        m.parse(data, self.currentUser, 'update')

        self.db.session.add(m)
        self.db.session.commit()

        result = m.dump()
        return {
            'type': self.body['type'],
            'target': self.body['target'],
            'snapshot': mSnapshot,
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
        scope = self.body['data'] if 'data' in self.body else {}

        send_limited = 'user' in scope and (not 'all' in scope) and (not 'ended_at' in scope)

        if send_limited:
            current_time = datetime.now()
            filter_time = current_time - timedelta(seconds=3600*24*90)
            user_id = scope['user']
            result = Collection(self.db.session.query(Entry).filter(Entry.user_id == user_id, Entry.started_at > filter_time).all()).dump()
        else:
            result = cls.find(self.db.session, scope).dump()

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
                'add': result,
                'update': [],
                'delete': [],
            }
        }

    def unsubscribe(self, reqId):
        if 'requestId' not in self.body:
            return self.error('No requestId given')

        success = self.socketContainer.unsubscribe(reqId)
        if not success:
            return self.error('Invavlid requestId given')

        return {
            'type': 'unsubscribe',
            'code': 'success',
            'requestId': self.body['requestId'],
        }

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
        print(str(res))
        user = self.db.session.query(User).filter(User.email == res['primaryEmail']).first()

        if not user:
            u = {
                'username': res['userName'],
                'email': res['primaryEmail'],
                'avatar_url': res['image'],
                'display_name': res['realName'],
                'still_working': not ('Disabled' in res['roles']),
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
