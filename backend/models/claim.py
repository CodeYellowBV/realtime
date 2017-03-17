from ._common import db
from datetime import datetime


class Claim(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(50))
    description = db.Column(db.Text())
    created_at = db.Column(db.DateTime)

    tag_id = db.Column(db.Integer, db.ForeignKey('tag.id'))
    tag = db.relationship('Tag',
        backref=db.backref('claims', lazy='dynamic'))

    activities = db.relationship('Activity',
        backref=db.backref('claim', lazy='dynamic'))

    def __init__(self, title, tag, description='', created_at=None):
        self.title = title
        self.tag = tag
        self.description = description
        if created_at is None:
            created_at = datetime.utcnow()

    def __repr__(self):
        return '<Claim %r>' % self.title
