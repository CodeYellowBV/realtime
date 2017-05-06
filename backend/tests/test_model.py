from app import app, db
from src.models import Project
import unittest


class FindCase(unittest.TestCase):
    def setUp(self):
        """
        Creates a new database for the unit test to use
        """
        app.config['TESTING'] = True
        app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite://'
        db.create_all()
        pRex = Project({'name': 'rex', 'description': 'voip'})
        db.session.add(pRex)
        pTrs = Project({'name': 'trs', 'description': 'medication'})
        db.session.add(pTrs)
        db.session.commit()

    def tearDown(self):
        """
        Ensures that the database is emptied for next unit test
        """
        db.drop_all()

    def test_find_noscope(self):
        cProject = Project.find(db.session, {})
        assert len(cProject) == 2

    def test_find_scope_string(self):
        cProject = Project.find(db.session, {'name': 'rex'})
        assert len(cProject) == 1
        assert cProject.models[0].name == 'rex'
        assert cProject.models[0].description == 'voip'
