import { observable, computed } from 'mobx';
import { Model, Store } from './Base';
import { trimStart } from 'lodash';

// Defines if a user is "external". The RealTime UI will hide certain menu
// items. Example:
//
// ext.Project X
//
// This way menu items are hidden, and only projects with name which matches
// the prefix "Project X" will be shown.
const EXTERNAL_PMC_PREFIX = 'ext.';

export class User extends Model {
    target = 'user';
    @observable id = null;
    @observable username = '';
    @observable displayName = '';
    @observable email = '';
    @observable avatarUrl = '';
    @observable pmc = '';
    @observable stillWorking = '';

    @computed
    get isExternal() {
        // Super secure.
        return this.pmc.startsWith(EXTERNAL_PMC_PREFIX);
    }

    isAllowedProject(project) {
        if (this.isExternal) {
            const allowedPrefix = trimStart(this.pmc, EXTERNAL_PMC_PREFIX);

            return project.name.startsWith(allowedPrefix);
        }

        return true;
    }

    setToken(token) {
        localStorage.setItem('jwt-auth-token', token);
    }

    getToken() {
        return localStorage.getItem('jwt-auth-token');
    }

    logout() {
        localStorage.removeItem('jwt-auth-token');
        this.clear();
    }
}

export class UserStore extends Store {
    Model = User;
    target = 'user';
}
