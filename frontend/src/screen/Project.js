import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer } from 'mobx-react';
import ProjectAdd from '../container/ProjectAdd';
import ProjectOverview from '../container/ProjectOverview';
import View from '../store/View';
import { Project, ProjectStore } from '../store/Project';

@observer
export default class ProjectScreen extends Component {
    static propTypes = {
        viewStore: PropTypes.instanceOf(View).isRequired,
        projectStore: PropTypes.instanceOf(ProjectStore).isRequired,
        currentProject: PropTypes.instanceOf(Project).isRequired,
    };

    componentDidMount() {
        this.subscribe();
        this.props.viewStore.socket.on('open', this.subscribe);
    }

    componentWillUnmount() {
        this.unsubscribe();
    }

    subscribe = () => {
        this.props.projectStore.clear();
        this.props.projectStore.subscribe();
    };

    unsubscribe = () => {
        this.props.projectStore.unsubscribe();
    };

    handleSubmit = () => {
        this.props.currentProject.clear();
    };

    render() {
        return (
            <div>
                <ProjectAdd
                    project={this.props.currentProject}
                />
                <ProjectOverview projects={this.props.projectStore} />
            </div>
        );
    }
}
