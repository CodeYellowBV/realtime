import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer } from 'mobx-react';
import moment from 'moment';
import InputText from '../component/InputText';
import InputTime from '../component/InputTime';
import InputSelect from '../component/InputSelect';
import { TimeEntryForm, TimeEntryFormField } from '../component/TimeEntryForm';

@observer
export default class TimeEntry extends Component {
    static propTypes = {
        entry: PropTypes.object.isRequired,
        projectStore: PropTypes.object.isRequired,
    };

    handleInput = (key, value) => {
        const { entry } = this.props;
        if (key === 'description') {
            entry.description = value;
        }

        if (key === 'project') {
            entry.project = isNaN(value) ? null : parseInt(value);
        }

        if (key === 'startedAt') {
            entry.startedAt = value;
        }

        if (key === 'endedAt') {
            entry.endedAt = value;
        }
    };

    handleSubmit = () => {
        this.props.entry.save();
        this.props.entry.partialClear();
    };

    formatProjectToOption(project) {
        return {
            value: String(project.id),
            name: project.name,
        };
    }

    render() {
        const { entry } = this.props;
        const duration = entry.endedAt ? moment(entry.endedAt.diff(entry.startedAt)) : null;
        return (
            <TimeEntryForm onSubmit={this.handleSubmit}>
                <TimeEntryFormField label="Project" size="1">
                    <InputSelect
                        name="project"
                        placeholder="Choose project"
                        options={this.props.projectStore.map(this.formatProjectToOption)}
                        onChange={this.handleInput}
                        value={entry.project ? String(entry.project) : ''}
                    />
                </TimeEntryFormField>
                <TimeEntryFormField label="Description" size="2">
                    <InputText
                        name="description"
                        onChange={this.handleInput}
                        value={entry.description}
                    />
                </TimeEntryFormField>
                <TimeEntryFormField label="From" size="1">
                    <InputTime
                        name="startedAt"
                        onChange={this.handleInput}
                        value={entry.startedAt}
                        disableClear
                    />
                </TimeEntryFormField>
                <TimeEntryFormField label="Duration" size="1">
                    <div>{duration ? duration.format('HH:mm') : '—'}</div>
                </TimeEntryFormField>
                <TimeEntryFormField label="Until" size="1">
                    <InputTime
                        name="endedAt"
                        onChange={this.handleInput}
                        value={entry.endedAt}
                    />
                </TimeEntryFormField>
                <button>Save</button>
            </TimeEntryForm>
        );
    }
}
