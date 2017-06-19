import { observable, computed } from 'mobx';
import { groupBy, orderBy } from 'lodash';
import moment from 'moment';
import { Model, Store, Casts } from './Base';

export class Entry extends Model {
    target = 'entry';

    @observable id = null;
    @observable description = '';
    @observable project = null;
    @observable user = null;
    @observable startedAt = null;
    @observable endedAt = null;
    @observable _editing = false;

    casts() {
        return {
            startedAt: Casts.datetime,
            endedAt: Casts.datetime,
        };
    }

    @computed
    get differenceInMinutes() {
        if (this.startedAt && this.endedAt) {
            return this.endedAt.diff(this.startedAt, 'minutes');
        }
        if (this.startedAt) {
            return moment().diff(this.startedAt, 'minutes');
        }
        return null;
    }

    @computed
    get startedAtDate() {
        return this.startedAt ? this.startedAt.format('YYYY-MM-DD') : null;
    }
}

export class EntryStore extends Store {
    Model = Entry;
    target = 'entry';

    @computed
    get groupByDate() {
        return groupBy(
            orderBy(this.models, 'startedAt', 'desc'),
            entry => entry.startedAtDate
        );
    }

    // This is a static function because after grouping on a day you don't have a store anymore
    static calculateTotalMinutes(entries) {
        return entries.reduce((accumulator, entry) => {
            return accumulator + entry.differenceInMinutes;
        }, 0);
    }
}
