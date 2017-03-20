import { observable, computed, action } from 'mobx';
import { User } from './User';
import { EntryStore } from './Entry';
import Socket from '../Socket';

export default class ViewStore {
    @observable currentUser = null;
    @observable.ref currentView = null;
    @observable notifications = [];
    @observable entries = new EntryStore();
    @observable socket = new Socket();

    @computed get isAuthenticated() {
        return this.currentUser !== null;
    }

    constructor() {
        this.fetchBootstrap();
    }

    saveEntry(entry) {
        this.socket.send('saveEntry', entry.toBackend());
    }

    register(code) {
        console.log('Code from Phabricator:', code);
    }

    @action setView(view) {
        this.currentView = view;
    }

    @action fetchBootstrap() {
        //
    }

    @action performLogin(username, password) {
        //
    }

    @action performLogout() {
        //
    }
}
