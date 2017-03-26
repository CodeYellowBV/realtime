import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';
import TimeEntry from '../container/TimeEntry';
import EntryOverview from '../container/EntryOverview';

@observer
export default class Personal extends Component {
    static propTypes = {
        viewStore: PropTypes.object.isRequired,
        currentEntry: PropTypes.object.isRequired,
        projectStore: PropTypes.object.isRequired,
    };

    handleSubmitEntry = () => {
        this.props.viewStore.saveEntry(this.props.currentEntry);
    };

    render() {
        const { entries } = this.props.viewStore;
        return (
            <div>
                <TimeEntry
                    entry={this.props.currentEntry}
                    projectStore={this.props.projectStore}
                    onSubmitEntry={this.handleSubmitEntry}
                />
                <EntryOverview entries={entries} />
            </div>
        );
    }
}
