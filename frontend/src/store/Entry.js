import { observable } from 'mobx';
import moment from 'moment';
import { mapKeys, camelCase } from 'lodash';
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
        // This is an ugly hack and should be fixed in mobx-spine.
        data = mapKeys(data, (value, key) => camelCase(key));

        // TODO: hmm mobx-spine could fix this?
        data.startedAt = data.startedAt.format();
        data.endedAt = data.endedAt.format();

        return data;
    }
}

export class EntryStore extends Store {
    Model = Entry;
    url = '/api/entry/';
}
