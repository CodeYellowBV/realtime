import { observable, computed, action, autorun } from 'mobx';
import { api } from './Base';
import { User } from './User';

export default class ViewStore {
    @observable currentUser = null;
    @observable.ref currentView = null;
    @observable csrfToken = null;
    @observable notifications = [];

    @computed get isAuthenticated() {
        return this.currentUser !== null;
    }

    constructor() {
        this.fetchBootstrap();

        // TODO: hack so the csrf token in the `api` module is updated every time.
        // Need to find a better way...
        autorun(() => {
            api.csrfToken = this.csrfToken;
        });
    }

    @action setView(view) {
        this.currentView = view;
    }

    @action fetchBootstrap() {
        // You can see here that we use `action()` twice. `action()` is kind of a transaction (events will be fired only when it's done)
        // Technically we wouldn't need the @action in this case (since you only change stuff in the Promise).
        return api.get('/api/bootstrap/')
        .then(action((res) => {
            if (res.user) {
                this.currentUser = new User(res.user);
            } else {
                this.currentUser = null;
            }
            this.csrfToken = res.csrf_token;
        }));
    }

    @action performLogin(username, password) {
        return api.post('/api/user/login/', {
            username,
            password,
        })
        .then(() => this.fetchBootstrap());
    }

    @action performLogout() {
        api.post('/api/user/logout/')
        .then(() => this.fetchBootstrap());
    }
}
