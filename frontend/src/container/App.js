import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer } from 'mobx-react';
import NotificationArea from '../component/NotificationArea';
import Login from './Login';
import Header from './AppHeader';
import AppContainer from '../component/AppContainer';
import ContentContainer from '../component/ContentContainer';
import NetworkInfo from '../component/NetworkInfo';
import View from '../store/View';
import Router from './Router';
import { BrowserRouter } from 'react-router-dom';
import Favicon from 'react-favicon';
import faviconStandby from '../image/favicon-standby.png';
import faviconRecord from '../image/favicon-record.png';

@observer
export default class App extends Component {
    static propTypes = {
        store: PropTypes.instanceOf(View).isRequired,
    };

    render() {
        const { store } = this.props;
        let content = null;
        if (store.isAuthenticated) {
            content = <Router store={store} />;
        } else {
            content = <Login viewStore={store} />;
        }

        // This is only meant to be here temporarily as a joke on Roger.
        const userIsRoger = store.currentUser.username === 'rogerkemp';

        let activeFavicon = faviconStandby;
        if (store.runningEntryStore.length > 0) {
            activeFavicon = faviconRecord;
        }

        return (
            <BrowserRouter>
                <AppContainer invertColors={userIsRoger}>
                    <Favicon url={[activeFavicon]} />
                    <Header store={store} />
                    <NotificationArea store={store} />
                    <ContentContainer>
                        {content}
                    </ContentContainer>
                    <NetworkInfo store={store} />
                </AppContainer>
            </BrowserRouter>
        );
    }
}
