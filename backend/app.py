# from flask import Flask, jsonify, request
# from settings import SETTINGS
# from db import db, Activity, Claim, Tag
# from datetime import datetime
# from flask_cors import CORS
# from dateutil import parser
# import json
# import pytz
# # import iso8601

# # basedir = os.path.abspath(os.path.dirname(__file__))
# app = Flask(__name__)
# CORS(app)

from settings import Settings
from flask import Flask
from flask_socketio import SocketIO
from flask_sqlalchemy import SQLAlchemy
import os


app = Flask(__name__)
socketio = SocketIO(app)
app.config.from_object(Settings)
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# from models import Entry, Project


# def from_iso8601(iso_dt):
#     dt_local = parser.parse(iso_dt)
#     dt_utc = dt_local.astimezone(pytz.utc)
#     return dt_utc.replace(tzinfo=None)

@app.route('/api/')
def home():
    return 'Hello World!'

# if __name__ == '__main__':
#     socketio.run(app)

# @app.route('/api/activity', methods=['GET'])
# def activity_getcollection():
#     activities = Activity.get_collection(db.session)
#     return jsonify({'data': activities})


# @app.route('/api/claim', methods=['GET'])
# def claim_getcollection():
#     claims = Claim.get_collection(db.session)
#     return jsonify({'data': claims})


# @app.route('/api/tag', methods=['GET'])
# def tag_getcollection():
#     tags = Tag.get_collection(db.session)
#     return jsonify({'data': tags})

# @app.route('/api/tag/<int:tag_id>', methods=['PATCH'])
# def tag_patch(tag_id):
#     body = request.json

#     tag = db.session.query(Tag).get(tag_id)

#     if body.get('description'):
#         tag.description = body['description']

#     db.session.commit()
#     return json.dumps(Tag.transform(tag))


# @app.route('/api/claim', methods=['POST'])
# def claim_post():
#     body = request.json
#     # Get tag by tag_id
#     tag = db.session.query(Tag).get(body['tag_id'])
#     if not tag:
#         return "Tag {0} not found".format(body['tag_id'])

#     claim = Claim(body['title'], tag)
#     db.session.add(claim)

#     # If an open activity with that tag exists,
#     # link that claim to that activity
#     activity = Activity.get_latest_by_tag_id(db.session, tag.id)
#     if activity and not activity.ended_at:
#         activity.claim = claim

#     db.session.commit()
#     return json.dumps(Claim.transform(claim))


# @app.route('/api/activity/in', methods=['POST'])
# def activity_checkin():
#     body = request.json
#     # Get tag by tag_code
#     tag = db.session.query(Tag).filter(Tag.code == body['tag_code']).first()
#     if not tag:
#         tag = Tag(body['tag_code'])
#         db.session.add(tag)

#     activity = Activity.get_latest_by_tag_id(db.session, tag.id)

#     # If an activity for that tag still is open, error
#     if activity and not activity.ended_at:
#         return "Activity {0} still open for this tag".format(activity.id)

#     # If a claim for tag exists, set that claim
#     claim = Claim.get_latest_by_tag_id(db.session, tag.id)

#     activity = Activity(tag, claim)
#     db.session.commit()
#     return json.dumps(Activity.transform(activity))


# @app.route('/api/activity/out', methods=['POST'])
# def activity_checkout():
#     body = request.json
#     tag = db.session.query(Tag).filter(Tag.code == body['tag_code']).first()
#     if not tag:
#         return 'Tag {0} not found!'.format(body['tag_code'])

#     activity = Activity.get_latest_by_tag_id(db.session, tag.id)

#     if activity.ended_at:
#         return 'Activity {0} already checked out'.format(activity.id)

#     activity.ended_at = datetime.utcnow()
#     db.session.commit()
#     return json.dumps(Activity.transform(activity))


# @app.route('/api/activity/<int:activity_id>', methods=['PATCH'])
# def activity_patch(activity_id):
#     body = request.json

#     # Get activity by activity_id
#     activity = db.session.query(Activity).get(activity_id)

#     if body.get('description'):
#         activity.description = body['description']

#     if body.get('started_at'):
#         activity.started_at = from_iso8601(body['started_at'])

#     if body.get('ended_at'):
#         activity.ended_at = from_iso8601(body['ended_at'])

#     db.session.commit()
#     return json.dumps(Activity.transform(activity))


# if __name__ == '__main__':
#     app.run(debug=SETTINGS['DEBUG'])
