import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer } from 'mobx-react';
import {
    EntryItem,
    EntryItemProject,
    EntryItemActions,
} from '../component/EntryList';
import Icon from '../component/Icon';
import Link from '../component/Link';
import IconDelete from 'image/icon-delete.svg';
import { Project } from '../store/Project';

@observer
export default class ProjectOverviewItem extends Component {
    static propTypes = {
        project: PropTypes.instanceOf(Project).isRequired,
    };

    handleDelete = () => {
        const sure = window.confirm(
            'Are you completely sure you want to remove this project? All time entries will also be deleted.'
        );
        if (sure) {
            this.props.project.delete();
        }
    };

    render() {
        const { project } = this.props;
        return (
            <EntryItem>
                <EntryItemProject>
                    <Link to={`/project/entries/${project.id}`}>
                        {project.name}
                    </Link>
                </EntryItemProject>
                <EntryItemActions>
                    <Icon onClick={this.handleDelete} icon={IconDelete} />
                </EntryItemActions>
            </EntryItem>
        );
    }
}
