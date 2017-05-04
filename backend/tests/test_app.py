from app import app, db
from src.models import Project
import unittest


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

    def test_db(self):
        project = Project({
            'name': '__TEST',
            'description': 'SHOULD NOT BE IN PSQL',
        }, None)
        assert project.id is None
        db.session.add(project)
        db.session.commit()
        assert project.id == 1
