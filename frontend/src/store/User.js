import { observable } from 'mobx';
import { Model, Store } from './Base';

export class User extends Model {
    @observable id = null;
    @observable username = '';
    @observable displayName = '';
    @observable email = '';
    @observable avatarUrl = '';
}

export class UserStore extends Store {
    Model = User;
}
