import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { TopMenu, TopMenuNav, TopMenuRight, TopMenuAvatar, TopMenuLink } from '../component/TopMenu';
import AppHeader from '../component/AppHeader';

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
            <TopMenu>
                <TopMenuNav>
                    <TopMenuLink to="/">Personal</TopMenuLink>
                    <TopMenuLink to="/users">Employees</TopMenuLink>
                    <TopMenuLink to="/projects">Projects</TopMenuLink>
                </TopMenuNav>
                <TopMenuRight>
                    {store.currentUser.displayName}
                    <TopMenuAvatar src={store.currentUser.avatarUrl} />
                    <button type="button" onClick={this.handleClickLogout}>Logout</button>
                </TopMenuRight>
            </TopMenu>
        );
    }

    render() {
        const { store } = this.props;
        return (
            <AppHeader>
                {store.isAuthenticated ? this.renderLoggedIn() : null}
            </AppHeader>
        );
    }
}
