import React, { Component, PropTypes } from 'react';
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
        onSubmitEntry: PropTypes.func.isRequired,
    };

    handleInput = (key, value) => {
        const { entry } = this.props;
        if (key === 'description') {
            entry.description = value;
        }

        if (key === 'project') {
            const projectData = this.props.projectStore.get(value);
            if (projectData) {
                entry.project.parse(projectData.toJS());
            } else {
                entry.project.clear();
            }
        }

        if (key === 'startedAt') {
            entry.startedAt = moment(value, 'HH:mm');
        }

        if (key === 'endedAt') {
            entry.endedAt = value === '' ? null : moment(value, 'HH:mm');
        }
    };

    handleSubmit = () => {
        this.props.onSubmitEntry();
        this.props.entry.partialClear();
    };

    formatProjectToOption(project) {
        return {
            value: String(project.id),
            name: project.title,
        };
    }

    render() {
        const { entry } = this.props;
        return (
            <TimeEntryForm onSubmit={this.handleSubmit}>
                <TimeEntryFormField label="Project" size="1">
                    <InputSelect
                        name="project"
                        placeholder="Choose project"
                        options={this.props.projectStore.map(this.formatProjectToOption)}
                        onChange={this.handleInput}
                        value={entry.project.id ? String(entry.project.id) : ''}
                    />
                </TimeEntryFormField>
                <TimeEntryFormField label="Description" size="2">
                    <InputText
                        name="description"
                        onChange={this.handleInput}
                        value={entry.description}
                    />
                </TimeEntryFormField>
                <TimeEntryFormField label="Started at" size="1">
                    <InputTime
                        name="startedAt"
                        onChange={this.handleInput}
                        value={entry.startedAt ? entry.startedAt.format('HH:mm') : ''}
                        disableCancel
                    />
                </TimeEntryFormField>
                <TimeEntryFormField label="Ended at" size="1">
                    <InputTime
                        name="endedAt"
                        onChange={this.handleInput}
                        value={entry.endedAt ? entry.endedAt.format('HH:mm') : ''}
                    />
                </TimeEntryFormField>
                <button>Save</button>
            </TimeEntryForm>
        );
    }
}
