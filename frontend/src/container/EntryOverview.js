import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';
import EntryOverviewItem from './EntryOverviewItem';
import { EntryList } from '../component/EntryList';

@observer
export default class EntryOverview extends Component {
    static propTypes = {
        entries: PropTypes.object.isRequired,
    }

    renderEntry(entry) {
        return (
            <EntryOverviewItem key={entry.id} entry={entry} />
        );
    }

    render() {
        if (!this.props.entries.length) {
            return <div>You do not have any entries yet.</div>;
        }
        return (
            <div>
                <h3>Today</h3>
                <EntryList>
                    {this.props.entries.map(this.renderEntry)}
                </EntryList>
            </div>
        );
    }
}
