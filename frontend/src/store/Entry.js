import { observable, computed, action } from 'mobx';
import moment from 'moment';
import { Model, Store, Casts } from './Base';
import { Project } from './Project';

export class Entry extends Model {
    urlRoot = '/api/entry/';

    @observable id = null;
    @observable description = '';
    @observable startedAt = null;
    @observable endedAt = null;

    casts() {
        return {
            startedAt: Casts.datetime,
            endedAt: Casts.datetime,
        };
    }

    relations() {
        return {
            project: Project,
        };
    }

    @action partialClear() {
        const startedAt = this.startedAt;
        this.clear();
        this.startedAt = startedAt;
    }

    @computed get differenceInMinutes() {
        if (this.startedAt && this.endedAt) {
            return this.endedAt.diff(this.startedAt, 'minutes');
        }
        return null;
    }
}

export class EntryStore extends Store {
    Model = Entry;
    url = '/api/entry/';
}
