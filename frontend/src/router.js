import { Router } from 'tarantino';
// TODO: hmm, misc... Kees do u even naming.
import * as misc from 'controller/misc';
import { mapValues } from 'lodash';

const routes = {
    '/': misc.home,
};

function routeWrapper(store) {
    return mapValues(routes, (controller) => {
        return function (...params) {
            const pController = controller instanceof Promise ? controller : Promise.resolve(controller);
            pController.then(resolvedContr => resolvedContr(store, ...params));
        };
    });
}

export default function startRouter(store) {
    const wrappedRoutes = routeWrapper(store);

    // Update state on url change.
    return new Router(wrappedRoutes).configure({
        notfound: () => misc.notFound(store),
    }).init();
}
