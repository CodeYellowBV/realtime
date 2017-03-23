import React, { Component, PropTypes } from 'react';
import { observer, PropTypes as MobxTypes } from 'mobx-react';

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

    handleChange = e => {
        this.props.onChange(this.props.name, e.target.value);
    };

    renderOption(option) {
        return <option value={option.value} key={option.value}>{option.name}</option>;
    }

    render() {
        return (
            <select value={this.props.value} onChange={this.handleChange}>
                <option value="">{this.props.placeholder}</option>
                {this.props.options.map(this.renderOption)}
            </select>
        );
    }
}
