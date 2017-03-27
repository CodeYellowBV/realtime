export default class Socket {
    instance = null;
    handlers = {};
    messageHandlers = [];
    pingInterval = null;
    authToken = null;

    constructor(handlers) {
        this.handlers = handlers;
        this.initialize();
    }

    initialize() {
        this.instance = new WebSocket(process.env.CY_FRONTEND_WEBSOCKET_URL);

        this.instance.onopen = () => {
            this.handlers.onOpen();
            this._initiatePingInterval();
        };

        this.instance.onclose = () => {
            this.handlers.onClose();
            this._stopPingInterval();
            setTimeout(() => {
                this.initialize();
            }, 2000);
        };

        this.instance.onmessage = (evt) => {
            if (evt.data === 'pong') {
                return;
            }
            const msg = JSON.parse(evt.data);
            console.log('[received]', msg);

            const isHandled = this.messageHandlers.some((handler) => {
                return handler(msg);
            });
            if (!isHandled) {
                this.handlers.onMessage(msg);
            }
        };
    }

    addMessageHandler(callback) {
        this.messageHandlers.push(callback);
    }

    send(options) {
        const msg = {
            type: options.type,
            data: options.data,
            target: options.target,
            requestId: options.requestId,
            authorization: this.authToken,
        };
        console.log('[sent]', msg);
        // Wait for a while if the socket is not yet done connecting...
        if (this.instance.readyState !== 1) {
            setTimeout(() => {
                this._sendDirectly(msg);
            }, 200);
            return;
        }
        this._sendDirectly(msg);
    }

    _sendDirectly(msg) {
        this.instance.send(JSON.stringify(msg));
    }

    _initiatePingInterval() {
        this.pingInterval = setInterval(() => {
            this.instance.send('ping');
        }, 30000);
    }

    _stopPingInterval() {
        if (this.pingInterval) {
            clearInterval(this.pingInterval);
            this.pingInterval = null;
        }
    }
}
