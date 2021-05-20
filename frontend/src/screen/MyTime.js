import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer } from 'mobx-react';
import TimeEntry from '../container/TimeEntry';
import EntryOverview from '../container/EntryOverview';
import View from '../store/View';
import { Entry, EntryStore } from '../store/Entry';
import { ProjectStore } from '../store/Project';

@observer
export default class MyTime extends Component {
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

    onCopyEntry = oldEntry => {
        let runningEntry = this.entryStore.find(
            entry => entry._editing || !entry.endedAt
        );

        if (!runningEntry) {
            const newEntry = new Entry({
                startedAt: new Date(),
                user: this.props.viewStore.user,
            });
            newEntry.project = oldEntry.project;
            newEntry.description = oldEntry.description;
            newEntry.ticket = oldEntry.ticket;
            newEntry.wbso = oldEntry.wbso;
            newEntry.save();
            // this.entryStore.add(newEntry);

            // Save triggers a reaoad
            return;

            runningEntry = this.entryStore.find(
                entry => entry._editing || !entry.endedAt
            );
        }

        runningEntry.project = oldEntry.project;
        runningEntry.description = oldEntry.description;
        runningEntry.ticket = oldEntry.ticket;
        runningEntry.wbso = oldEntry.wbso;
    };

    render() {
        const runningEntry = this.entryStore.find(
            entry => entry._editing || !entry.endedAt
        );
        return (
            <div>
                <TimeEntry
                    entry={runningEntry || this.currentEntry}
                    clearEntry={!runningEntry}
                    projectStore={this.projectStore}
                    viewStore={this.props.viewStore}
                />
                <EntryOverview
                    entries={this.entryStore}
                    projectStore={this.projectStore}
                    viewStore={this.props.viewStore}
                    onCopy={this.onCopyEntry}
                    allowEdit
                />
            </div>
        );
    }
}
