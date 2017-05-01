from src.controller import Controller
import json
import uuid


class SocketContainer():
    # This only exists because
    # I want to do some pubsub scoping logic
    # And it doesnt belong in the controller
    hub = None
    ws = None

    def __init__(self, hub, ws):
        self.uuid = uuid.uuid4()
        self.hub = hub
        self.subs = {}
        self.ws = ws

    def isSubscribed(self, target, item):
        for reqId, sub in self.subs.items():
            if sub['target'] != target:
                continue
            if sub['scope']:
                # TODO scope matching
                from pudb import set_trace; set_trace()
            return reqId

        return False

    def subscribe(self, requestId, target, data):
        self.subs[requestId] = {
            'target': target,
            'scope': data,
        }

    def handle(self, db, message):
        controller = Controller(db, self, message)
        res = controller.handle()

        if type(res) is dict and res['code'] == 'success':
            # Handle publish for successful saves, deletes and updates
            if res['type'] in ['save', 'update', 'delete']:
                self.hub.notify(res['target'], res['type'], res['data'])

        self.ws.send(json.dumps(res))


class Hub():

    def __init__(self):
        self.sockets = []

    def notify(self, target, _type, item):
        sockets = {}
        # Find the sockets that are listening to that target with overlapping scope
        for idx, s in enumerate(self.sockets):
            isSubscribed = s.isSubscribed(target, item)

            if isSubscribed:
                sockets[isSubscribed] = s

        readableType = 'add' if _type == 'save' else _type

        for reqId, sub in sockets.items():
            res = json.dumps({
                'type': 'publish',
                'target': target,
                'requestId': reqId,
                'data': {
                    readableType: [item],
                }
            })
            sub.ws.send(res)

    def add(self, ws):
        socket = SocketContainer(self, ws)
        self.sockets.append(socket)
        return socket
