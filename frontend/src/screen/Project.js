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
    };

    componentWillMount() {
        this.projectStore = new ProjectStore();
        this.currentProject = new Project();
    }

    componentDidMount() {
        this.subscribe();
        this.props.viewStore.socket.on('open', this.subscribe);
    }

    componentWillUnmount() {
        this.unsubscribe();
    }

    subscribe = () => {
        this.projectStore.clear();
        this.projectStore.subscribe();
    };

    unsubscribe = () => {
        this.projectStore.unsubscribe();
    };

    handleSubmit = () => {
        this.currentProject.clear();
    };

    render() {
        return (
            <div>
                <ProjectAdd project={this.currentProject} />
                <ProjectOverview projects={this.projectStore} />
            </div>
        );
    }
}
