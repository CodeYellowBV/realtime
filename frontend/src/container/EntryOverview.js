import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { map } from 'lodash';
import moment from 'moment';
import EntryOverviewItem from './EntryOverviewItem';
import { EntryList } from '../component/EntryList';
import { ProjectStore } from '../store/Project';
import { EntryStore } from '../store/Entry';

@observer
export default class EntryOverview extends Component {
    static propTypes = {
        entries: PropTypes.instanceOf(EntryStore).isRequired,
        projectStore: PropTypes.instanceOf(ProjectStore).isRequired,
    };

    renderEntry = entry => {
        return (
            <EntryOverviewItem
                key={entry.cid}
                entry={entry}
                projectStore={this.props.projectStore}
            />
        );
    };

    renderDay = (entries, date) => {
        const day = moment(date);
        const dayTitle = day.calendar(null, {
            sameDay: '[Today]',
            lastDay: '[Yesterday]',
            lastWeek: '[Last] dddd',
            sameElse: 'dddd DD MMM',
        });
        return (
            <div key={date}>
                <h3>{dayTitle}</h3>
                <EntryList>
                    {entries.map(this.renderEntry)}
                </EntryList>
            </div>
        );
    };

    render() {
        if (!this.props.entries.length) {
            return <div>You do not have any entries yet.</div>;
        }
        return (
            <EntryList>
                {map(this.props.entries.groupByDate, this.renderDay)}
            </EntryList>
        );
    }
}
