import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer } from 'mobx-react';
import UserOverviewItem from './UserOverviewItem';
import { EntryList } from '../component/EntryList';
import { UserStore } from '../store/User';
import { EntryStore } from '../store/Entry';
import { ProjectStore } from '../store/Project';
import { UserFilter, UserFilterChange } from '../component/UserFilter';

@observer
export default class UserOverview extends Component {
    static propTypes = {
        users: PropTypes.instanceOf(UserStore).isRequired,
        entries: PropTypes.instanceOf(EntryStore).isRequired,
        projects: PropTypes.instanceOf(ProjectStore).isRequired,
    };

    constructor(props){
        super(props);
    }

    renderUser = user => {
        const { entries, projects } = this.props;

        const userEntries = entries.filter(entry => {
            return entry.user === user.id && !entry.endedAt;
        });

        return (
            <UserOverviewItem
                key={user.id}
                user={user}
                entries={userEntries}
                projects={projects}
            />
        );
    };

    render() {
        const result = this.props.users.map(this.renderUser);
        console.log('map result', result);
        return (
        <div>
            <UserFilter>
                <UserFilterChange overview={this}>
                </UserFilterChange>
            </UserFilter>
            <EntryList>
                {result}
            </EntryList>
        </div>
        );
    }
}
