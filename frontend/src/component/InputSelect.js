import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer, PropTypes as MobxTypes } from 'mobx-react';
import Select from 'react-select';

@observer
export default class InputSelect extends Component {
    static propTypes = {
        onChange: PropTypes.func.isRequired,
        name: PropTypes.string.isRequired,
        options: MobxTypes.arrayOrObservableArray.isRequired,
        value: PropTypes.string,
        placeholder: PropTypes.string,
    };

    static defaultProps = {
        value: '',
    };

    handleChange = option => {
        this.props.onChange(this.props.name, option ? option.value : '');
    };

    renderOption(option) {
        return (
            <option value={option.value} key={option.value}>
                {option.name}
            </option>
        );
    }

    render() {
        return (
            <Select
                value={this.props.value}
                options={this.props.options}
                onChange={this.handleChange}
                placeholder={this.props.placeholder}
            />
        );
    }
}
