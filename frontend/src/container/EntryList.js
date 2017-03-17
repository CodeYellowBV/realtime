import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';

@observer
export default class EntryList extends Component {
    static propTypes = {
        entries: PropTypes.object.isRequired,
    }

    renderEntry(entry) {
        return (
            <tr>
                <th>{entry.description}</th>
                <th>-</th>
                <th>{entry.startedAt}</th>
                <th>{entry.endedAt}</th>
            </tr>
        );
    }

    render() {
        if (!this.props.entries.length) {
            return <div>You do not have any entries yet.</div>;
        }
        return (
            <table>
                <thead>
                    <tr>
                        <th>Description</th>
                        <th>Project</th>
                        <th>Started at</th>
                        <th>Ended at</th>
                    </tr>
                </thead>
                <tbody>
                    {this.props.entries.map(this.renderEntry)}
                </tbody>
            </table>
        );
    }
}
