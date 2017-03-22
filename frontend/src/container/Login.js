import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';
import Button from '../component/Button';
import Uri from 'urijs';

const { CY_APP_PHABRICATOR_URL, CY_APP_PHABRICATOR_CLIENT_ID } = process.env;

@observer
export default class Login extends Component {
    static propTypes = {
        viewStore: PropTypes.object,
    };

    componentDidMount() {
        // I don't like this at all. Perhaps move it elsewhere?
        const url = new Uri(window.location.href);
        const urlParams = url.search(true);
        if (urlParams.code) {
            // TODO: redirect after successfull auth
            this.props.viewStore.performAuthentication(urlParams.code);
        }
    }

    handleClick() {
        const redirectUri = encodeURIComponent(window.location.href);
        window.location = `${CY_APP_PHABRICATOR_URL}/oauthserver/auth/?response_type=code&client_id=${CY_APP_PHABRICATOR_CLIENT_ID}&redirect_uri=${redirectUri}`;
    }

    render() {
        if (status === '')
        return (<div>
            <p>
                To get started with CY Time, you need to login with your Phabricator account. After that you're done!
            </p>
            <Button onClick={this.handleClick}>Login with Phabricator</Button>
        </div>);
    }
}
