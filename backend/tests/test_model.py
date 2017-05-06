from app import app, db
from src.models import Project, Entry
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

        eRex = Entry({
            'started_at': '2017-05-06T12:56:54+02:00',
            'project': 1,
        })
        eRex2 = Entry({
            'started_at': '2017-05-06T12:56:54+02:00',
            'ended_at': '2017-05-06T14:56:54+02:00',
            'project': 1,
        })
        eTrs = Entry({
            'started_at': '2017-05-06T12:56:54+02:00',
            'ended_at': '2017-05-06T14:56:54+02:00',
            'project': 2,
        })
        db.session.add(eRex)
        db.session.add(eRex2)
        db.session.add(eTrs)
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

    def test_find_relation(self):
        cEntry = Entry.find(db.session, {'project': 1})
        assert len(cEntry) == 2
        assert cEntry.models[0].project_id == 1
        assert cEntry.models[1].project_id == 1

    def test_find_scope_multiple(self):
        cEntry = Entry.find(db.session, {'project': 1, 'ended_at': None})
        assert len(cEntry) == 1
        assert cEntry.models[0].id == 1
