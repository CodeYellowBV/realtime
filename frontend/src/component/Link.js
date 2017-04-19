import page from 'page';
import PropTypes from 'prop-types';
import React, { Component } from 'react';

export default class Link extends Component {
    static propTypes = {
        to: PropTypes.string.isRequired,
        children: PropTypes.string.isRequired,
        className: PropTypes.string,
    };

    handleClick = (e) => {
        e.preventDefault();

        page(this.props.to);
    };

    render() {
        return (
            <a href={this.props.to} onClick={this.handleClick} className={this.props.className}>
                {this.props.children}
            </a>
        );
    }
}
