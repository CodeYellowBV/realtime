from ._common import db
from datetime import datetime


class Activity(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    started_at = db.Column(db.DateTime)
    ended_at = db.Column(db.DateTime)

    tag_id = db.Column(db.Integer, db.ForeignKey('tag.id'))
    tag = db.relationship('Tag',
        backref=db.backref('activities', lazy='dynamic'))

    claim_id = db.Column(db.Integer, db.ForeignKey('claim.id'))
    claim = db.relationship('Claim',
        backref=db.backref('activities', lazy='dynamic'))

    def __init__(self, tag, claim=None, started_at=None, ended_at=None):
        self.tag = tag
        self.claim = claim
        if started_at is None:
            started_at = datetime.utcnow()
        self.ended_at = ended_at

    def __repr__(self):
        return '<Activity %r>' % self.id
