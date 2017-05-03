import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer } from 'mobx-react';
import moment from 'moment';

// It's not likely you can work for more than 12 hours.
const UNLIKELY_MINUTES = 720;

@observer
export default class SmartDuration extends Component {
    static propTypes = {
        startedAt: PropTypes.instanceOf(moment).isRequired,
        endedAt: PropTypes.instanceOf(moment).isRequired,
    };

    render() {
        const { startedAt, endedAt } = this.props;
        // `endedAt` is set to end of the minute so the duration is exactly 1 hours if start time is e.g. 18:00 and end time 19:00
        const nowDiff = endedAt
            .clone()
            .endOf('minute')
            .diff(startedAt, 'minutes');
        const duration = moment.duration(nowDiff, 'minutes');

        let style = {};
        if (nowDiff > UNLIKELY_MINUTES) {
            style = { color: 'red' };
        }

        return <span style={style}>{duration.format('h[h] m[m]')}</span>;
    }
}
