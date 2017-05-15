from app import app, db
from src.models import User, Entry
from src.controller import Controller
import unittest


class HandleCase(unittest.TestCase):
    def test_pong(self):
        c = Controller(None, None, 'ping')
        res = c.handle()
        assert res == 'pong'


class EntrySaveCase(unittest.TestCase):
    def setUp(self):
        """
        Creates a new database for the unit test to use
        """
        app.config['TESTING'] = True
        app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite://'
        db.create_all()

        self.uHenk = User({'username': 'Henk'})
        self.uKarel = User({'username': 'Karel'})
        db.session.add(self.uHenk)
        db.session.add(self.uKarel)
        db.session.commit()

        eHenk1 = Entry({
            'started_at': '2017-05-06T12:56:54+02:00',
            'user': 1,
        })

        db.session.add(eHenk1)
        db.session.commit()

    def tearDown(self):
        """
        Ensures that the database is emptied for next unit test
        """
        db.drop_all()

    # You can't save a new running Entry when another is still running
    def test_multiple_running_blocked(self):
        c = Controller(db, None, None)

        c.currentUser = self.uHenk
        c.body = {
            'data': {
                'started_at': '2017-05-06T13:56:54+02:00',
            },
            'type': 'save',
            'target': 'entry',
        }

        res = c.save(Entry)
        assert res['code'] == 'error'
        assert len(Entry.find(db.session, {})) == 1

    # A new entry when you close the first one
    # should be allowed
    def test_finished_new(self):
        c = Controller(db, None, None)

        c.currentUser = self.uHenk
        c.body = {
            'data': {
                'id': 1,
                'ended_at': '2017-05-06T17:56:54+02:00',
            },
            'type': 'update',
            'target': 'entry',
        }

        resUpdate = c.update(Entry)
        assert resUpdate['code'] == 'success'
        assert len(Entry.find(db.session, {})) == 1

        c.body = {
            'data': {
                'started_at': '2017-05-06T13:56:54+02:00',
            },
            'type': 'save',
            'target': 'entry',
        }

        resSave = c.save(Entry)
        assert resSave['code'] == 'success'
        assert len(Entry.find(db.session, {})) == 2

    # A running Entry for user1 should not matter for user2
    def test_multiple_running_multiuser(self):
        c = Controller(db, None, None)

        c.currentUser = self.uKarel
        c.body = {
            'data': {
                'started_at': '2017-05-06T13:56:54+02:00',
            },
            'type': 'save',
            'target': 'entry',
        }

        res = c.save(Entry)
        assert res['code'] == 'success'
        assert len(Entry.find(db.session, {})) == 2
