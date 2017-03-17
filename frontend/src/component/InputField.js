import React, { PropTypes } from 'react';
import { PropTypes as MobxTypes } from 'mobx-react';

const InputField = ({ value, name, type, label, onChange, errors }) => {
    // TODO: Maybe just generate a random id with `_.uniqueId()`?
    const id = `inputfield-${name}`;
    return (
        <div>
            <label htmlFor={id}>{label}</label>
            <input
                type={type}
                id={id}
                name={name}
                value={value}
                onChange={e => onChange(e.target.name, e.target.value)}
            />
            {errors.join(', ')}
        </div>
    );
};

InputField.propTypes = {
    label: PropTypes.string.isRequired,
    value: PropTypes.string,
    name: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    errors: MobxTypes.arrayOrObservableArray,
};

InputField.defaultProps = {
    type: 'text',
    value: '',
    errors: [],
};

export default InputField;
