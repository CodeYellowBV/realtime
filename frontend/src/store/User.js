import { observable, computed } from 'mobx';
import { pick } from 'lodash';
import { Model, Store } from './Base';

export class User extends Model {
    urlRoot = '/api/user/';

    @observable id = null;
    @observable username = '';
    @observable firstName = '';
    @observable lastName = '';
    @observable password = '';
    @observable groupNames = [];

    @computed get fullName() {
        return `${this.firstName} ${this.lastName}`;
    }

    toBackend() {
        const output = super.toBackend();
        return pick(output, ['username', 'password', 'first_name', 'last_name', 'email', 'groups']);
    }
}

export class UserStore extends Store {
    Model = User;
    url = '/api/user/';
}
