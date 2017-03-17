from ._common import db


class Tag(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50))

    activities = db.relationship('Activity',
        backref=db.backref('tag', lazy='dynamic'))

    claims = db.relationship('Claim',
        backref=db.backref('tag', lazy='dynamic'))

    def __init__(self, name):
        self.name = name

    def __repr__(self):
        return '<Tag %r>' % self.name
