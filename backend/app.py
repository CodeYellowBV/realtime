# from flask import Flask, jsonify, request
# from settings import SETTINGS
# from db import db, Activity, Claim, Tag
# from datetime import datetime
# from flask_cors import CORS
# from dateutil import parser
# import pytz
# # import iso8601

# # basedir = os.path.abspath(os.path.dirname(__file__))
# app = Flask(__name__)
# CORS(app)

from settings import Settings
from flask import Flask
from flask_sockets import Sockets
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
app.config.from_object(Settings)
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
sockets = Sockets(app)
db = SQLAlchemy(app)


from src.controller import Controller

# def from_iso8601(iso_dt):
#     dt_local = parser.parse(iso_dt)
#     dt_utc = dt_local.astimezone(pytz.utc)
#     return dt_utc.replace(tzinfo=None)


@app.route('/api/')
def home():
    return 'Hello World!'


@sockets.route('/api/echo')
def echo_socket(ws):
    while not ws.closed:
        message = ws.receive()
        ws.send(message)


@sockets.route('/api/')
def open_socket(ws):
    while not ws.closed:
        message = ws.receive()
        if message:
            controller = Controller(db, message)
            res = controller.handle()
            ws.send(res)
