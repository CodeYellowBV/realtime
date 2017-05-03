import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer } from 'mobx-react';
import UserOverview from '../container/UserOverview';
import View from '../store/View';
import { UserStore } from '../store/User';
import { EntryStore } from '../store/Entry';
import { ProjectStore } from '../store/Project';

@observer
export default class UserScreen extends Component {
    static propTypes = {
        viewStore: PropTypes.instanceOf(View).isRequired,
        userStore: PropTypes.instanceOf(UserStore).isRequired,
        entryStore: PropTypes.instanceOf(EntryStore).isRequired,
        projectStore: PropTypes.instanceOf(ProjectStore).isRequired,
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
        this.props.entryStore.clear();
        this.props.entryStore.subscribe({
            ended_at: null,
        });
        this.props.projectStore.clear();
        this.props.projectStore.subscribe();
    };

    unsubscribe = () => {
        this.props.userStore.unsubscribe();
        this.props.entryStore.unsubscribe();
        this.props.projectStore.unsubscribe();
    };

    handleSubmit = () => {
        this.props.currentProject.clear();
    };

    render() {
        return (
            <div>
                <UserOverview
                    users={this.props.userStore}
                    entries={this.props.entryStore}
                    projects={this.props.projectStore}
                />
            </div>
        );
    }
}
