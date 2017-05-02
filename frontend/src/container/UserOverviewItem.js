import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer } from 'mobx-react';
import {
    EntryItem,
    EntryItemProject,
} from '../component/EntryList';
import { User } from '../store/User';

@observer
export default class UserOverviewItem extends Component {
    static propTypes = {
        user: PropTypes.instanceOf(User).isRequired,
    };

    render() {
        const { user } = this.props;
        return (
            <EntryItem>
                <EntryItemProject>
                    {user.displayName}
                </EntryItemProject>
            </EntryItem>
        );
    }
}
