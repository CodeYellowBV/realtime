import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer } from 'mobx-react';
import {
    TopMenu,
    TopMenuNav,
    TopMenuBlock,
    TopMenuAvatar,
    TopMenuLink,
    TopMenuLogo,
} from '../component/TopMenu';
import Button from '../component/Button';
import View from '../store/View';

@observer
export default class Header extends Component {
    static propTypes = {
        store: PropTypes.instanceOf(View).isRequired,
    };

    handleClickLogout = () => {
        this.props.store.performLogout();
    };

    renderNavigation() {
        if (!this.props.store.isAuthenticated) return null;

        return (
            <TopMenuNav>
                <TopMenuLink to="/">Personal</TopMenuLink>
                <TopMenuLink to="/users">Employees</TopMenuLink>
                <TopMenuLink to="/projects">Projects</TopMenuLink>
            </TopMenuNav>
        );
    }

    renderAccount() {
        const { store } = this.props;
        if (!this.props.store.isAuthenticated) return null;

        return (
            <TopMenuBlock onClick={this.handleClickLogout}>
                {store.currentUser.displayName}
                <TopMenuAvatar src={store.currentUser.avatarUrl} />
            </TopMenuBlock>
        );
    }

    render() {
        return (
            <TopMenu>
                <TopMenuLogo>Realtime</TopMenuLogo>
                {this.renderNavigation()}
                {this.renderAccount()}
            </TopMenu>
        );
    }
}
