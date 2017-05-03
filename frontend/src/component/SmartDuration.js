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
        const nowDiff = endedAt.diff(startedAt, 'minutes');
        const duration = moment.duration(nowDiff, 'minutes');

        let style = {};
        if (nowDiff > UNLIKELY_MINUTES) {
            style = { color: 'red' };
        }

        return <span style={style}>{duration.format('h[h] m[m]')}</span>;
    }
}
