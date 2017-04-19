import React from 'react';
import ReactDOM from 'react-dom';
import 'normalize.css';
import App from './container/App';
import ViewStore from './store/View';
import startRouter from './router';

const viewStore = new ViewStore();

startRouter(viewStore);
viewStore.initialize();

ReactDOM.render(<App store={viewStore} />, document.getElementById('root'));
