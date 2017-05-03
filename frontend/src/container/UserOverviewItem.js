import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer } from 'mobx-react';
import {
    EntryItem,
    EntryItemProject,
    EntryItemDescription,
} from '../component/EntryList';
import { User } from '../store/User';
import { ProjectStore } from '../store/Project';

@observer
export default class UserOverviewItem extends Component {
    static propTypes = {
        user: PropTypes.instanceOf(User).isRequired,
        entries: PropTypes.array.isRequired,
        projects: PropTypes.instanceOf(ProjectStore).isRequired,
    };

    renderEntry = entry => {
        const project = this.props.projects.get(entry.project);
        return `${project ? project.name : '[unknown project]'} since ${entry.startedAt.format('HH:mm')}`;
    };

    renderEntries = entries => {
        if (entries.length > 0) {
            return entries.map(this.renderEntry).join(', ');
        }
        return 'Not working at the moment';
    };

    render() {
        const { user, entries } = this.props;
        return (
            <EntryItem>
                <EntryItemProject>
                    {user.displayName}
                </EntryItemProject>
                <EntryItemDescription>
                    {this.renderEntries(entries)}
                </EntryItemDescription>
            </EntryItem>
        );
    }
}
