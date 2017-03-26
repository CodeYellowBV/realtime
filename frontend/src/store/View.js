import { observable, computed, action } from 'mobx';
import { User } from './User';
import { EntryStore } from './Entry';
import Socket from '../Socket';
import Uri from 'urijs';

const TEST_ENTRY_DATA = [{
    id: 2,
    description: '',
    startedAt: '2017-03-23T19:28:40+00:00',
}, {
    id: 3,
    description: 'Finished some stuff',
    startedAt: '2017-03-23T19:28:40+00:00',
    endedAt: '2017-03-23T22:28:40+00:00',
}, {
    id: 4,
    description: '',
    startedAt: '2017-03-23T19:28:40+00:00',
    endedAt: '2017-03-23T22:28:40+00:00',
    project: {
        id: 1,
        title: 'REX',
    },
}];

export default class ViewStore {
    socket = null;
    router = null;
    @observable online = false;
    @observable currentUser = new User();
    @observable.ref currentView = null;
    @observable notifications = [];
    @observable entries = new EntryStore({ relations: ['project'] });

    @computed get isAuthenticated() {
        return !!this.currentUser.id;
    }

    constructor() {
        this.socket = new Socket({
            onOpen: this.handleSocketOpen,
            onClose: this.handleSocketClose,
            onMessage: this.handleSocketMessage,
        });
        this.entries.parse(TEST_ENTRY_DATA);
    }

    initialize() {
        const url = new Uri(window.location.href);
        const urlParams = url.search(true);
        if (urlParams.code) {
            this.performAuthentication(urlParams.code);
            this.router.setRoute('/');
        } else {
            this.tryLogin();
        }
    }

    @action setView(view) {
        this.currentView = view;
    }

    handleSocketOpen = () => {
        this.online = true;
        console.log('Connection established.');
    };

    handleSocketClose = () => {
        this.online = false;
        console.log('Connection closed.');
    };

    handleSocketMessage = ({ type, data, ...meta }) => {
        if (meta.code === 'unauthorized') {
            this.currentUser.logout();
            return;
        }
        if (type === 'authenticate') {
            if (data === null) {
                this.currentUser.logout();
            } else {
                this.currentUser.setToken(meta.authorization);
                this.tryLogin();
            }
        }
        if (type === 'bootstrap') {
            this.currentUser.parse(data);
        }
    };

    saveEntry(entry) {
        this.socket.send('saveEntry', entry.toBackend());
    }

    performAuthentication(code) {
        this.socket.send('authenticate', { code });
    }

    performLogout() {
        this.socket.authToken = null;
        this.currentUser.logout();
    }

    tryLogin() {
        const token = this.currentUser.getToken();
        if (token) {
            this.socket.authToken = token;
            this.socket.send('bootstrap');
        }
    }
}
