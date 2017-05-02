import { observable, computed, action } from 'mobx';
import { groupBy, orderBy } from 'lodash';
import { Model, Store, Casts } from './Base';

export class Entry extends Model {
    target = 'entry';

    @observable id = null;
    @observable description = '';
    @observable project = null;
    @observable startedAt = null;
    @observable endedAt = null;

    casts() {
        return {
            startedAt: Casts.datetime,
            endedAt: Casts.datetime,
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
        return this.startedAt ? this.startedAt.format('YYYY-MM-DD') : null;
    }
}

export class EntryStore extends Store {
    Model = Entry;
    target = 'entry';

    @computed get groupByDate() {
        return groupBy(
            orderBy(this.models, 'startedAt', 'desc'),
            entry => entry.startedAtDate
        );
    }
}
