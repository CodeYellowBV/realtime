import { Model as BModel, Store as BStore, BinderApi, Casts as BCasts } from 'mobx-spine';
import uuid from 'uuid';

class TimeApi extends BinderApi {
    socket = null;

    subscribe({ target, instance, data }) {
        const requestId = uuid();
        this.socket.addMessageHandler(this.handleSocketMessage(instance, requestId));
        this.socket.send({
            type: 'subscribe',
            requestId,
            target,
            data,
        });

        return requestId;
    }

    handleSocketMessage(instance, requestId) {
        return (msg) => {
            if (msg.requestId !== requestId) {
                return false;
            }
            instance.parseChanges({
                add: msg.data.add,
                update: msg.data.update,
                delete: msg.data.delete,
            });
        };
    }

    unsubscribe(requestId) {
        this.socket.send({
            type: 'unsubscribe',
            requestId,
        });
    }

    saveModelWithoutWait({ target, data }) {
        this.socket.send({
            type: 'save',
            target,
            data,
        });
    }

    deleteModel({ target }) {
        this.socket.send({
            type: 'delete',
            target,
        });
    }

}

const myApi = new TimeApi();

export class Model extends BModel {
    api = myApi;
    target = '';

    // TODO: this is a poorly implemented save function that does not wait on the results of the backend
    save() {
        this.api.saveModelWithoutWait({
            target: this.target,
            data: this.toBackend(),
        });
    }

    delete() {
        this.api.deleteModel({
            target: this.target,
        });
    }
}

export class Store extends BStore {
    api = myApi;
    target = '';
    subscriptionId = null;

    subscribe(scope) {
        this.unsubscribe();
        if (!this.target) {
            throw new Error('Store needs `target` property set before subscribing.');
        }
        this.subscriptionId = this.api.subscribe({
            target: this.target,
            instance: this,
            data: scope,
        });
    }

    unsubscribe() {
        if (this.subscriptionId) {
            this.api.unsubscribe(this.subscriptionId);
        }
    }

    parseChanges(changes) {
        this.add(changes.add);
        changes.update.forEach((change) => {
            const model = this.get(change.id);
            if (model) {
                model.parse(change);
            }
        });
        const deletions = changes.delete.map((change) => {
            return this.get(change.id);
        });
        this.remove(deletions);
    }
}

export const api = myApi;

export const Casts = BCasts;
