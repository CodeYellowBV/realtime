import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';
import styled from 'styled-components';

const StyledInput = styled.input`
    flex: 1;
`;

@observer
export default class InputText extends Component {
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
            <StyledInput
                name={this.props.name}
                value={this.props.value}
                onChange={this.handleChange}
            />
        );
    }
}
