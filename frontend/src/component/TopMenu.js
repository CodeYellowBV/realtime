import React from 'react';
import styled from 'styled-components';
import Link from './Link';

export const TopMenu = styled.div`
    width: 100%;
    display: flex;
    margin-bottom: 1em;
    justify-content: space-between;
    align-items: center;
    flex: 1;
`;

export const TopMenuNav = styled.nav`
    display: flex;
`;

export const TopMenuRight = styled.div`
    display: flex;
`;

export const TopMenuLink = styled(Link)`
    color: black;
    display: block;
    padding: .9em .9em 0 0;
`;

export const TopMenuAvatar = styled.img`
    width: 50px;
    height: 50px;
    border-radius: 50%;
`;
