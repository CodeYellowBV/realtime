import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer } from 'mobx-react';
import TimeEntry from '../container/TimeEntry';
import EntryOverview from '../container/EntryOverview';
import View from '../store/View';
import { Entry, EntryStore } from '../store/Entry';
import { ProjectStore } from '../store/Project';

@observer
export default class Personal extends Component {
    static propTypes = {
        viewStore: PropTypes.instanceOf(View).isRequired,
        currentEntry: PropTypes.instanceOf(Entry).isRequired,
        projectStore: PropTypes.instanceOf(ProjectStore).isRequired,
        entryStore: PropTypes.instanceOf(EntryStore).isRequired,
    };

    componentDidMount() {
        this.subscribe();
        this.props.viewStore.socket.on('open', this.subscribe);
    }

    componentWillUnmount() {
        this.unsubscribe();
    }

    subscribe = () => {
        this.props.projectStore.clear();
        this.props.projectStore.subscribe();
        this.props.entryStore.clear();
        this.props.entryStore.subscribe({
            user: this.props.viewStore.currentUser.id,
        });
    }

    unsubscribe = () => {
        this.props.projectStore.unsubscribe();
        this.props.entryStore.unsubscribe();
    }

    render() {
        return (
            <div>
                <TimeEntry
                    entry={this.props.currentEntry}
                    projectStore={this.props.projectStore}
                />
                <EntryOverview entries={this.props.entryStore} projectStore={this.props.projectStore} />
            </div>
        );
    }
}
