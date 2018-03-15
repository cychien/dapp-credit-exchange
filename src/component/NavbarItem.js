import React, { Component } from 'react';
import PropTypes from 'prop-types';

class NavbarItem extends Component {
    handleClick = () => {
        this.props.clickHandler(this.props.name);
    }

    render() {
        return (
            <a className="navbar-item" href="#" onClick={this.handleClick}>
                {this.props.name}
            </a>
        );
    }
}

NavbarItem.propTypes = {
    name: PropTypes.string,
    clickHandler: PropTypes.func
}

export default NavbarItem;