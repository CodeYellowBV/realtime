import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';
import moment from 'moment';
import InputText from '../component/InputText';
import InputTime from '../component/InputTime';
import InputSelect from '../component/InputSelect';
import Form from '../component/Form';

@observer
export default class Login extends Component {
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
            entry.endedAt = moment(value, 'HH:mm');
        }
    };

    handleSubmit = () => {
        this.props.onSubmitEntry();
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
            <Form onSubmit={this.handleSubmit}>
                <InputText
                    name="description"
                    label="Description"
                    onChange={this.handleInput}
                    value={entry.description}
                />
                <InputSelect
                    name="project"
                    label="Project"
                    placeholder="Choose project"
                    options={this.props.projectStore.map(this.formatProjectToOption)}
                    onChange={this.handleInput}
                    value={entry.project.id ? String(entry.project.id) : ''}
                />
                <InputTime
                    name="startedAt"
                    label="Started at"
                    onChange={this.handleInput}
                    value={entry.startedAt.format('HH:mm')}
                />
                <InputTime
                    name="endedAt"
                    label="Ended at"
                    onChange={this.handleInput}
                    value={entry.endedAt.format('HH:mm')}
                />
                <button>Save</button>
            </Form>
        );
    }
}
