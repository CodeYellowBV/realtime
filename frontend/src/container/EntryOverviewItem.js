import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer } from 'mobx-react';
import {
    EntryItem,
    EntryItemTime,
    EntryItemActions,
    EntryItemWBSO,
} from 'component/EntryList';
import SimpleDuration from 'component/SimpleDuration';
import Icon from 'component/Icon';
import { ProjectStore } from 'store/Project';
import { UserStore } from 'store/User';
import { Entry } from 'store/Entry';
import View from 'store/View';
import IconDelete from 'image/icon-delete.svg';
import IconCopy from 'image/icon-copy.svg';
import IconTicketLink from 'image/icon-ticket-link.svg';
import EntryDescription from 'component/Entry/Description';
import EntryProject from 'component/Entry/Project';
import EntryTicket from 'component/Entry/Ticket';
import EntryStartTime from 'component/Entry/StartTime';
import EntryEndTime from 'component/Entry/EndTime';
import EntryWBSO from 'component/Entry/WBSO';

@observer
export default class EntryOverviewItem extends Component {
    static propTypes = {
        entry: PropTypes.instanceOf(Entry).isRequired,
        onCopy: PropTypes.func.isRequired,
        projectStore: PropTypes.instanceOf(ProjectStore).isRequired,
        userStore: PropTypes.instanceOf(UserStore),
        viewStore: PropTypes.instanceOf(View).isRequired,
        allowEdit: PropTypes.bool,
    };

    handleCopy = () => {
        const { onCopy, entry } = this.props;

        if (onCopy) {
            onCopy(entry);
        }
    };

    handleDelete = () => {
        if (!window.confirm('Are you sure you want to delete this?')) {
            return;
        }
        this.props.entry.delete();
    };

    render() {
        const { entry, allowEdit, projectStore, viewStore } = this.props;
        const diffMinutes = entry.differenceInMinutes;

        const wbso = entry.wbso;
        const ticketLink = this.props.entry.ticket
            ? 'https://phabricator.codeyellow.nl/T' + this.props.entry.ticket
            : null;

        let userColumn = null;
        if (this.props.userStore) {
            const user = entry.user
                ? this.props.userStore.get(entry.user)
                : null;
            userColumn = <EntryItemTime>{user.displayName}</EntryItemTime>;
        }
        const ticketLinkStyle = {
            visibility: ticketLink ? 'visible' : 'hidden',
        };
        return (
            <EntryItem>
                <EntryProject
                    entry={entry}
                    projectStore={projectStore}
                    allowEdit={allowEdit}
                    viewStore={viewStore}
                />
                <EntryItemActions>
                    <a
                        href={ticketLink}
                        target="_blank"
                        style={ticketLinkStyle}
                    >
                        <Icon icon={IconTicketLink} />
                    </a>
                </EntryItemActions>
                <EntryTicket entry={entry} allowEdit={allowEdit} />
                <EntryDescription entry={entry} allowEdit={allowEdit} />
                <EntryStartTime
                    entry={entry}
                    allowEdit={allowEdit}
                    viewStore={this.props.viewStore}
                />
                <div>—</div>
                <EntryEndTime
                    entry={entry}
                    allowEdit={allowEdit}
                    viewStore={this.props.viewStore}
                />
                <EntryItemTime>
                    <SimpleDuration minutes={diffMinutes} />
                </EntryItemTime>
                {userColumn}
                <EntryWBSO entry={entry} allowEdit={allowEdit} />
                <EntryItemWBSO />
                <EntryItemActions>
                    <Icon onClick={this.handleCopy} icon={IconCopy} />
                    {allowEdit
                        ? <Icon onClick={this.handleDelete} icon={IconDelete} />
                        : null}
                </EntryItemActions>
            </EntryItem>
        );
    }
}
