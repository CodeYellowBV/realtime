import { observable } from 'mobx';
import moment from 'moment';
import { Model, Store } from './Base';
import { Project } from './Project';

export class Entry extends Model {
    urlRoot = '/api/entry/';

    @observable id = null;
    @observable description = '';
    @observable startedAt = moment();
    @observable endedAt = moment();

    relations() {
        return {
            project: Project,
        };
    }

    toBackend() {
        let data = super.toBackend();
        data.started_at = this.startedAt.format();
        data.ended_at = this.endedAt.format();

        return data;
    }
}

export class EntryStore extends Store {
    Model = Entry;
    url = '/api/entry/';
}
