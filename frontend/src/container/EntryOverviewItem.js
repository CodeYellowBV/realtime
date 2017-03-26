import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';
import { EntryList, EntryItem, EntryItemDescription, EntryItemProject, EntryItemHours } from '../component/EntryList';

function formatDiffMinutes(minutes) {
    return (minutes / 60).toFixed(2);
}

@observer
export default class EntryOverviewItem extends Component {
    static propTypes = {
        entry: PropTypes.object.isRequired,
    }

    render() {
        const { entry } = this.props;
        const diffMinutes = entry.differenceInMinutes;
        return (
            <EntryItem key={entry.id}>
                <EntryItemDescription>{entry.description}</EntryItemDescription>
                <EntryItemProject>{entry.project.id ? entry.project.title : '[Missing]'}</EntryItemProject>
                <EntryItemHours>
                    {entry.startedAt.format('HH:mm')}{' - '}
                    {entry.endedAt ? entry.endedAt.format('HH:mm') : 'Running'}
                    {diffMinutes ? ` (${formatDiffMinutes(diffMinutes)}h)` : null}
                </EntryItemHours>
            </EntryItem>
        );
    }
}
