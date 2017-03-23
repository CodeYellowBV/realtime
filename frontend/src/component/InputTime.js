import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';
import MaskedInput from 'react-text-mask';

@observer
export default class InputTime extends Component {
    static propTypes = {
        onChange: PropTypes.func.isRequired,
        name: PropTypes.string.isRequired,
        value: PropTypes.string,
    };

    static defaultProps = {
        value: '',
    };

    handleChange = e => {
        this.props.onChange(this.props.name, e.target.value);
    };

    render() {
        return (
            <MaskedInput
                mask={[/\d/, /\d/, ':', /\d/, /\d/]}
                name={this.props.name}
                value={this.props.value}
                onChange={this.handleChange}
            />
        );
    }
}
