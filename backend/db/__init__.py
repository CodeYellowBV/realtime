from flask import Flask
from settings import SETTINGS
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + SETTINGS['DB_FILE']
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)


def get_iso8601(ts):
    return ts.strftime('%Y-%m-%dT%H:%M:%S%z+0000')


class Activity(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    started_at = db.Column(db.DateTime)
    ended_at = db.Column(db.DateTime)
    description = db.Column(db.Text())

    tag_id = db.Column(db.Integer, db.ForeignKey('tag.id'))
    tag = db.relationship('Tag',
        backref=db.backref('activities', lazy='dynamic'))

    claim_id = db.Column(db.Integer, db.ForeignKey('claim.id'))
    claim = db.relationship('Claim',
        backref=db.backref('activities', lazy='dynamic'))

    def __init__(self, tag, claim=None, description='', started_at=None, ended_at=None):
        self.tag = tag
        self.claim = claim
        self.description = description
        if started_at is None:
            started_at = datetime.utcnow()
        self.started_at = started_at
        self.ended_at = ended_at

    def __repr__(self):
        return '<Activity %r>' % self.id

    @staticmethod
    def get_latest_by_tag_id(session, tag_id):
        return (
            session.query(Activity)
            .filter(Activity.tag_id == tag_id)
            .order_by(Activity.started_at.desc())
            .first()
        )

    @staticmethod
    def find_all(session):
        return (
            session.query(Activity)
            .order_by(Activity.started_at.desc())
            .all()
        )

    @staticmethod
    def transform(model):
        return {
            'id': model.id,
            'started_at': get_iso8601(model.started_at),
            'ended_at': get_iso8601(model.ended_at) if model.ended_at is not None else '',
            'description': model.description,
            'tag': Tag.transform(model.tag) if model.tag else None,
            'claim': Claim.transform(model.claim) if model.claim else None
        }

    @staticmethod
    def get_collection(session):
        collection = Activity.find_all(session)
        output = []
        for model in collection:
            output.append(Activity.transform(model))
        return output


class Claim(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(50))
    description = db.Column(db.Text())
    created_at = db.Column(db.DateTime)

    tag_id = db.Column(db.Integer, db.ForeignKey('tag.id'))
    tag = db.relationship('Tag',
        backref=db.backref('claims', lazy='dynamic'))

    def __init__(self, title, tag, description='', created_at=None):
        self.title = title
        self.tag = tag
        self.description = description
        if created_at is None:
            created_at = datetime.utcnow()
        self.created_at = created_at

    def __repr__(self):
        return '<Claim %r>' % self.title

    @staticmethod
    def transform(model):
        return {
            'id': model.id,
            'title': model.title,
        }

    @staticmethod
    def get_latest_by_tag_id(session, tag_id):
        return (
            session.query(Claim)
            .filter(Claim.tag_id == tag_id)
            .order_by(Claim.created_at.desc())
            .first()
        )

    @staticmethod
    def find_all(session):
        return (
            session.query(Claim.title.distinct().label('title'))
            .all()
        )

    @staticmethod
    def get_collection(session):
        collection = Claim.find_all(session)
        output = []
        for model in collection:
            output.append(model.title)
        return output


class Tag(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    code = db.Column(db.String(50))
    description = db.Column(db.String(200))

    def __init__(self, code, description=''):
        self.code = code
        self.description = description

    def __repr__(self):
        return '<Tag %r>' % self.name

    def get_latest_claim(self):
        return self.claims.order_by(Claim.created_at.desc()).first()

    @staticmethod
    def transform(model, includes={}):
        claim = model.get_latest_claim()
        claim = Claim.transform(claim) if claim else None

        base = {
            'id': model.id,
            'code': model.code,
            'description': model.description,
            'claim': claim['id'] if claim else None
        }

        if 'claim' in includes:
            base['claim'] = claim

        return base

    @staticmethod
    def find_all(session):
        return (
            session.query(Tag)
            .all()
        )

    # copypasta
    @staticmethod
    def get_collection(session):
        collection = Tag.find_all(session)
        output = []
        for model in collection:
            output.append(Tag.transform(model, {'claim': True}))
        return output
