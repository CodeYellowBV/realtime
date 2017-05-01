import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer } from 'mobx-react';
import InputText from '../component/InputText';
import Button from '../component/Button';
import { TimeEntryForm, TimeEntryFormField } from '../component/TimeEntryForm';

@observer
export default class ProjectAdd extends Component {
    static propTypes = {
        project: PropTypes.object.isRequired,
    };

    handleInput = (key, value) => {
        const { project } = this.props;
        project[key] = value;
    };

    handleSubmit = () => {
        this.props.project.save();
        this.props.project.clear();
    };

    render() {
        const { project } = this.props;
        return (
            <TimeEntryForm onSubmit={this.handleSubmit}>
                <TimeEntryFormField label="Title" size="2">
                    <InputText
                        name="name"
                        onChange={this.handleInput}
                        value={project.name}
                    />
                </TimeEntryFormField>
                <Button type="submit">Save</Button>
            </TimeEntryForm>
        );
    }
}
