import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer } from 'mobx-react';
import Button from 'component/Button';
import {
    TopMenu,
    TopMenuNav,
    TopMenuLink,
    TopMenuLogo,
} from 'component/TopMenu';
import {
    Account,
    AccountDisplay,
    AccountAvatar,
    AccountContent,
    AccountItem,
} from 'component/Account';
import {
    EnvBar,
    EnvBarEnvironment,
    EnvBarClientId,
    EnvBarStaging,
} from 'component/EnvBar';
import View from 'store/View';

@observer
export default class Header extends Component {
    static propTypes = {
        store: PropTypes.instanceOf(View).isRequired,
    };

    handleClickLogout = () => {
        this.props.store.performLogout();
    };

    // Workaround because mobx's @observer kills react-router updates.
    shouldComponentUpdate() {
        return true;
    }

    renderEnvBar() {
        if (!this.props.store.isAuthenticated) return null;
        return (
            <EnvBar>
                <EnvBarEnvironment></EnvBarEnvironment>
                <EnvBarStaging></EnvBarStaging>
                <EnvBarClientId></EnvBarClientId>
            </EnvBar>
        );
    }

    renderNavigation() {
        if (!this.props.store.isAuthenticated) return null;

        return (
            <TopMenuNav>
                <TopMenuLink activeClassName="selected" exact to="/">
                    My time
                </TopMenuLink>
                <TopMenuLink activeClassName="selected" to="/users">
                    Employees
                </TopMenuLink>
                <TopMenuLink activeClassName="selected" to="/projects">
                    Projects
                </TopMenuLink>
            </TopMenuNav>
        );
    }

    renderAccount() {
        const { store } = this.props;
        if (!this.props.store.isAuthenticated) return null;

        return (
            <Account>
                <AccountDisplay>
                    {store.currentUser.displayName}
                    <AccountAvatar src={store.currentUser.avatarUrl} />
                </AccountDisplay>
                <AccountContent>
                    <AccountItem>
                        <Button onClick={this.handleClickLogout}>Logout</Button>
                    </AccountItem>
                </AccountContent>
            </Account>
        );
    }

    render() {
        return (
            <TopMenu>
                <TopMenuLogo>Realtime</TopMenuLogo>
                {this.renderNavigation()}
                {this.renderEnvBar()}
                {this.renderAccount()}
            </TopMenu>
        );
    }
}
