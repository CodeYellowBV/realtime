import PersonalScreen from './screen/Personal';
import ProjectScreen from './screen/Project';
import UserScreen from './screen/User';
import NotFound from './component/NotFound';
import { Project, ProjectStore } from './store/Project';
import { UserStore } from './store/User';
import { Entry, EntryStore } from './store/Entry';
import moment from 'moment';

export function home(store) {
    const projectStore = new ProjectStore();
    const entryStore = new EntryStore();
    store.setView({
        name: 'home',
        render: PersonalScreen,
        currentEntry: new Entry({ startedAt: moment() }),
        projectStore,
        entryStore,
    });
}

export function projects(store) {
    const projectStore = new ProjectStore();
    store.setView({
        name: 'home',
        render: ProjectScreen,
        currentProject: new Project(),
        projectStore,
    });
}

export function users(store) {
    const userStore = new UserStore();
    store.setView({
        name: 'home',
        render: UserScreen,
        userStore,
    });
}

export function notFound(store) {
    store.setView({
        name: 'notFound',
        render: NotFound,
    });
}
