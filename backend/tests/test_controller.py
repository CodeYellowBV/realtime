from src.controller import Controller
import unittest


class HandleCase(unittest.TestCase):
    def test_pong(self):
        c = Controller(None, None, 'ping')
        res = c.handle()
        assert res == 'pong'
