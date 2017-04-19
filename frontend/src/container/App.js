import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer } from 'mobx-react';
import NotificationArea from '../component/NotificationArea';
import Login from './Login';
import Header from './AppHeader';
import AppContainer from '../component/AppContainer';

function renderCurrentView(store) {
    const view = store.currentView;
    // The view can temporarily be `null` when using code splitting.
    if (!view) {
        return null;
    }
    if (!view.render) {
        throw new Error(`View "${view.name}" does not have a render property!`);
    }
    return <view.render {...view} viewStore={store} />;
}

@observer
export default class App extends Component {
    static propTypes = {
        store: PropTypes.object.isRequired,
    };

    render() {
        const { store } = this.props;
        let content = null;
        if (store.isAuthenticated || (store.currentView && store.currentView.bypassAuth)) {
            content = renderCurrentView(store);
        } else {
            content = <Login viewStore={store} />;
        }
        return (
            <AppContainer>
                <Header store={store} />
                <NotificationArea store={store} />
                {content}
            </AppContainer>
        );
    }
}
