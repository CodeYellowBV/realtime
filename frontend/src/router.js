import page from 'page';
// TODO: hmm, misc... Kees do u even naming.
import * as misc from 'controller/misc';
import { each } from 'lodash';

const routes = {
    '/': misc.home,
};

function routeWrapper(store) {
    each(routes, (controller, route) => {
        const wrapper = function (options) {
            const pController = controller instanceof Promise ? controller : Promise.resolve(controller);
            const params = Object.values(options.params);
            pController.then(resolvedContr => resolvedContr(store, ...params, options));
        };
        page(route, wrapper);
    });
}

export default function startRouter(store) {
    routeWrapper(store);
    page('*', () => misc.notFound(store));
    page({
        click: false,
    });
}
