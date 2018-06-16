import styled from 'styled-components';
import React, { Component } from 'react';
import PropTypes from 'prop-types';

export const UserFilter = styled.div`
    display: flex;
    width: 100%;
    flex-flow: row wrap;
    align-items: center;
    border-bottom: 1px solid #444;
    padding: 10px;
`;

export const UserFilterStyle = styled.div`
    display: flex;
    justify-content: space-between;
    margin-left: 8px;
    cursor: pointer;
`;

export class UserFilterChange extends Component {

	static propTypes = {
		overview: PropTypes.instanceOf(Object).isRequired,//can't import from another directory...
	}

	constructor(props){
		super(props);
		this.setShowAll(true);
	}

	render(){
		return (
			<UserFilterStyle onClick={this.handleClick}>
				{this.showAll ? 'Click to hide employees that no longer work here.' : 'Click to show all employees.'}
			</UserFilterStyle>
		);
	}

	setShowAll = newShowAll => {
		this.showAll = newShowAll;
		sessionStorage.setItem('UserFilter', newShowAll ? 'All' : 'Active');
		this.props.overview.forceUpdate();
	}

	handleClick = () => {
		this.setShowAll(!this.showAll);
		this.forceUpdate();
	}
}