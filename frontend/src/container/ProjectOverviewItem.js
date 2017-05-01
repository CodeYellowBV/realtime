import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer } from 'mobx-react';
import {
    EntryItem,
    EntryItemProject,
    EntryItemActions,
} from '../component/EntryList';
import Button from '../component/Button';

@observer
export default class ProjectOverviewItem extends Component {
    static propTypes = {
        project: PropTypes.object.isRequired,
    };

    handleDelete = () => {
        const sure = window.confirm('Are you completely sure you want to remove this project? All time entries will also be deleted.');
        if (sure) {
            this.props.project.delete();
        }
    };

    render() {
        const { project } = this.props;
        return (
            <EntryItem>
                <EntryItemProject>
                    {project.name}
                </EntryItemProject>
                <EntryItemActions>
                    <Button onClick={this.handleDelete}>×</Button>
                </EntryItemActions>
            </EntryItem>
        );
    }
}
