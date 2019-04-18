import { observable, computed } from 'mobx';
import Uri from 'urijs';
import { User } from './User';
import { EntryStore } from './Entry';
import Socket from '../Socket';
import { api } from './Base';

export const FrontendEnv = {
    env: {},
};

export default class ViewStore {
    socket = null;
    @observable online = false;
    @observable bootstrapDone = false;
    @observable currentUser = new User();
    @observable notifications = [];
    @observable runningEntryStore = new EntryStore();

    @computed
    get isAuthenticated() {
        return !!this.currentUser.id;
    }

    constructor() {
        this.socket = new Socket();
        this.socket.on('open', this.handleSocketOpen);
        this.socket.on('close', this.handleSocketClose);
        this.socket.on('message', this.handleSocketMessage);
        api.socket = this.socket;
    }

    initialize() {
        const url = new Uri(window.location.href);
        const urlParams = url.search(true);
        if (urlParams.code) {
            this.performAuthentication(urlParams.code);
            window.history.replaceState({}, null, '/');
        } else {
            this.tryLogin();
        }
    }

    handleSocketOpen = () => {
        this.online = true;
        console.log('Connection established.');
    };

    handleSocketClose = () => {
        this.online = false;
        console.log('Connection closed.');
    };

    handleSocketMessage = ({ type, data, env, ...meta }) => {
        if (type == 'env') {
            FrontendEnv.env = env;
            if (FrontendEnv.callback) {
                FrontendEnv.callback();
            }
            return;
        }
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
            this.afterBootstrap();
        }
    };

    performAuthentication(code) {
        this.socket.send({ type: 'authenticate', data: { code } });
    }

    performLogout() {
        this.socket.authToken = null;
        this.currentUser.logout();
    }

    tryLogin() {
        const token = this.currentUser.getToken();
        if (token) {
            this.socket.authToken = token;
            this.socket.send({ type: 'bootstrap' });
        }
    }

    afterBootstrap() {
        this.bootstrapDone = true;
        this.runningEntryStore.unsubscribe();
        if (this.isAuthenticated) {
            this.runningEntryStore.subscribe({
                user: this.currentUser.id,
                ended_at: null,
            });
        }
    }

    addNotification(msg) {
        // Notifications with the same key have the same contents, so we don't want to display them twice.
        // Existing ones are removed so the notification stays longer on the screen.
        const existingMsg = this.notifications.find(a => a.key === msg.key);
        if (existingMsg) {
            this.notifications.remove(existingMsg);
        }
        this.notifications.push(msg);
    }
}
