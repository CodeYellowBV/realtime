import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer } from 'mobx-react';
import Button from '../component/Button';
import View, { FrontendEnv } from '../store/View';

@observer
export default class Login extends Component {
    static propTypes = {
        viewStore: PropTypes.instanceOf(View),
    };

    handleClick = () => {
        if (FrontendEnv.env.CY_FRONTEND_PHABRICATOR_URL) {
            const redirectUri = encodeURIComponent(
                `${window.location.origin}/`
            );
            const env = FrontendEnv;
            debugger;
            window.location = `${FrontendEnv.env
                .CY_FRONTEND_PHABRICATOR_URL}/oauthserver/auth/?response_type=code&client_id=${FrontendEnv
                .env
                .CY_FRONTEND_PHABRICATOR_CLIENT_ID}&redirect_uri=${redirectUri}`;
        } else {
            FrontendEnv.callback = this.handleClick;
            this.props.viewStore.socket._sendDirectly({ type: 'env' });
        }
    };

    render() {
        if (!this.props.viewStore.online) {
            return (
                <div>
                    There is no connection to the backend. Do you have an active
                    internet connection?
                </div>
            );
        }
        return (
            <div>
                <p>
                    To get started with CY Time, you need to login with your
                    Phabricator account. After that you're done!
                </p>
                <Button onClick={this.handleClick}>
                    Login with Phabricator
                </Button>
            </div>
        );
    }
}
