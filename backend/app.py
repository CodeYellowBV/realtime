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
import logging
from flask_sockets import Sockets
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
app.config.from_object(Settings)
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
sockets = Sockets(app)
db = SQLAlchemy(app)


from src.hub import Hub
app.hub = Hub()


@sockets.route('/api/')
def open_socket(ws):
    socket = app.hub.add(ws)
    while not socket.ws.closed:
        message = socket.ws.receive()
        if message:
            try:
                socket.handle(db, message)
                # do something here
            except Exception as e:
                logging.error(e, exc_info=True)
