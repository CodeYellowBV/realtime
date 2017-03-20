export default class Socket {
    instance = null;
    handlers = {};

    constructor(handlers) {
        this.handlers = handlers;
        this.initialize();
    }

    initialize() {
        this.instance = new WebSocket(process.env.CY_APP_WEBSOCKET_URL);

        this.instance.onopen = () => {
            this.handlers.onOpen();
        };

        this.instance.onclose = () => {
            this.handlers.onClose();
            setTimeout(() => {
                this.initialize();
            }, 2000);
        };

        this.instance.onmessage = (evt) => {
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
