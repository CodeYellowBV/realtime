import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';
import { TopMenu, TopMenuNav, TopMenuRight, TopMenuLink } from '../component/TopMenu';

@observer
export default class Header extends Component {
    static propTypes = {
        store: PropTypes.object.isRequired,
    };

    handleClickLogout = () => {
        this.props.store.performLogout();
    };

    renderLoggedIn() {
        const { store } = this.props;
        return (
            <div>
                <TopMenu>
                    <TopMenuNav>
                        <TopMenuLink to="/">Personal</TopMenuLink>
                        <TopMenuLink to="/users">Employees</TopMenuLink>
                        <TopMenuLink to="/projects">Projects</TopMenuLink>
                    </TopMenuNav>
                    <TopMenuRight>
                        {store.currentUser.fullName}
                        <button type="button" onClick={this.handleClickLogout}>Logout</button>
                    </TopMenuRight>
                </TopMenu>
            </div>
        );
    }

    render() {
        const { store } = this.props;
        return (
            <div>
                <h1>CY Time</h1>
                {store.isAuthenticated ? this.renderLoggedIn() : null}
            </div>
        );
    }
}
