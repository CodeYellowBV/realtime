import { observable } from 'mobx';
import { Model, Store } from './Base';

export class Project extends Model {
    target = 'project';

    @observable id = null;
    @observable name = '';
    @observable description = '';
}

export class ProjectStore extends Store {
    Model = Project;
    target = 'project';
}
