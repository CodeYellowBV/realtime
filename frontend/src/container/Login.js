import React, { Component, PropTypes } from 'react';
import { observable } from 'mobx';
import { observer } from 'mobx-react';

@observer
export default class Login extends Component {
    static propTypes = {
        viewStore: PropTypes.object,
    };

    @observable errorMsg = '';

    handleSubmit = (username, password) => {
        this.errorMsg = '';
        this.props.viewStore.performLogin(username, password).catch(err => {
            const status = err.response && err.response.status;
            if (status === 403) {
                this.errorMsg = 'Wrong credentials.';
            } else {
                console.error(err);
                this.errorMsg = 'Unknown error occured.';
            }
        });
    };

    render() {
        return <div>TODO; make a Phabricator login.</div>;
    }
}
