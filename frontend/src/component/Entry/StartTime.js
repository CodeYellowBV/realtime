import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { observable } from 'mobx';
import { EntryItemTime } from 'component/EntryList';
import { Entry } from 'store/Entry';
import InputTime from 'component/InputTime';
import InputSimpleTime from 'component/InputSimpleTime';
import Form from '../Form';

@observer
export default class EntryStartTime extends Component {
    static propTypes = {
        entry: PropTypes.instanceOf(Entry).isRequired,
        allowEdit: PropTypes.bool,
    };

    @observable editing = false;

    handleBlur = () => {
        this.editing = false;
    };

    handleClick = () => {
        if (this.props.allowEdit) {
            this.editing = true;
        }
    };

    handleChange = (name, value) => {
        this.props.entry.startedAt = value;
        this.props.entry.save();
        this.editing = false;
    };

    render() {
        const { entry, allowEdit } = this.props;
        if (this.editing) {
            return (
                <EntryItemTime>
                    <Form onSubmit={this.handleBlur}>
                        <InputSimpleTime
                            onChange={this.handleChange}
                            name="startedAt"
                            value={entry.startedAt}
                            onBlur={this.handleBlur}
                            autoFocus
                            small
                        />
                    </Form>
                </EntryItemTime>
            );
        }
        return (
            <EntryItemTime
                onClick={this.handleClick}
                allowEdit={allowEdit}
            >
                {entry.startedAt ? entry.startedAt.format("HH:mm") : 'Not started'}
            </EntryItemTime>
        );
    }
}
