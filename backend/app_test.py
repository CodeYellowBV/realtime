from flask import Flask
import unittest

from app import app, db
from src.models import Project
# from constants import test_logs


class CyTestCase(unittest.TestCase):
    def setUp(self):
        """
        Creates a new database for the unit test to use
        """
        app.config['TESTING'] = True
        app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite://'
        db.create_all()

    def tearDown(self):
        """
        Ensures that the database is emptied for next unit test
        """
        db.drop_all()

    def test_foo(self):
        project = Project({
            'name': '__TEST',
            'description': 'SHOULD NOT BE IN PSQL',
        }, None)
        db.session.add(project)
        db.session.commit()
        assert True


if __name__ == '__main__':
    unittest.main()
