import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer } from 'mobx-react';
import Button from '../component/Button';
import View from '../store/View';

const { CY_FRONTEND_PHABRICATOR_URL, CY_FRONTEND_PHABRICATOR_CLIENT_ID } = process.env;

@observer
export default class Login extends Component {
    static propTypes = {
        viewStore: PropTypes.instanceOf(View),
    };

    handleClick() {
        const redirectUri = encodeURIComponent(window.location.href);
        window.location = `${CY_FRONTEND_PHABRICATOR_URL}/oauthserver/auth/?response_type=code&client_id=${CY_FRONTEND_PHABRICATOR_CLIENT_ID}&redirect_uri=${redirectUri}`;
    }

    render() {
        if (!this.props.viewStore.online) {
            return <div>There is no connection to the backend. Do you have an active internet connection?</div>;
        }
        return (<div>
            <p>
                To get started with CY Time, you need to login with your Phabricator account. After that you're done!
            </p>
            <Button onClick={this.handleClick}>Login with Phabricator</Button>
        </div>);
    }
}
