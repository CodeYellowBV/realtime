from flask_sqlalchemy import SQLAlchemy
db = SQLAlchemy()


class Model(db.Model):
    __abstract__ = True
    pass
