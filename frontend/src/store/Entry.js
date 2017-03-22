import { observable, action } from 'mobx';
import moment from 'moment';
import { Model, Store } from './Base';
import { Project } from './Project';

export class Entry extends Model {
    urlRoot = '/api/entry/';

    @observable id = null;
    @observable description = '';
    @observable startedAt = moment();
    @observable endedAt = moment();

    @action parse(data) {
        if (data.started_at !== undefined) {
            data.started_at = moment(data.started_at);
        }
        if (data.ended_at !== undefined) {
            data.ended_at = moment(data.ended_at);
        }

        super.parse(data);
    }

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
