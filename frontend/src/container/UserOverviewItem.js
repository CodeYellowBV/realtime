import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer } from 'mobx-react';
import {
    EntryItem,
    EntryItemProject,
} from '../component/EntryList';

@observer
export default class UserOverviewItem extends Component {
    static propTypes = {
        user: PropTypes.object.isRequired,
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