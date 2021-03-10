import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer } from 'mobx-react';
import moment from 'moment';
import {
    EntryItem,
    EntryItemProject,
    EntryItemDescription,
    EntryItemActions,
} from '../component/EntryList';
import Link from '../component/Link';
import { User } from '../store/User';
import { ProjectStore } from '../store/Project';
import SmartDuration from '../component/SmartDuration';
import { api } from '../store/Base';
import IconEnable from 'image/icon-enable-user.svg';
import IconDisable from 'image/icon-disable-user.svg';
import Icon from 'component/Icon';
import styled from 'styled-components';

const PMCLabel = styled.span`
    margin-left: 10px;
`;

@observer
export default class UserOverviewItem extends Component {
    static propTypes = {
        user: PropTypes.instanceOf(User).isRequired,
        entries: PropTypes.array.isRequired,
        projects: PropTypes.instanceOf(ProjectStore).isRequired,
        showenabled: PropTypes.bool,
    };

    renderEntry = entry => {
        const project = this.props.projects.get(entry.project);
        return (
            <span key={entry.id}>
                {project ? project.name : '[unknown project]'}
                {' '}
                since
                {' '}
                {entry.startedAt.format('HH:mm')}
                {' '}
                (
                <SmartDuration startedAt={entry.startedAt} endedAt={moment()} />
                )
            </span>
        );
    };

    renderEntries = entries => {
        if (entries.length > 0) {
            return entries.map(this.renderEntry);
        }
        return 'Not working at the moment';
    };

    renderDisable = user => {
        if (user.stillWorking) {
            //return 'Click to disable';
            return (
                <EntryItemActions>
                    <Icon onClick={this.handleDisable} icon={IconDisable} />
                </EntryItemActions>
            );
        }
        //return 'Click to enable';
        return (
            <EntryItemActions>
                <Icon onClick={this.handleDisable} icon={IconEnable} />
            </EntryItemActions>
        );
    };

    handleDisable = () => {
        this.props.user.stillWorking = !this.props.user.stillWorking;
        if (this.props.user.stillWorking) {
            api.socket.send({
                type: 'enableUser',
                data: this.props.user.username,
            });
        } else {
            api.socket.send({
                type: 'disableUser',
                data: this.props.user.username,
            });
        }
    };

    render() {
        const { user, entries } = this.props;
        if (user.stillWorking !== this.props.showenabled) {
            return null;
        }
        return (
            <EntryItem>
                <EntryItemProject>
                    <Link to={`/user/entries/${user.id}`}>
                        {user.displayName}
                    </Link>
                    <PMCLabel>
                        PMC: {user.pmc}
                    </PMCLabel>
                </EntryItemProject>
                <EntryItemDescription>
                    {this.renderEntries(entries)}
                </EntryItemDescription>
                <EntryItemDescription>
                    {this.renderDisable(user)}
                </EntryItemDescription>
            </EntryItem>
        );
    }
}
