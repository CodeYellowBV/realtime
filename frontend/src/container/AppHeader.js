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
import Flex from '../component/Flex';
import ColorPicker from '../container/ColorPicker';
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
        const color = this.props.store.currentTheme.hex;

        return (
            <TopMenuNav color={color}>
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
            <Flex direction="column">
                <TopMenu>
                    <TopMenuLogo>CY Time</TopMenuLogo>
                    {this.renderNavigation()}
                    {this.renderAccount()}
                </TopMenu>
                <ColorPicker store={this.props.store} />
            </Flex>
        );
    }
}
