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
    };

    componentWillMount() {
        this.userStore = new UserStore();
        this.entryStore = new EntryStore();
        this.projectStore = new ProjectStore();
    }

    componentDidMount() {
        this.subscribe();
        this.props.viewStore.socket.on('open', this.subscribe);
    }

    componentWillUnmount() {
        this.unsubscribe();
    }

    subscribe = () => {
        this.userStore.clear();
        this.userStore.subscribe();
        this.entryStore.clear();
        this.entryStore.subscribe({
            ended_at: null,
        });
        this.projectStore.clear();
        this.projectStore.subscribe();
    };

    unsubscribe = () => {
        this.userStore.unsubscribe();
        this.entryStore.unsubscribe();
        this.projectStore.unsubscribe();
    };

    render() {
        return (
            <div>
                <UserOverview
                    users={this.userStore}
                    entries={this.entryStore}
                    projects={this.projectStore}
                />
            </div>
        );
    }
}
