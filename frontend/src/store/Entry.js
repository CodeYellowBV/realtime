import { observable } from 'mobx';
import { Model, Store } from './Base';
import { Project } from './Project';

export class Entry extends Model {
    urlRoot = '/api/entry/';

    @observable id = null;
    @observable description = '';
    @observable startedAt = null;
    @observable endedAt = null;

    relations() {
        return {
            project: Project,
        };
    }
}

export class EntryStore extends Store {
    Model = Entry;
    url = '/api/entry/';
}
