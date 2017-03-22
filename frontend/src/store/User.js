import { observable, computed } from 'mobx';
import { Model, Store } from './Base';

export class User extends Model {
    @observable id = null;
    @observable username = '';
    @observable firstName = '';
    @observable lastName = '';

    @computed get fullName() {
        return `${this.firstName} ${this.lastName}`;
    }
}

export class UserStore extends Store {
    Model = User;
}
