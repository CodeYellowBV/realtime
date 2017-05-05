from src.hub import Hub
from unittest import TestCase, mock


class HandleEvent(TestCase):
    def setUp(self):
        self.hub = Hub()

    def test_iterates_through_closed_sockets(self):
        sub = mock.MagicMock(name='SocketContainer.sub')
        wsOpen = mock.MagicMock(name='SocketContainer.wsOpen')
        wsOpen.closed.return_value = False

        wsClosed = mock.MagicMock(name='SocketContainer.wsClosed')
        wsClosed.closed.return_value = True

        containerOpen = self.hub.add(wsOpen)
        containerOpen.subs = [sub]

        self.hub.handle_event('person', 'save', {}, None)
        assert sub.handle_event.call_count == 1
