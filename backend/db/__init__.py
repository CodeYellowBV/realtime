from flask import Flask
from settings import SETTINGS
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql+psycopg2://vagrant@/cy-time'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)


def get_iso8601(ts):
	return ts.strftime('%Y-%m-%dT%H:%M:%S%z+0000')

class Activity(db.Model):
	__tablename__ = 'activities'

	id = db.Column(db.Integer, primary_key=True)
	started_at = db.Column(db.DateTime)
	ended_at = db.Column(db.DateTime)
	description = db.Column(db.Text())

	project_id = db.Column(db.Integer, db.ForeignKey('projects.id'))
	project = db.relationship('Project',
		backref=db.backref('activities', lazy='dynamic'))

	def __init__(self, project, description='', started_at=None, ended_at=None):
		self.project = project
		self.description = description
		if started_at is None:
			started_at = datetime.utcnow()
		self.started_at = started_at
		self.ended_at = ended_at

	def __repr__(self):
		return '<Activity %r>' % self.id

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
			'project': Project.transform(model.project) if model.project else None,
		}

	@staticmethod
	def get_collection(session):
		collection = Activity.find_all(session)
		output = []
		for model in collection:
			output.append(Activity.transform(model))
		return output

class Project(db.Model):
	__tablename__ = 'projects'

	id = db.Column(db.Integer, primary_key=True)
	name = db.Column(db.String(50))
	description = db.Column(db.String(200))

	def __init__(self, name, description=''):
		self.name = name
		self.description = description

	def __repr__(self):
		return '<Project %r>' % self.name

	@staticmethod
	def transform(model):
		return {
			'id': model.id,
			'name': model.name,
			'description': model.description,
		}

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
