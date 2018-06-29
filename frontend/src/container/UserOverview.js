import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer } from 'mobx-react';
import UserOverviewItem from './UserOverviewItem';
import { EntryList } from '../component/EntryList';
import { UserStore } from '../store/User';
import { EntryStore } from '../store/Entry';
import { ProjectStore } from '../store/Project';

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

    renderEnabledUser = user => {
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
                showenabled={true}
            />
        );
    };

    renderDisabledUser = user => {
        const { entries, projects } = this.props;

        const userEntries = entries.filter(entry => {
            return entry.user === user.id && !entry.endedAt;
        });

        //refresh

        return (
            <UserOverviewItem
                key={user.id}
                user={user}
                entries={userEntries}
                projects={projects}
                showenabled={false}
            />
        );
    }

    compare = (a,b) => {
        console.log('compare: a', a);
        console.log('compare: b', b);
        return a.props.user.username.localeCompare(b.props.user.username);
    };

    render() {
        const enabled = this.props.users.map(this.renderEnabledUser);
        const disabled = this.props.users.map(this.renderDisabledUser);
        enabled.sort(this.compare);
        disabled.sort(this.compare);
        return (
        <div>
            <EntryList>
                {enabled}
            </EntryList>
            <br></br>
            <br></br>
            <div>Users that no longer work here</div>
            <br></br>
            <EntryList>
                {disabled}
            </EntryList>
        </div>
        );
    }
}
