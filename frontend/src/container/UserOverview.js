import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer } from 'mobx-react';
import UserOverviewItem from './UserOverviewItem';
import { EntryList } from '../component/EntryList';

@observer
export default class UserOverview extends Component {
    static propTypes = {
        users: PropTypes.object.isRequired,
    };

    renderUser(user) {
        return <UserOverviewItem key={user.id} user={user}></UserOverviewItem>;
    }

    render() {
        return (
            <EntryList>
                {this.props.users.map(this.renderUser)}
            </EntryList>
        );
    }
}
