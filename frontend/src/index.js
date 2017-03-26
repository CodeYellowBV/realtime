import React from 'react';
import ReactDOM from 'react-dom';
import 'normalize.css';
import App from './container/App';
import ViewStore from './store/View';
import startRouter from './router';

const viewStore = new ViewStore();

const router = startRouter(viewStore);
viewStore.router = router;
viewStore.initialize();

ReactDOM.render(<App store={viewStore} router={router} />, document.getElementById('root'));
