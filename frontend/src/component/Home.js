import React from 'react';
import Link from './Link';

export default () => {
    return (
        <p>
            Home is where the heart is haha.
            <Link to="/user/overview">User overview</Link>
        </p>
    );
};
