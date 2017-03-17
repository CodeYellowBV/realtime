import React, { PropTypes } from 'react';

const Form = ({ children, onSubmit }) => (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }}>
        {children}
    </form>
);

Form.propTypes = {
    children: PropTypes.node,
    onSubmit: PropTypes.func.isRequired,
};

export default Form;
