import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { action } from 'mobx';
import moment from 'moment';
import InputText from '../component/InputText';
import InputTime, { InputTimeButton } from '../component/InputTime';
import Button from '../component/Button';
import SmartDuration from '../component/SmartDuration';
import InputSelect from '../component/InputSelect';
import { TimeEntryForm, TimeEntryFormField } from '../component/TimeEntryForm';
import { ProjectStore } from '../store/Project';
import { Entry } from '../store/Entry';
import View from '../store/View';

@observer
export default class TimeEntry extends Component {
    static propTypes = {
        entry: PropTypes.instanceOf(Entry).isRequired,
        projectStore: PropTypes.instanceOf(ProjectStore).isRequired,
        viewStore: PropTypes.instanceOf(View).isRequired,
    };

    @action handleInput = (key, value) => {
        const { entry } = this.props;
        entry._editing = true;
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

    @action handleSubmit = () => {
        const { entry, viewStore } = this.props;
        const now = moment();
        // If the entry already existed, we just want to set the end time.
        if (entry.id && !entry.endedAt) {
            entry._editing = true;
            entry.endedAt = now;
            return;
        }
        let msg = '';
        if (entry.startedAt.isAfter(now)) {
            msg = 'From time cannot be in the future';
        }
        if (entry.endedAt) {
            if (entry.endedAt.isAfter(now)) {
                msg = 'Until time cannot be in the future';
            }
            if (entry.endedAt.isBefore(entry.startedAt)) {
                msg = 'Until time cannot be before from time';
            }
            if (entry.endedAt.diff(entry.startedAt, 'hours') > 24) {
                msg =
                    'It is not humanly possible to work for more than 24 hours';
            }
        }
        if (msg === '') {
            entry.save();
            entry.partialClear();
        } else {
            viewStore.addNotification({
                message: msg,
                key: 'entryFail',
                dismissAfter: 4000,
            });
        }
    };

    formatProjectToOption(project) {
        return {
            value: String(project.id),
            name: project.name,
        };
    }

    render() {
        const { entry } = this.props;
        let submitText = 'Save';
        if (!entry.id && !entry.endedAt) {
            submitText = 'Start';
        }
        if (entry.id && !entry.endedAt) {
            submitText = 'Stop';
        }

        return (
            <TimeEntryForm onSubmit={this.handleSubmit}>
                <TimeEntryFormField label="Project" size="1">
                    <InputSelect
                        name="project"
                        placeholder="Choose project"
                        options={this.props.projectStore.map(
                            this.formatProjectToOption
                        )}
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
                    <InputTimeButton disabled>
                        {entry.endedAt
                            ? <SmartDuration
                                  startedAt={entry.startedAt}
                                  endedAt={entry.endedAt}
                              />
                            : '—'}
                    </InputTimeButton>
                </TimeEntryFormField>
                <TimeEntryFormField label="Until" size="1">
                    <InputTime
                        name="endedAt"
                        onChange={this.handleInput}
                        value={entry.endedAt}
                    />
                </TimeEntryFormField>
                <Button type="submit">{submitText}</Button>
            </TimeEntryForm>
        );
    }
}
