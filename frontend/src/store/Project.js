import { observable } from 'mobx';
import { Model, Store } from './Base';

export class Project extends Model {
    urlRoot = '/api/project/';

    @observable id = null;
    @observable title = '';
    @observable description = '';
}

export class ProjectStore extends Store {
    Model = Project;
    url = '/api/project/';
    target = 'project';
}
