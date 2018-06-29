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
import IconDelete from 'image/icon-delete.svg';
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
        projectStore: PropTypes.instanceOf(ProjectStore).isRequired,
        userStore: PropTypes.instanceOf(UserStore),
        allowEdit: PropTypes.bool,
    };

    handleDelete = () => {
        this.props.entry.delete();
    };

    enterTicketPage = () => {
        window.open('https://phabricator.codeyellow.nl/T' + this.props.entry.ticket, '_blank');
    }

    render() {
        const { entry, allowEdit, projectStore } = this.props;
        const diffMinutes = entry.differenceInMinutes;

        const wbso = entry.wbso;
        const ticketLink = this.props.entry.ticket ? 'https://phabricator.codeyellow.nl/T' + this.props.entry.ticket : null;

        let userColumn = null;
        if (this.props.userStore) {
            const user = entry.user
                ? this.props.userStore.get(entry.user)
                : null;
            userColumn = <EntryItemTime>{user.displayName}</EntryItemTime>;
        }
        const ticketLinkStyle = {
            visibility: ticketLink ? 'visible' : 'hidden'
        };
        return (
            <EntryItem>
                <EntryProject
                    entry={entry}
                    projectStore={projectStore}
                    allowEdit={allowEdit}
                />
                <EntryItemActions>
                    <a href={ticketLink} target="_blank" style={ticketLinkStyle}>
                        <Icon icon={IconTicketLink}/>
                    </a>
                </EntryItemActions>
                <EntryTicket entry={entry} allowEdit={allowEdit} />
                <EntryDescription entry={entry} allowEdit={allowEdit} />
                <EntryStartTime entry={entry} allowEdit={allowEdit} />
                <div>—</div>
                <EntryEndTime entry={entry} allowEdit={allowEdit} />
                <EntryItemTime>
                    <SimpleDuration minutes={diffMinutes} />
                </EntryItemTime>
                {userColumn}
                <EntryWBSO entry={entry} allowEdit={allowEdit} />
                <EntryItemWBSO>wbso</EntryItemWBSO>
                <EntryItemActions>
                    {allowEdit
                        ? <Icon onClick={this.handleDelete} icon={IconDelete} />
                        : null}
                </EntryItemActions>
            </EntryItem>
        );
    }
}
