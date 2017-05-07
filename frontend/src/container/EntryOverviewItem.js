import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer } from 'mobx-react';
import {
    EntryItem,
    EntryItemDescription,
    EntryItemProject,
    EntryItemHours,
    EntryItemActions,
} from '../component/EntryList';
import Button from '../component/Button';
import { ProjectStore } from '../store/Project';
import { UserStore } from '../store/User';
import { Entry } from '../store/Entry';

function formatDiffMinutes(minutes) {
    return (minutes / 60).toFixed(2);
}

@observer
export default class EntryOverviewItem extends Component {
    static propTypes = {
        entry: PropTypes.instanceOf(Entry).isRequired,
        projectStore: PropTypes.instanceOf(ProjectStore).isRequired,
        userStore: PropTypes.instanceOf(UserStore),
    };

    handleDelete = () => {
        this.props.entry.delete();
    };

    render() {
        const { entry } = this.props;
        const diffMinutes = entry.differenceInMinutes;
        const project = entry.project
            ? this.props.projectStore.get(entry.project)
            : null;
        let userColumn = null;
        if (this.props.userStore) {
            const user = entry.user
                ? this.props.userStore.get(entry.user)
                : null;
            userColumn = <EntryItemHours>{user.displayName}</EntryItemHours>;
        }
        return (
            <EntryItem key={entry.id}>
                <EntryItemProject>
                    {project ? project.name : '[No project]'}
                </EntryItemProject>
                <EntryItemDescription>{entry.description}</EntryItemDescription>
                <EntryItemHours>
                    {entry.startedAt.format('HH:mm')}{' - '}
                    {entry.endedAt ? entry.endedAt.format('HH:mm') : 'Running'}
                    {diffMinutes
                        ? ` (${formatDiffMinutes(diffMinutes)}h)`
                        : null}
                </EntryItemHours>
                {userColumn}
                <EntryItemActions>
                    <Button onClick={this.handleDelete}>×</Button>
                </EntryItemActions>
            </EntryItem>
        );
    }
}
