import { observable, computed, action } from 'mobx';
import { User } from './User';
import { EntryStore } from './Entry';
import Socket from '../Socket';

export default class ViewStore {
    socket = null;
    @observable online = false;
    @observable currentUser = new User();
    @observable.ref currentView = null;
    @observable notifications = [];
    @observable entries = new EntryStore();

    @computed get isAuthenticated() {
        return !!this.currentUser.id;
    }

    constructor() {
        this.socket = new Socket({
            onOpen: this.handleSocketOpen,
            onClose: this.handleSocketClose,
            onMessage: this.handleSocketMessage,
        });
    }

    handleSocketOpen = () => {
        this.online = true;
        console.log('Connection established.');
    };

    handleSocketClose = () => {
        this.online = false;
        console.log('Connection closed.');
    };

    handleSocketMessage = (type, data) => {
        if (type === 'authenticate') {
            if (data === null) {
                this.currentUser.clear();
            } else {
                this.currentUser.parse(data);
            }
        }
    };

    saveEntry(entry) {
        this.socket.send('saveEntry', entry.toBackend());
    }

    performAuthentication(code) {
        this.socket.send('authenticate', { code });
    }

    @action setView(view) {
        this.currentView = view;
    }
}
