import { observable } from 'mobx';
import { Model, Store } from './Base';
import { COLOR_TINT } from '../styles';

export class Theme extends Model {
    target = 'theme';

    @observable id = null;
    @observable hex = COLOR_TINT;
}

export class ThemeStore extends Store {
    Model = Theme;
    target = 'theme';
}
