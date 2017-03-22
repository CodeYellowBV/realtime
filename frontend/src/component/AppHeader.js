import React from 'react';
import styled from 'styled-components';

const HeaderContainer = styled.div`
    width: 100%;
    display: flex;
`;

const Logo = styled.h1`
    margin-right: 1em;
`;

export default ({ children }) => {
    return (
        <HeaderContainer>
            <Logo>CY Time</Logo>
            {children}
        </HeaderContainer>
    );
};
