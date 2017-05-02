import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer } from 'mobx-react';
import UserOverview from '../container/UserOverview';
import View from '../store/View';
import { UserStore } from '../store/User';

@observer
export default class UserScreen extends Component {
    static propTypes = {
        viewStore: PropTypes.instanceOf(View).isRequired,
        userStore: PropTypes.instanceOf(UserStore).isRequired,
    };

    componentDidMount() {
        this.subscribe();
        this.props.viewStore.socket.on('open', this.subscribe);
    }

    componentWillUnmount() {
        this.unsubscribe();
    }

    subscribe = () => {
        this.props.userStore.clear();
        this.props.userStore.subscribe();
    };

    unsubscribe = () => {
        this.props.userStore.unsubscribe();
    };

    handleSubmit = () => {
        this.props.currentProject.clear();
    };

    render() {
        return (
            <div>
                <UserOverview users={this.props.userStore} />
            </div>
        );
    }
}
