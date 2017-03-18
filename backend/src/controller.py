import json
# from app import app
from models import Entry, Project


class Controller():

    # The type is like addEntry of getProject
    # Split the type into a method and a class
    def handle(self, db, message):
        body = json.loads(message)

        # TODO just split on first uppercase
        if body['type'].startswith('save'):
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
        if 'id' in data:
            m = db.session.query(cls).get(data['id'])
            m.parse(data)

        else:
            m = cls(data)

        db.session.add(m)
        db.session.commit()

        result = m.dump()
        return json.dumps(result)
