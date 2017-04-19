import Personal from 'screen/Personal';
import NotFound from 'component/NotFound';
import { Entry } from 'store/Entry';
import { ProjectStore } from 'store/Project';
import { EntryStore } from 'store/Entry';
import moment from 'moment';

export function home(store) {
    const projectStore = new ProjectStore();
    const entryStore = new EntryStore({ relations: ['project'] });
    store.setView({
        name: 'home',
        render: Personal,
        currentEntry: new Entry({ startedAt: moment() }, { relations: ['project'] }),
        projectStore,
        entryStore,
    });
}

export function notFound(store) {
    store.setView({
        name: 'notFound',
        render: NotFound,
    });
}
