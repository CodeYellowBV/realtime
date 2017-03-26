import { observable } from 'mobx';
import { Model, Store } from './Base';

export class User extends Model {
    @observable id = null;
    @observable username = '';
    @observable displayName = '';
    @observable email = '';
    @observable avatarUrl = '';

    login(data, token) {
        localStorage.setItem('jwt-auth-token', token);
        this.parse(data);
    }

    logout() {
        localStorage.removeItem('jwt-auth-token');
        this.clear();
    }

    getToken() {
        return localStorage.getItem('jwt-auth-token');
    }
}

export class UserStore extends Store {
    Model = User;
}
