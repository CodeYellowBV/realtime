import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { observable } from 'mobx';
import { EntryItemTime } from 'component/EntryList';
import { Entry } from 'store/Entry';
import InputTime from 'component/InputTime';
import InputSimpleTime from 'component/InputSimpleTime';
import Form from '../Form';
import View from '../../store/View';

@observer
export default class EntryStartTime extends Component {
    static propTypes = {
        entry: PropTypes.instanceOf(Entry).isRequired,
        viewStore: PropTypes.instanceOf(View).isRequired,
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
        const newMillis = value._d.getTime();
        const endMillis = this.props.entry.endedAt._d.getTime();
        if(newMillis <= endMillis){
            this.props.entry.startedAt = value;
            this.props.entry.save();
            this.editing = false;
        }
        else {
            this.props.viewStore.addNotification({//normally, I would use single quotes, but... well... the word can't...
                message: "The start time can't be later than the end time.",
                key: 'entryFail',
                dismissAfter: 4000,
            });
        }
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
