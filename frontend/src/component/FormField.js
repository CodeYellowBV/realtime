import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';
import styled from 'styled-components';

const StyledField = styled.div`
    display: flex;
    flex-flow: column wrap;
`;

@observer
export default class FormField extends Component {
    static propTypes = {
        label: PropTypes.string.isRequired,
        children: PropTypes.node.isRequired,
        className: PropTypes.string,
    };

    render() {
        return (
            <StyledField className={this.props.className}>
                <label>{this.props.label}</label>
                {this.props.children}
            </StyledField>
        );
    }
}
