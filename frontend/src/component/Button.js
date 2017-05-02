import PropTypes from 'prop-types';
import React from 'react';
import { DEFAULT_FONT } from '../styles';
import styled from 'styled-components';

const StyledButton = styled.button`
    ${DEFAULT_FONT}
`;

const Button = props => (
    <StyledButton type="button" {...props}>
        {props.children}
    </StyledButton>
);

Button.propTypes = {
    children: PropTypes.node,
    disabled: PropTypes.bool,
    onClick: PropTypes.func,
};

export default Button;
