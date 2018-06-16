import {
    Model as BModel,
    Store as BStore,
    BinderApi,
    Casts as BCasts,
} from 'mobx-spine';
import uuid from 'uuid';

class TimeApi extends BinderApi {
    socket = null;

    subscribe({ target, instance, data }) {
        const requestId = uuid();
        this.socket.addMessageHandler(
            this.handleSocketMessage(instance, requestId)
        );
        this.socket.send({
            type: 'subscribe',
            requestId,
            target,
            data,
        });

        return requestId;
    }

    handleSocketMessage(instance, requestId) {
        return msg => {
            if (msg.requestId !== requestId || msg.type !== 'publish') {
                return false;
            }
            instance.parseChanges({
                add: msg.data.add,
                update: msg.data.update,
                remove: msg.data.remove,
            });
        };
    }

    unsubscribe(requestId) {
        this.socket.send({
            type: 'unsubscribe',
            requestId,
        });
    }

    saveModelWithoutWait({ target, data, isNew }) {
        this.socket.send({
            type: isNew ? 'save' : 'update',
            target,
            data,
        });
    }

    deleteModel({ target, id }) {
        this.socket.send({
            type: 'delete',
            target,
            data: { id },
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
            isNew: this.isNew,
            target: this.target,
            data: this.toBackend(),
        });
    }

    delete() {
        if (this.__store) {
            this.__store.remove(this);
        }
        if (this.id) {
            this.api.deleteModel({
                target: this.target,
                id: this.id,
            });
        }
    }
}

export class Store extends BStore {
    api = myApi;
    target = '';
    subscriptionId = null;

    subscribe(scope) {
        this.unsubscribe();
        if (!this.target) {
            throw new Error(
                'Store needs `target` property set before subscribing.'
            );
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
        if (changes.add) {
            this.add(changes.add);//this appears to be the place where the values of store/User.js are set
        }
        if (changes.update) {
            changes.update.forEach(change => {
                const model = this.get(change.id);
                if (model) {
                    model.parse(change);
                }
            });
        }
        if (changes.remove) {
            const removes = changes.remove.map(change => {
                return this.get(change.id);
            });
            this.remove(removes);
        }
        if(this.target === 'user'){
            for(let index = 0; index < this.models.length; index++){
                const user = this.models[index];
                if(user.stillWorking === null){
                    user.stillWorking = true;//default value of stillWorking is supposed to be true and null is default value, so...
                }
            }
        }
    }
}

export const api = myApi;

export const Casts = BCasts;
