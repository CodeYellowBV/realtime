import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import styled from 'styled-components';
import moment from 'moment';
import onClickOutside from 'react-onclickoutside';
import Datetime from 'react-datetime';
import Button from './Button';

const Container = styled.div`
    position: relative;
`;

export const InputTimeButton = styled(Button)`
    width: 100%;
    font-size: 20px;
    height: 48px;

    ${props => (props.flex ? `
        flex: ${props.flex}
    ` : null)};

    ${props => (props.showOverlay ? `
        border-radius: 8px 8px 0 0;
        background: #ddd;
    ` : `
        border-radius: 8px;
    `)};

    ${props => {
        if (!props.variation) return null;

        switch (props.variation) {
            case 'warning':
                return `color: #ec4849;`;
            default:
                return null;
        }
    }}
`;

const Overlay = styled.div`
    background: white;
    border-radius: 0 0 8px 8px;
    display: flex;
    flex-direction: column;
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    ${props => (props.hide ? `display: none;` : null)};
`;

const ActionContainer = styled.div`
    display: flex;
    justify-content: space-between;
`;

const StyledDatetime = styled(Datetime)`
    .rdtPicker {
        background: white;
        color: black;
        text-align: center;
    }

    .rdtSwitch,
    .rdtDay,
    .rdtBtn {
        cursor: pointer;
    }

    .rdtTime {
        table {
            width: 100%;
        }
    }

    .rdtCounters {
        display: flex;
        align-items: center;
        justify-content: center;
    }
`;

export default onClickOutside(
    @observer class InputTime extends Component {
        static propTypes = {
            onChange: PropTypes.func.isRequired,
            name: PropTypes.string.isRequired,
            value: PropTypes.object,
            disableClear: PropTypes.bool,
            disableNow: PropTypes.bool,
            showDash: PropTypes.bool,
        };

        static defaultProps = {
            value: null,
            disableClear: false,
            disableNow: false,
            showDash: false,
        };

        @observable showOverlay = false;
        @observable shouldFocusTime = false;

        toggleOverlay = () => {
            const showOverlay = !this.showOverlay;
            this.showOverlay = showOverlay;
            this.shouldFocusTime = showOverlay;
        };

        handleChange = value => {
            this.props.onChange(this.props.name, moment(value));
        };

        handleClickOutside() {
            this.showOverlay = false;
        }

        componentDidUpdate() {
            if (this.shouldFocusTime) {
                this.inputTime.focus();
                this.shouldFocusTime = false;
            }
        }

        handleReset = () => {
            this.props.onChange(this.props.name, null);
        };

        renderClear() {
            if (this.props.disableClear) {
                return null;
            }

            return (
                <InputTimeButton
                    type="button"
                    variation="warning"
                    onClick={this.handleReset}
                >
                    Clear
                </InputTimeButton>
            );
        }

        renderNow() {
            if (this.props.disableNow) {
                return null;
            }

            return (
                <InputTimeButton type="button" onClick={this.handleReset}>
                    Now
                </InputTimeButton>
            );
        }

        render() {
            return (
                <Container>
                    <InputTimeButton
                        type="button"
                        flex={1}
                        onClick={this.toggleOverlay}
                        showOverlay={this.showOverlay}
                    >
                        {this.props.value
                            ? this.props.value.format('H:mm')
                            : this.props.showDash ? '—' : 'Now'}
                    </InputTimeButton>
                    <Overlay hide={!this.showOverlay}>
                        <ActionContainer>
                            {this.renderNow()}
                            {this.renderClear()}
                        </ActionContainer>
                        <StyledDatetime
                            onChange={this.handleChange}
                            viewMode="time"
                            locale="nl"
                            open
                        />
                    </Overlay>
                </Container>
            );
        }
    }
);
