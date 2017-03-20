import { observable, computed, action } from 'mobx';
import { User } from './User';
import { EntryStore } from './Entry';
import Socket from '../Socket';

export default class ViewStore {
    socket = null;
    @observable online = false;
    @observable currentUser = null;
    @observable.ref currentView = null;
    @observable notifications = [];
    @observable entries = new EntryStore();

    @computed get isAuthenticated() {
        return this.currentUser !== null;
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
        //
    };

    saveEntry(entry) {
        this.socket.send('saveEntry', entry.toBackend());
    }

    register(code) {
        console.log('Code from Phabricator:', code);
    }

    @action setView(view) {
        this.currentView = view;
    }
}
