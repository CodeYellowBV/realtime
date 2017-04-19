import { observable, computed, action } from 'mobx';
import { groupBy, orderBy } from 'lodash';
import { Model, Store, Casts } from './Base';
import { Project } from './Project';

export class Entry extends Model {
    urlRoot = '/api/entry/';
    target = 'entry';

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

    @computed get startedAtDate() {
        return this.startedAt.format('YYYY-MM-DD');
    }
}

export class EntryStore extends Store {
    Model = Entry;
    url = '/api/entry/';
    target = 'entry';

    @computed get groupByDate() {
        return groupBy(orderBy(this.models, 'startedAt', 'desc'), entry => entry.startedAtDate);
    }
}
