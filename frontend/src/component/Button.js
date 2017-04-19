import PropTypes from 'prop-types';
import React from 'react';

const Button = ({ children, disabled, onClick }) => (
    <button type="button" onClick={onClick} disabled={disabled}>
        {children}
    </button>
);

Button.propTypes = {
    children: PropTypes.node,
    disabled: PropTypes.bool,
    onClick: PropTypes.func,
};

export default Button;
