from src.hub import Subscription
from unittest import TestCase, mock
import json


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

    def test_save_outside_scope(self):
        self.subscription.handle_event('animal', 'save', {'id': 1}, None)
        assert self.subscription.publish.call_count == 0

    def test_save_publish(self):
        item = {'id': 1}
        self.subscription.handle_event('person', 'save', item, None)
        assert self.subscription.publish.call_count == 1
        assert self.subscription.publish.call_args[0] == (item, 'add')

    def test_update_into_scope_publish(self):
        alive = {'alive': True}
        free = {'alive': False}
        self.subscription.scope = alive
        # A person goes from free => alive
        self.subscription.handle_event('person', 'update', alive, free)
        assert self.subscription.publish.call_count == 1
        assert self.subscription.publish.call_args[0] == (alive, 'add')

    def test_update_out_of_scope_publish(self):
        alive = {'alive': True}
        free = {'alive': False}
        self.subscription.scope = alive
        # A person goes from alive => free
        self.subscription.handle_event('person', 'update', free, alive)
        assert self.subscription.publish.call_count == 1
        assert self.subscription.publish.call_args[0] == (free, 'remove')

    def test_update_inside_scope_publish(self):
        alive = {'alive': True}
        alive_and_well = {'alive': True, 'well': True}
        self.subscription.scope = alive
        # A person goes from alive => alive_and_well
        self.subscription.handle_event('person', 'update', alive_and_well, alive)
        assert self.subscription.publish.call_count == 1
        assert self.subscription.publish.call_args[0] == (alive_and_well, 'update')

    def test_update_outside_scope(self):
        self.subscription.handle_event('animal', 'update', {'id': 1, 'name': 'foo'}, {'id': 1, 'name': 'bar'})
        assert self.subscription.publish.call_count == 0

    def test_delete_inside_scope(self):
        person = {'id': 1}
        self.subscription.handle_event('person', 'delete', person, None)
        assert self.subscription.publish.call_count == 1
        assert self.subscription.publish.call_args[0] == (person, 'remove')

    def test_delete_outside_scope(self):
        self.subscription.handle_event('animal', 'delete', {'id': 1}, None)
        assert self.subscription.publish.call_count == 0


class Publish(TestCase):
    def test_sends_json_over_ws(self):
        item = {'id': 1}
        reqId = 42
        target = 'person'
        pubType = 'add'

        socket = mock.MagicMock(name='Subscription.socket')
        socket.ws.closed = False
        subscription = Subscription(socket, reqId, target)

        res = json.dumps({
            'type': 'publish',
            'target': target,
            'requestId': reqId,
            'data': {
                pubType: [item]
            }
        })

        subscription.publish(item, pubType)

        assert socket.ws.send.call_count == 1
        assert socket.ws.send.call_args[0] == (res,)

    def test_does_not_with_closed_ws(self):
        item = {'id': 1}
        reqId = 42
        target = 'person'
        pubType = 'add'

        socket = mock.MagicMock(name='Subscription.socket')
        socket.ws.closed = True
        subscription = Subscription(socket, reqId, target)

        subscription.publish(item, pubType)

        assert socket.ws.send.call_count == 0






















