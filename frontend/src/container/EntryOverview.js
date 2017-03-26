import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';
import { map } from 'lodash';
import moment from 'moment';
import EntryOverviewItem from './EntryOverviewItem';
import { EntryList } from '../component/EntryList';

@observer
export default class EntryOverview extends Component {
    static propTypes = {
        entries: PropTypes.object.isRequired,
    };

    renderEntry(entry) {
        return <EntryOverviewItem key={entry.id} entry={entry} />;
    }

    renderDay = (entries, date) => {
        const day = moment(date);
        const dayTitle = day.calendar(null, {
            sameDay: '[Today]',
            lastDay: '[Yesterday]',
            lastWeek: '[Past] dddd',
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
            <div>
                <EntryList>
                    {map(this.props.entries.groupByDate, this.renderDay)}
                </EntryList>
            </div>
        );
    }
}
