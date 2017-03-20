export default class Socket {
    instance = null;
    handlers = {};
    pingInterval = null;

    constructor(handlers) {
        this.handlers = handlers;
        this.initialize();
    }

    initialize() {
        this.instance = new WebSocket(process.env.CY_APP_WEBSOCKET_URL);

        this.instance.onopen = () => {
            this.handlers.onOpen();
            this.pingInterval = setInterval(() => {
                this.instance.send('ping');
            }, 30000);
        };

        this.instance.onclose = () => {
            this.handlers.onClose();
            if (this.pingInterval) {
                clearInterval(this.pingInterval);
                this.pingInterval = null;
            }
            setTimeout(() => {
                this.initialize();
            }, 2000);
        };

        this.instance.onmessage = (evt) => {
            if (evt.data === 'pong') {
                return;
            }
            const msg = JSON.parse(evt.data);
            console.log('[received]', msg.type, msg.data);
            this.handlers.onMessage(msg.type, msg.data);
        };
    }

    send(type, data) {
        console.log('[sent]', type, data);
        this.instance.send(JSON.stringify({
            type,
            data,
        }));
    }
}
