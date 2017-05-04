from src.hub import Subscription
from unittest import TestCase, mock


class Scope(TestCase):
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


class HandleEvent(TestCase):
    def setUp(self):
        self.subscription = Subscription(None, 42, 'person')
        self.subscription.publish = mock.MagicMock(name='subscription.publish')

    def test_save_wrong_target(self):
        self.subscription.handle_event('animal', 'save', {'id': 1}, None)
        assert self.subscription.publish.call_count == 0

    def test_delete_wrong_target(self):
        self.subscription.handle_event('animal', 'delete', {'id': 1}, None)
        assert self.subscription.publish.call_count == 0

    def test_update_wrong_target(self):
        self.subscription.handle_event('animal', 'update', {'id': 1, 'name': 'foo'}, {'id': 1, 'name': 'bar'})
        assert self.subscription.publish.call_count == 0

    # test handle event for different target
    # returns nothing
