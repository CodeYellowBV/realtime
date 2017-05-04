from src.hub import SocketContainer
from src.controller import Controller
from unittest import TestCase, mock

res = {
    'code': 'success',
    'type': 'update',
    'target': 'person',
    'snapshot': {},
    'data': {},
}


# TODO find out how to create testsuite and testcases
# AKA find a way to nest / decorate tests that need the db
class Handle(TestCase):
    def setUp(self):
        hub = mock.MagicMock(name='SocketContainer.hub')
        ws = mock.MagicMock(name='SocketContainer.ws')
        self.socketContainer = SocketContainer(hub, ws)

    @mock.patch.object(Controller, 'handle', mock.MagicMock(return_value=res))
    # @mock.patch('Controller.handle', mock.MagicMock(return_value=res))
    def test_handle_with_snapshot_fires_once(self):
        # Patch controller
        # to always return a res without snapshot
        # todo first create model which needs an update
        self.socketContainer.handle(None, '')
        assert self.socketContainer.hub.handle_event.call_count == 1
