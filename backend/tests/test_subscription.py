from src.hub import Subscription
import unittest


class SubscriptionCase(unittest.TestCase):
    def setUp(self):
        self.subscription = Subscription(None, 42, 'foo')

    def tearDown(self):
        # TODO, maybe fix socketContainer
        pass

    def test_scope_different_target(self):
        result = self.subscription.is_in_scope('bar', {})
        assert result is False
