import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer } from 'mobx-react';
import styled from 'styled-components';
import moment from 'moment';

const StyledInput = styled.div`
    width: 100%;
    height: ${props => (props.small ? '35' : '48')}px;
    border-radius: 8px;
    border: 0;
    padding: 0 8px;
`;

@observer
export default class InputSimpleTime extends Component {

	static propTypes = {
        onChange: PropTypes.func.isRequired,
        onBlur: PropTypes.func,
        name: PropTypes.string.isRequired,
        value: PropTypes.object,
        autoFocus: PropTypes.bool,
        small: PropTypes.bool,
    };

    static defaultProps = {
        value: '',
    };

    constructor(props){
    	super(props);
    	this.state = {tempValue: this.props.value.format('HH:mm')};
    	this.handleChange = this.handleChange.bind(this);
    }

    handleChange = e => {
    	if(e.target.value.length === 5 && new RegExp(/[0-2][0-9][:][0-5][0-9]/).test(e.target.value)){
    		const momDate = this.props.value.format('YYYY-MM-DD');
    		this.props.onChange(this.props.name, moment(`${momDate} ${e.target.value}`));

    	}
    	this.setState({tempValue: e.target.value});
    };

    componentDidMount(){
    	this.nameInput.focus();//maybe not the most beautiful fix, but does the job properly
  	};

    render() {
        return (
            <StyledInput
                small={this.props.small}
                name={this.props.name}
                onBlur={this.props.onBlur}
                autoFocus={this.props.autoFocus}
            ><input type="text" value={this.state.tempValue} ref={(input) => { this.nameInput = input; }} onChange={this.handleChange}></input></StyledInput>
        );
    }
}