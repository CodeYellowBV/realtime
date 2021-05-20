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

    constructor(props) {
        // setInterval(() => props.store.socket.send({ type: 'auth' }), 1000);

        super(props);
    }

    render() {
        const { store } = this.props;
        let content = null;
        if (store.isAuthenticated) {
            content = <Router store={store} />;
        } else if (store.online) {
            content = <Login viewStore={store} />;
        }

        let activeFavicon = faviconStandby;
        if (store.runningEntryStore.length > 0) {
            activeFavicon = faviconRecord;
        }

        return (
            <BrowserRouter>
                <AppContainer>
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
