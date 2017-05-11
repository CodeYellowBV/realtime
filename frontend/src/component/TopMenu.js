import styled from 'styled-components';
import { COLOR_TINT } from '../styles';
import { NavLink } from 'react-router-dom';

export const TopMenu = styled.div`
    height: 64px;
    display: flex;
    justify-content: space-between;
    align-items: stretch;
    background: #222;
    padding: 0 16px;
`;

export const TopMenuNav = styled.nav`
    flex: 1;
    display: flex;
    align-items: stretch;
    margin: 0 16px;
`;

export const TopMenuLink = styled(NavLink)`
    display: inline-flex;
    align-items: center;
    padding: 0 8px;
    margin: 0 4px;
    text-decoration: none;
    color: ${COLOR_TINT};

    &.selected {
        color: white;
    }
`;

export const TopMenuBlock = styled.div`
    display: flex;
    align-items: center;
`;

export const TopMenuAvatar = styled.img`
    width: 48px;
    height: 48px;
    border-radius: 50%;
    margin-left: 16px;
`;

export const TopMenuLogo = styled.div`
    font-size: 32px;
    display: inline-flex;
    align-items: center;
`;
