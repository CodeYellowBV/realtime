import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';
import TimeEntry from '../container/TimeEntry';
import EntryList from '../container/EntryList';

@observer
export default class EntryOverview extends Component {
    static propTypes = {
        viewStore: PropTypes.object.isRequired,
        currentEntry: PropTypes.object.isRequired,
        projectStore: PropTypes.object.isRequired,
    }

    render() {
        const { entries } = this.props.viewStore;
        return (
            <div>
                <TimeEntry
                    entry={this.props.currentEntry}
                    projectStore={this.props.projectStore}
                />
                <EntryList entries={entries} />
            </div>
        );
    }
}
