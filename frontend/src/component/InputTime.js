import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import styled from 'styled-components';
import moment from 'moment';
import onClickOutside from 'react-onclickoutside';

const Container = styled.div`
    flex: 1;
    display: flex;
    position: relative;
`;

const StyledButton = styled.button`
    cursor: pointer;
    background: #fff;
    border: 0;
    outline: none;
    font-size: 18px;
    height: 40px;
    padding: 0 10px;

    ${props => (props.flex ? `
        flex: ${props.flex}
    ` : null)};

    ${props => (props.showOverlay ? `
        border-radius: 6px 6px 0 0;
        background: #eee;
    ` : `
        border-radius: 6px;
    `)};

    ${props => {
    if (!props.variation) {
        return null;
    }

    switch (props.variation) {
        case 'warning':
            return `color: #ec4849;`;
        default:
            return null;
    }
}};
`;

const Overlay = styled.div`
    background: white;
    border-top: 1px solid #999;
    border-radius: 0 0 6px 6px;
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

const StyledInput = styled.input`
    margin: 0 10px 10px;
    border: 1px solid #ccc;
    border-radius: 6px;
    text-align: center;
    font-size: 18px;
    height: 40px;
    outline: none;

    &::-webkit-clear-button {
        -webkit-appearance: none;
    }
`;

export default onClickOutside(
    @observer class InputTime extends Component {
        static propTypes = {
            onChange: PropTypes.func.isRequired,
            name: PropTypes.string.isRequired,
            value: PropTypes.object,
            disableClear: PropTypes.bool,
        };

        static defaultProps = {
            value: null,
            disableClear: false,
        };

        @observable showOverlay = false;
        @observable shouldFocusTime = false;

        @observable date = moment().format('YYYY-MM-DD');
        @observable time = moment().format('HH:mm');

        toggleOverlay = () => {
            const showOverlay = !this.showOverlay;
            this.showOverlay = showOverlay;
            this.shouldFocusTime = showOverlay;
        };

        changeValue = () => {
            const datetime = moment(`${this.date} ${this.time}`);
            this.props.onChange(this.props.name, datetime);
        };

        handleChangeDate = value => {
            this.date = value;
            this.changeValue();
        };

        handleChangeTime = value => {
            this.time = value;
            this.changeValue();
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

        handleButtonClick = () => {
            const now = moment();

            this.handleChangeDate(now.format('YYYY-MM-DD'));
            this.handleChangeTime(now.format('HH:mm'));
        };

        renderClear() {
            if (this.props.disableClear) {
                return null;
            }

            return (
                <StyledButton
                    type="button"
                    variation="warning"
                    onClick={() => {
                        this.changeValue(null);
                    }}
                >
                    Clear
                </StyledButton>
            );
        }

        render() {
            const now = moment();
            return (
                <Container>
                    <StyledButton
                        type="button"
                        flex={1}
                        onClick={this.toggleOverlay}
                        showOverlay={this.showOverlay}
                    >
                        {this.props.value
                            ? this.props.value.format('H:mm')
                            : '—'}
                    </StyledButton>
                    <Overlay hide={!this.showOverlay}>
                        <ActionContainer>
                            <StyledButton
                                type="button"
                                onClick={this.handleButtonClick}
                            >
                                Now
                            </StyledButton>
                            {this.renderClear()}
                        </ActionContainer>
                        <StyledInput
                            innerRef={input => {
                                this.inputTime = input;
                            }}
                            type="time"
                            name={this.props.name}
                            value={
                                this.props.value
                                    ? this.props.value.format('HH:mm')
                                    : this.time
                            }
                            onChange={e => {
                                this.handleChangeTime(e.target.value);
                            }}
                        />
                        <StyledInput
                            type="date"
                            max={now.format('YYYY-MM-DD')}
                            onChange={e => {
                                this.handleChangeDate(e.target.value);
                            }}
                            value={
                                this.props.value
                                    ? this.props.value.format('YYYY-MM-DD')
                                    : this.date
                            }
                        />
                    </Overlay>
                </Container>
            );
        }
    }
);
