import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer } from 'mobx-react';
import ProjectAdd from '../container/ProjectAdd';
import ProjectOverview from '../container/ProjectOverview';

@observer
export default class Project extends Component {
    static propTypes = {
        viewStore: PropTypes.object.isRequired,
        projectStore: PropTypes.object.isRequired,
        currentProject: PropTypes.object.isRequired,
    };

    componentDidMount() {
        this.subscribe();
        this.props.viewStore.socket.on('open', this.subscribe);
        this.props.viewStore.socket.on('close', this.unsubscribe);
    }

    componentWillUnmount() {
        this.unsubscribe();
    }

    subscribe = () => {
        this.props.projectStore.subscribe();
    };

    unsubscribe = () => {
        this.props.projectStore.clear();
        this.props.projectStore.unsubscribe();
    };

    handleSubmit = () => {
        console.log('submit');
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
