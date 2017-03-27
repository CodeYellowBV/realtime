import { Model as BModel, Store as BStore, BinderApi, Casts as BCasts } from 'mobx-spine';
import uuid from 'uuid/v4';

class TimeApi extends BinderApi {
    socket = null;

    subscribe({ target, data }) {
        const requestId = uuid();
        this.socket.send({
            type: 'subscribe',
            requestId,
            target,
            data,
        });

        return requestId;
    }

    unsubscribe(requestId) {
        this.socket.send({
            type: 'unsubscribe',
            requestId,
        });
    }
}

const myApi = new TimeApi();

export class Model extends BModel {
    api = myApi;
}

export class Store extends BStore {
    api = myApi;
    target = '';
    subscriptionId = null;

    subscribe(scope) {
        this.unsubscribe();
        this.subscriptionId = this.api.subscribe({
            target: this.target,
            data: scope,
        });
    }

    unsubscribe() {
        if (this.subscriptionId) {
            this.api.unsubscribe(this.subscriptionId);
        }
    }
}

export const api = myApi;

export const Casts = BCasts;
