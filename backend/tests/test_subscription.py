from src.hub import Subscription
import unittest


class Scope(unittest.TestCase):
    def setUp(self):
        self.subscription = Subscription(None, 42, 'person')

    def tearDown(self):
        # TODO, maybe fix socketContainer
        pass

    def test_different_target(self):
        result = self.subscription.is_in_scope('animal', {})
        assert result is False

    def test_no_scope(self):
        result = self.subscription.is_in_scope('person', {
            'name': 'de vries',
        })
        assert result is True

    def test_scope_mismatch(self):
        self.subscription.scope = {
            'name': 'henk',
        }
        result = self.subscription.is_in_scope('person', {
            'name': 'de vries',
        })
        assert result is False

    def test_scope_key_not_exist(self):
        self.subscription.scope = {
            'name': 'henk',
        }
        result = self.subscription.is_in_scope('person', {})
        assert result is False

    def test_scope_partial(self):
        self.subscription.scope = {
            'name': 'henk',
            'size': 'L'
        }
        result = self.subscription.is_in_scope('person', {
            'name': 'henk',
            'size': 'M',
        })
        assert result is False


class HandleEvent(unittest.testCase):
    def setUp(self):
        self.subscription = Subscription(None, 42, 'person')
