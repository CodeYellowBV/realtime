import Color from '../component/ColorPicker';
import PropTypes from 'prop-types';
import React from 'react';
import { observer } from 'mobx-react';
// import styled from 'styled-components';

@observer
export default class ColorPicker extends React.Component {
    static propTypes = {
        store: PropTypes.object.isRequired,
    };
    handleColorChange = color => {
        this.props.store.currentTheme.hex = color.hex;
    };
    render() {
        return <Color onChange={this.handleColorChange} />;
    }
}
