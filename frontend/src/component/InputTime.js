import React, { Component, PropTypes } from 'react';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import styled from 'styled-components';
import moment from 'moment';

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

    ${props => props.flex ? `
        flex: ${props.flex}
    ` : null};

    ${props => props.showOverlay ? `
        border-radius: 6px 6px 0 0;
        background: #eee;
    ` : `
        border-radius: 6px;
    `};

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
    border-top: 1px solid #ccc;
    border-radius: 0 0 6px 6px;
    display: flex;
    flex-direction: column;
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    ${props => props.hide ? `display: none;` : null};
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

@observer
export default class InputTime extends Component {
    static propTypes = {
        onChange: PropTypes.func.isRequired,
        name: PropTypes.string.isRequired,
        value: PropTypes.string,
    };

    static defaultProps = {
        value: '',
    };

    @observable showOverlay = false;
    @observable shouldFocusTime = false;

    toggleOverlay = () => {
        const showOverlay = !this.showOverlay;
        this.showOverlay = showOverlay;
        this.shouldFocusTime = showOverlay;
    };

    handleChange = value => {
        this.props.onChange(this.props.name, value);
    };

    componentDidUpdate() {
        if (this.shouldFocusTime) {
            this.inputTime.focus();
            this.shouldFocusTime = false;
        }
    }

    render() {
        return (
            <Container>
                <StyledButton flex={1} onClick={this.toggleOverlay} showOverlay={this.showOverlay}>
                    {this.props.value || '—'}
                </StyledButton>
                <Overlay hide={!this.showOverlay}>
                    <ActionContainer>
                        <StyledButton onClick={() => { this.handleChange(moment().format('HH:mm')); }}>Now</StyledButton>
                        <StyledButton variation="warning" onClick={() => { this.handleChange(null); }}>Clear</StyledButton>
                    </ActionContainer>
                    <StyledInput
                        innerRef={input => { this.inputTime = input; }}
                        type="time"
                        name={this.props.name}
                        value={this.props.value}
                        onChange={e => { this.handleChange(e.target.value); }}
                    />
                    {/* TODO: Add date selector. */}
                </Overlay>
            </Container>
        );
    }
}
