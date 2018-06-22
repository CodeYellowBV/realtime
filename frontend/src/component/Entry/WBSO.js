import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { observable } from 'mobx';
import { EntryItemWBSO } from 'component/EntryList';
import { Entry } from 'store/Entry';
import InputInteger from 'component/InputInteger';
import Form from '../Form';
import IconCheck from '../../image/icon-check.svg';
import IconNoCheck from '../../image/icon-no-check.svg';
import Icon from 'component/Icon';

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
        const hasWbso = this.props.entry.wbso;
        return (
            <EntryItemWBSO onClick={this.handleClick} allowEdit={allowEdit}>
                <Icon icon={hasWbso ? IconCheck : IconNoCheck}/>
            </EntryItemWBSO>
        );
    }
}
