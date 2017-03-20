import io from 'socket.io-client';

export default class Socket {
    instance = null;
    // rooms = [];

    constructor() {
        const options = {
            transports: ['websocket'],
        };
        this.instance = io('/api', options);

        this.instance.on('connect', () => {
            console.log('Connected to socket');
            // this._joinRooms(this.rooms);
        });
        this.instance.on('connect_error', err => {
            console.log('Socket failed to connect', err);
        });
        this.instance.on('disconnected', () => {
            console.log('Socket disconnected');
        });
    }

    send(type, data) {
        this.instance.emit(type, data);
        console.log('Sent to socket', type, data);
    }

    // _joinRooms(rooms) {
    //     rooms.forEach(() => {
    //         this.instance.emit('room', rooms);
    //     });
    // }

    // addRoom(name) {
    //     this.rooms.push(name);
    //     this._joinRooms([name]);
    // }

    destroy() {
        if (this.instance) {
            this.instance.off();
            this.instance.destroy();
        }
    }
}
