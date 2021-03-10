from app import db
from dateutil import parser, tz
import datetime
import jwt
import os


class Collection():
    def __init__(self, models=[]):
        self.models = models

    def __len__(self):
        return len(self.models)

    def dump(self):
        return [m.dump() for m in self.models]


class Base(object):
    def __init__(self, data, currentUser=None):
        self.parse(data, currentUser, 'save')

    def parse(self, data, currentUser=None, reqType=None):
        for col in self.__table__.columns:
            key = col.name

            # If it is a foreign key, we check the input for the key without `_id`
            # EG if we are at col 'project_id' and it is a fk, we check the input for `project`
            if len(col.foreign_keys):
                assert key.endswith('_id')
                # Split the keyname in _, throw away the last part (_id) and join the rest
                key = '_'.join(key.split('_')[:-1])
                if key in data:
                    setattr(self, key + '_id', data[key])
                    continue

            if key in data:
                if str(col.type) == 'DATETIME' and data[key] is not None:
                    data[key] = parser.parse(data[key])

                setattr(self, key, data[key])

    def __repr__(self):
        return '<Model %r>' % self.id

    def dump(self):
        data = {}
        for col in self.__table__.columns:
            key = col.name
            val = getattr(self, key)

            # Return {'project': id} instead of {'project_id': id}
            if len(col.foreign_keys):
                assert key.endswith('_id')
                key = '_'.join(key.split('_')[:-1])

            if str(col.type) == 'DATETIME' and val is not None:
                # Make aware and format as iso
                val = val.replace(tzinfo=tz.tzlocal()).isoformat()

            data[key] = val
        return data

    @classmethod
    def find(cls, session, scope):
        query = session.query(cls)

        for col in cls.__table__.columns:
            dbKey = col.name
            scopeKey = dbKey

            # Translate 'project_id' to 'project', a relation key shorthand
            if len(col.foreign_keys):
                assert dbKey.endswith('_id')
                scopeKey = '_'.join(dbKey.split('_')[:-1])

            if dbKey in scope or scopeKey in scope:
                val = scope[scopeKey]
                query = query.filter_by(**{dbKey: val})
                continue

        # from pudb import set_trace; set_trace()
        return Collection(query.all())


class Entry(Base, db.Model):
    __tablename__ = 'entries'

    id = db.Column(db.Integer, primary_key=True)
    started_at = db.Column(db.DateTime)
    ended_at = db.Column(db.DateTime)
    description = db.Column(db.Text())
    ticket = db.Column(db.Integer)
    wbso = db.Column(db.Boolean)

    project_id = db.Column(db.Integer, db.ForeignKey('projects.id', ondelete='cascade'))
    project = db.relationship('Project',
        backref=db.backref('entries', lazy='dynamic', cascade='all, delete-orphan'))

    user_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='cascade'))
    user = db.relationship('User',
        backref=db.backref('entries', lazy='dynamic', cascade='all, delete-orphan'))

    def parse(self, data, currentUser, reqType):
        if currentUser:
            data['user'] = currentUser.id

        if reqType == 'save' and currentUser and currentUser.has_running_entries():
            raise Exception('User has running entries')

        return super(Entry, self).parse(data, currentUser, reqType)


class Project(Base, db.Model):
    __tablename__ = 'projects'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50))
    pmc = db.Column(db.String(50))
    description = db.Column(db.String(200))
    is_active = db.Column(db.Boolean)


class User(Base, db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(100))
    username = db.Column(db.String(50))
    display_name = db.Column(db.String(50))
    avatar_url = db.Column(db.String(300))
    still_working = db.Column(db.Boolean)

    def create_session(self):
        secret = os.environ.get('CY_SECRET_KEY')
        payload = self.dump()
        payload['exp'] = datetime.datetime.utcnow() + datetime.timedelta(weeks=8)
        return jwt.encode(payload, secret, algorithm='HS256').decode('utf-8')

    def has_running_entries(self):
        query = db.session.query(Entry).filter_by(user_id=self.id, ended_at=None)
        return query.count() > 0

    def is_authenticated(self):
        return True

    def is_active(self):
        return True

    def is_anonymous(self):
        return False

    def get_id(self):
        return unicode(self.id)

class Ticket(Base, db.Model):
    __tablename__ = 'tickets'

    number = db.Column(db.Integer, primary_key=True)

    # Errors will occur if the name of the ticket is longer than the maximum length
    # So better safe than sorry
    name = db.Column(db.String(500))