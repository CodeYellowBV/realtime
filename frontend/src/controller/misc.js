import Personal from 'screen/Personal';
import NotFound from 'component/NotFound';
import { Entry } from 'store/Entry';
import { ProjectStore } from 'store/Project';
import moment from 'moment';

export function home(store) {
    const projectStore = new ProjectStore();
    projectStore.subscribe();
    store.setView({
        name: 'home',
        render: Personal,
        currentEntry: new Entry({ startedAt: moment() }, { relations: ['project'] }),
        projectStore,
    });
}

export function notFound(store) {
    store.setView({
        name: 'notFound',
        render: NotFound,
    });
}
