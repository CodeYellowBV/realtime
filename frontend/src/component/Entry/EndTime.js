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
export default class EntryEndTime extends Component {
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
        const newMillis = value._d.getTime();
        const startMillis = this.props.entry.startedAt._d.getTime();
        if(newMillis >= startMillis){
            this.props.entry.endedAt = value;
            this.props.entry.save();
            this.editing = false;
        }
        else {
            this.props.viewStore.addNotification({//normally, I would use single quotes, but... well... the word can't...
                message: "The end time can't be earlier than the start time.",
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
                            name="endedAt"
                            value={entry.endedAt}
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
                {entry.endedAt ? entry.endedAt.format("HH:mm") : 'Now'}
            </EntryItemTime>
        );
    }
}
