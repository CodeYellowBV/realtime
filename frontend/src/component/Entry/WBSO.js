import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { observable } from 'mobx';
import { EntryItemDescription } from 'component/EntryList';
import { Entry } from 'store/Entry';
import InputInteger from 'component/InputInteger';
import Form from '../Form';

function getStringValue(wbso){
    if(wbso)
        return 'wbso?   Yes';
    else
        return 'wbso?   No';
}

@observer
export default class EntryWBSO extends Component {
    static propTypes = {
        entry: PropTypes.instanceOf(Entry).isRequired,
        allowEdit: PropTypes.bool,
    };

    handleClick = () => {
        if (this.props.allowEdit) {
            this.props.entry.wbso = !this.props.entry.wbso;
            this.props.entry.save();
        }
    };

    render() {
        const { entry, allowEdit } = this.props;
        return (
            <EntryItemDescription
                onClick={this.handleClick}
                allowEdit={allowEdit}
            >
                {getStringValue(entry.wbso)}
            </EntryItemDescription>
        );
    }
}
