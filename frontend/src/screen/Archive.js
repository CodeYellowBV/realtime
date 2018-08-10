import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer } from 'mobx-react';
import TimeEntry from '../container/TimeEntry';
import EntryOverview from '../container/EntryOverview';
import View from '../store/View';
import { Entry, EntryStore } from '../store/Entry';
import { ProjectStore } from '../store/Project';

@observer
export default class Archive extends Component {
    static propTypes = {
        viewStore: PropTypes.instanceOf(View).isRequired,
    };

    componentWillMount() {
        this.projectStore = new ProjectStore();
        this.entryStore = new EntryStore();
        this.currentEntry = new Entry();
    }

    componentDidMount() {
        this.subscribe();
        this.props.viewStore.socket.on('open', this.subscribe);
    }

    componentWillUnmount() {
        this.unsubscribe();
    }

    subscribe = () => {
        this.projectStore.clear();
        this.projectStore.subscribe();
        this.entryStore.clear();
        this.entryStore.subscribe({
            user: this.props.viewStore.currentUser.id,
        });
    };

    unsubscribe = () => {
        this.projectStore.unsubscribe();
        this.entryStore.unsubscribe();
    };

    render() {
        return (
            <div>
                <EntryOverview
                    entries={this.entryStore}
                    projectStore={this.projectStore}
                    viewStore={this.props.viewStore}
                    allowEdit
                    showOld
                />
            </div>
        );
    }
}
