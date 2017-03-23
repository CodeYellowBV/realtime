import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';
import styled from 'styled-components';

const StyledInput = styled.input`
    flex: 1;

    ${props => props.disableCancel && `
        &::-webkit-clear-button {
          -webkit-appearance: none;
        }
    `}
`;

@observer
export default class InputTime extends Component {
    static propTypes = {
        onChange: PropTypes.func.isRequired,
        name: PropTypes.string.isRequired,
        value: PropTypes.string,
        disableCancel: PropTypes.bool,
    };

    static defaultProps = {
        value: '',
        disableCancel: false,
    };

    handleChange = e => {
        this.props.onChange(this.props.name, e.target.value);
    };

    render() {
        return (
            <StyledInput
                type="time"
                disableCancel={this.props.disableCancel}
                name={this.props.name}
                value={this.props.value}
                onChange={this.handleChange}
            />
        );
    }
}
