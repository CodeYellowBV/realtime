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
    handleColorChange(a, b, c) {
        console.log('handleColorChange', a, b, c);
    }
    render() {
        return <Color onChange={this.handleColorChange} />;
    }
}
