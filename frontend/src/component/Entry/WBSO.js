import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { Entry } from 'store/Entry';
import { EntryItemWBSO,EntryItemWBSOText } from 'component/EntryList';
@observer
export default class EntryWBSO extends Component {
    static propTypes = {
        entry: PropTypes.instanceOf(Entry).isRequired,
        allowEdit: PropTypes.bool,
    };

    handleChange = () => {
        if(this.props.allowEdit){
            this.props.entry.wbso = !this.props.entry.wbso;
            this.props.entry.save();
        }
    };

    render() {
        const { entry, allowEdit } = this.props;
        return (
            <EntryItemWBSO>
                <input type="checkbox" checked={this.props.entry.wbso} onChange={this.handleChange} />
                <EntryItemWBSOText>wbso</EntryItemWBSOText>
            </EntryItemWBSO>
        );
    }
}
