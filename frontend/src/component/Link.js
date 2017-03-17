import React, { PropTypes } from 'react';

function handleClick(e, to) {
    e.preventDefault();

    // TODO: Horrible hack...
    window.myRouter.setRoute(to);
}

const Link = ({ to, children }) => {
    return (
        <a href={to} onClick={e => handleClick(e, to)}>{children}</a>
    );
};

Link.propTypes = {
    to: PropTypes.string.isRequired,
    children: PropTypes.string.isRequired,
};

export default Link;
