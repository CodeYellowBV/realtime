import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { observable } from 'mobx';
import { EntryItemProject } from 'component/EntryList';
import { Project } from 'store/Project';
import InputText from 'component/InputText';
import Form from '../Form';
import Link from '../Link';
import styled from 'styled-components';
const PMCLabel = styled.span`
    margin-left: 10px;
`;

@observer
export class ProjectPmc extends Component {
    static propTypes = {
        project: PropTypes.instanceOf(Project).isRequired,
        editing: PropTypes.bool,
        onClose: PropTypes.func.isRequired,
    };

    handleChange = (name, value) => {
        this.props.project.pmc = value;
    };

    render() {
        const { project, editing } = this.props;
        if (editing) {
            return (
                <EntryItemProject>
                    PMC:
                    <Form onSubmit={this.props.onClose}>
                        <InputText
                            onChange={this.handleChange}
                            name="pmc"
                            value={project.pmc}
                            autoFocus
                            small
                        />
                    </Form>
                </EntryItemProject>
            );
        }
        return <EntryItemProject />;
    }
}

@observer
export default class ProjectName extends Component {
    static propTypes = {
        project: PropTypes.instanceOf(Project).isRequired,
        editing: PropTypes.bool,
        onClose: PropTypes.func.isRequired,
    };

    handleChange = (name, value) => {
        this.props.project.name = value;
    };

    render() {
        const { project, editing } = this.props;
        if (editing) {
            return (
                <EntryItemProject>
                    <Form onSubmit={this.props.onClose}>
                        Naam:
                        <InputText
                            onChange={this.handleChange}
                            name="name"
                            value={project.name}
                            autoFocus
                            small
                        />
                    </Form>
                </EntryItemProject>
            );
        }
        return (
            <EntryItemProject>
                <Link to={`/project/entries/${project.id}`}>
                    {project.name || <i>No name</i>}
                </Link>
                <PMCLabel>
                    PMC: {project.pmc || <i>No pmc</i>}
                </PMCLabel>
            </EntryItemProject>
        );
    }
}
