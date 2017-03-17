import React, { PropTypes } from 'react';
import { observer } from 'mobx-react';

function renderLoggedIn(store) {
    return (
        <span>
            {store.currentUser.fullName}
            <button type="button" onClick={() => store.performLogout()}>Logout</button>
        </span>
    );
}

const Header = observer(({ store }) => {
    return (
        <h1>CY Time - {store.isAuthenticated ? renderLoggedIn(store) : 'not logged in' }</h1>
    );
});

Header.propTypes = {
    store: PropTypes.object,
};

export default Header;
