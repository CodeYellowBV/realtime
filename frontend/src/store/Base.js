import { Model as BModel, Store as BStore, BinderApi } from 'mobx-spine';

const myApi = new BinderApi();

export class Model extends BModel {
    api = myApi;
}

export class Store extends BStore {
    api = myApi;
}

export const api = myApi;
