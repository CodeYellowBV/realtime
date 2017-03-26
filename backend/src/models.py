from app import db
from dateutil import parser, tz
import datetime
import jwt
import os

jwt.encode({'some': 'payload'}, 'secret', algorithm='HS256')

# from datetime import datetime
# from sqlalchemy.dialects.postgresql import JSON


def get_iso8601(ts):
    return ts.strftime('%Y-%m-%dT%H:%M:%S%z+0000')


class Base(object):
    def __init__(self, data):
        self.parse(data)

    def parse(self, data):
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
        return '<Entry %r>' % self.id

    def dump(self):
        data = {}
        for col in self.__table__.columns:
            key = col.name
            val = getattr(self, key)

            if str(col.type) == 'DATETIME' and val is not None:
                # Make aware and format as iso
                val = val.replace(tzinfo=tz.tzlocal()).isoformat()

            data[key] = val
        return data


class Entry(Base, db.Model):
    __tablename__ = 'entries'

    id = db.Column(db.Integer, primary_key=True)
    started_at = db.Column(db.DateTime)
    ended_at = db.Column(db.DateTime)
    description = db.Column(db.Text())

    project_id = db.Column(db.Integer, db.ForeignKey('projects.id'))
    project = db.relationship('Project',
        backref=db.backref('entries', lazy='dynamic'))

    @staticmethod
    def find_all(session):
        return (
            session.query(Entry)
            .order_by(Entry.started_at.desc())
            .all()
        )

    @staticmethod
    def transform(model):
        print('Entry transform')
        return {
            'id': model.id,
            'started_at': get_iso8601(model.started_at) if model.ended_at is not None else '',
            'ended_at': get_iso8601(model.ended_at) if model.ended_at is not None else '',
            'description': model.description,
            'project': Project.transform(model.project) if model.project else None,
        }

    @staticmethod
    def get_collection(session):
        collection = Entry.find_all(session)
        output = []
        for model in collection:
            output.append(Entry.transform(model))
        return output


class Project(Base, db.Model):
    __tablename__ = 'projects'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50))
    description = db.Column(db.String(200))

    def __repr__(self):
        return '<Project %r>' % self.name

    @staticmethod
    def find_all(session):
        return (
            session.query(Project)
            .all()
        )

    # copypasta
    @staticmethod
    def get_collection(session):
        collection = Project.find_all(session)
        output = []
        for model in collection:
            output.append(Project.transform(model))
        return output


class User(Base, db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(100))
    username = db.Column(db.String(50))
    display_name = db.Column(db.String(50))
    avatar_url = db.Column(db.String(300))

    def create_session(self):
        secret = os.environ.get('CY_SECRET_KEY')
        payload = self.dump()
        payload['exp'] = datetime.datetime.utcnow() + datetime.timedelta(weeks=8)
        return jwt.encode(payload, secret, algorithm='HS256').decode('utf-8')

    def is_authenticated(self):
        return True

    def is_active(self):
        return True

    def is_anonymous(self):
        return False

    def get_id(self):
        return unicode(self.id)
