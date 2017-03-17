import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';

@observer
export default class InputText extends Component {
    static propTypes = {
        onChange: PropTypes.func.isRequired,
        name: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired,
        value: PropTypes.string,
    };

    static defaultProps = {
        value: '',
    };

    handleChange = (e) => {
        this.props.onChange(this.props.name, e.target.value);
    };

    render() {
        // TODO: Maybe just generate a random id with `_.uniqueId()`?
        const id = `inputfield-${name}`;
        return (
            <div>
                <label htmlFor={id}>{this.props.label}</label>
                <input
                    id={id}
                    name={this.props.name}
                    value={this.props.value}
                    onChange={this.handleChange}
                />
            </div>
        );
    }
}
