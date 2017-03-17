import Home from 'component/Home';
import NotFound from 'component/NotFound';

export function home(store) {
    store.setView({
        name: 'home',
        render: Home,
    });
}

export function notFound(store) {
    store.setView({
        name: 'notFound',
        render: NotFound,
    });
}
