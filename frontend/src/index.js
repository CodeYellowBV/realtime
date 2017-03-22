import React from 'react';
import ReactDOM from 'react-dom';
import remotedev from 'mobx-remotedev';
import 'normalize.css';
import App from './container/App';
import ViewStore from './store/View';
import startRouter from './router';

const viewStore = new ViewStore();

// This enables easy MobX debugging with a Chrome Extension.
// The code will be excluded on production automatically.
// For info on how to use: https://github.com/zalmoxisus/mobx-remotedev
remotedev(viewStore);

const router = startRouter(viewStore);

ReactDOM.render(<App store={viewStore} router={router} />, document.getElementById('root'));
