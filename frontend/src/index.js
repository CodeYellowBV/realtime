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

// TODO: This is a horrible temporary hack, but we need to be able
// to access the router in <Link> compnents to push new links
// without page refresh...
window.myRouter = startRouter(viewStore);

ReactDOM.render(
    <App store={viewStore} />,
    document.getElementById('root')
);
