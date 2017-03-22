import React, { Component, PropTypes } from 'react';

export default class Link extends Component {
    static propTypes = {
        to: PropTypes.string.isRequired,
        children: PropTypes.string.isRequired,
        className: PropTypes.string,
    };

    static contextTypes = {
        router: PropTypes.object.isRequired,
    };

    handleClick = (e) => {
        e.preventDefault();

        this.context.router.setRoute(this.props.to);
    };

    render() {
        return (
            <a href={this.props.to} onClick={this.handleClick} className={this.props.className}>
                {this.props.children}
            </a>
        );
    }
}
