import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';
import { EntryList, EntryItem, EntryItemDescription, EntryItemProject, EntryItemHours } from '../component/EntryList';

@observer
export default class EntryOverview extends Component {
    static propTypes = {
        entries: PropTypes.object.isRequired,
    }

    renderEntry(entry) {
        return (
            <EntryItem key={entry.id}>
                <EntryItemDescription>{entry.description}</EntryItemDescription>
                <EntryItemProject>{entry.project.id ? entry.project.title : '[Missing]'}</EntryItemProject>
                <EntryItemHours>
                    {entry.startedAt.format('HH:mm')}{' - '}
                    {entry.endedAt ? entry.endedAt.format('HH:mm') : 'Running'}
                </EntryItemHours>
            </EntryItem>
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
