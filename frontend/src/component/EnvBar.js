import styled from 'styled-components';
import { COLOR_TINT, mobile } from '../styles';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ProjectStore } from 'store/Project';
import { UserStore } from 'store/User';
import { Entry } from 'store/Entry';
import { isStaging } from '../styles.js';

export const EnvBar = styled.div`
    height: 25px;
    display: flex;
    justify-content: space-between;
    align-items: stretch;
    background: #ff4;
    padding: 0 16px;
    position: relative;

    &:hover > div {
        display: flex;
    }

    ${mobile`
        height: 70px;
        flex-direction: column;
        align-items: center;
    `}
`;

export const EnvBarStyle = styled.div`
    display: flex;
    justify-content: space-between;
    margin-left: 8px;
`;

export class EnvBarEnvironment extends Component {

    render(){
        const environment = process.env.NODE_ENV;
        return (
            <EnvBarStyle>
                environment={environment}
            </EnvBarStyle>
        );
    }
}

export class EnvBarClientId extends Component {

    render(){
        const clientId = process.env.CY_FRONTEND_PHABRICATOR_CLIENT_ID;
        return (
            <EnvBarStyle>
                phabricator client id ={clientId}
            </EnvBarStyle>
        );
    }
}

export class EnvBarStaging extends Component {

    render(){
        let staging = isStaging();
        if(staging){
            staging = 'true';
        }
        else {
            staging = 'false';
        }
        return (
            <EnvBarStyle>
                staging={staging}
            </EnvBarStyle>
        );
    }
}