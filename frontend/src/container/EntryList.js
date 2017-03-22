import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';

@observer
export default class EntryList extends Component {
    static propTypes = {
        entries: PropTypes.object.isRequired,
    }

    renderEntry(entry) {
        return (
            <tr key={entry.id}>
                <td>{entry.description}</td>
                <td>{entry.project.id ? entry.project.title : '[Missing]'}</td>
                <td>{entry.startedAt.format('YYYY-MM-DD HH:mm')}</td>
                <td>{entry.endedAt.format('YYYY-MM-DD HH:mm')}</td>
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
