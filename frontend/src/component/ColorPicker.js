import { HuePicker } from 'react-color';
import PropTypes from 'prop-types';
import React from 'react';
import { observer } from 'mobx-react';
import styled from 'styled-components';

const HuePointer = styled.div`
    width: 6px;
    height: 10px;
    transform: translate(-3px, -2.5px);
    backgroundColor: rgb(248, 248, 248);
    boxShadow: 0 1px 4px 0 rgba(0, 0, 0, 0.37);
`;

@observer
export default class ColorPicker extends React.Component {
    static propTypes = {
        onChange: PropTypes.func.isRequired,
    };
    render() {
        return (
            <StyleWrapper>
                <HuePicker
                    onChange={this.props.onChange}
                    height="5px"
                    width="100%"
                    pointer={HuePointer}
                />
            </StyleWrapper>
        );
    }
}

const StyleWrapper = styled.div`
    display: flex;
    /* Bar style */
    .hue-picker > div {
        border-radius: 0 !important;
    }
`;
