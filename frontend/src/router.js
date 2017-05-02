import page from 'page';
import * as controller from './controller';
import { each } from 'lodash';

const routes = {
    '/': controller.home,
    '/projects': controller.projects,
    '/users': controller.users,
};

function routeWrapper(store) {
    each(routes, (controller, route) => {
        const wrapper = function(options) {
            const pController = controller instanceof Promise
                ? controller
                : Promise.resolve(controller);
            const params = Object.values(options.params);
            pController.then(resolvedContr =>
                resolvedContr(store, ...params, options)
            );
        };
        page(route, wrapper);
    });
}

export default function startRouter(store) {
    routeWrapper(store);
    page('*', () => controller.notFound(store));
    page({
        click: false,
    });
}
