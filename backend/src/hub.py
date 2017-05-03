from src.controller import Controller
import json
import uuid


class Subscription():
    socket = None
    reqId = None
    target = None
    scope = None

    def __init__(self, socket, reqId, target, scope=None):
        self.socket = socket
        self.reqId = reqId
        self.target = target
        self.scope = scope

    # Check if this subscription
    # matches the scope & target
    def is_in_scope(self, target, item):
        if self.target != target:
            return False
        if self.scope:
            for skey, sval in self.scope.items():
                if skey not in item.keys() or sval != item[skey]:
                    return False

        return True

    def handle_event(self, target, _type, item, snapshot):
        print('sub handle', _type, item, snapshot)
        is_subscribed = self.is_in_scope(target, item)

        if _type == 'save':
            if is_subscribed:
                self.publish(item, 'add')
            return
        # is_subscribed (instead of was_subscribed) may be a mindfuck as the model is now deleted,
        # but we dont send a snapshot when deleting, the res.data just is the original model
        if _type == 'delete':
            if is_subscribed:
                self.publish(item, 'remove')
            return

        # _type == 'update'
        was_subscribed = self.is_in_scope(target, snapshot)

        if is_subscribed and not was_subscribed:
            self.publish(item, 'add')
        if was_subscribed and not is_subscribed:
            self.publish(item, 'remove')

        return self.publish(item, 'update')

    def publish(self, item, publish_type):
        res = json.dumps({
            'type': 'publish',
            'target': self.target,
            'requestId': self.reqId,
            'data': {
                publish_type: [item],
            }
        })

        if self.socket.ws.closed:
            return

        self.socket.ws.send(res)


class SocketContainer():
    # This only exists because
    # I want to do some pubsub scoping logic
    # And it doesnt belong in the controller
    hub = None
    ws = None

    def __init__(self, hub, ws):
        self.uuid = uuid.uuid4()
        self.hub = hub
        self.subs = []
        self.ws = ws

    def subscribe(self, requestId, target, scope=None):
        s = Subscription(self, requestId, target, scope)
        self.subs.append(s)

    def handle_event(self, target, _type, item, snapshot):
        print('socket handle')
        if self.ws.closed:
            print('socket: ws closed')
            self.hub.remove(self)
            return

        for sub in self.subs:
            sub.handle_event(target, _type, item, snapshot)

    def handle(self, db, message):
        controller = Controller(db, self, message)
        res = controller.handle()

        if type(res) is dict and res['code'] == 'success':
            # Handle publish for successful saves, deletes and updates
            if res['type'] in ['save', 'update', 'delete']:
                if 'snapshot' in res:
                    self.hub.handle_event(res['target'], res['type'], res['data'], res['snapshot'])
                self.hub.handle_event(res['target'], res['type'], res['data'], None)

        self.ws.send(json.dumps(res))


class Hub():

    def __init__(self):
        self.sockets = []

    def handle_event(self, target, _type, item, snapshot):
        print('hub handle')
        # Find the sockets that are listening to that target with overlapping scope
        for socket in self.sockets:
            socket.handle_event(target, _type, item, snapshot)

    def add(self, ws):
        socket = SocketContainer(self, ws)
        self.sockets.append(socket)
        return socket

    def remove(self, socket):
        self.sockets.remove(socket)
