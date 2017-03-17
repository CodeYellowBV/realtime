import io from 'socket.io-client';

export default class Socket {
    instance = null;

    constructor() {
        const options = {
            transports: ['websocket'],
        };
        this.instance = io('/api', options);

        this.instance.on('connect', () => {
            console.log('Connected to socket');
        });
        this.instance.on('connect_error', (err) => {
            console.log('Socket failed to connect', err);
        });
        this.instance.on('disconnected', () => {
            console.log('Socket disconnected');
        });
    }

    destroy() {
        if (this.instance) {
            this.instance.off();
            this.instance.destroy();
        }
    }
}
