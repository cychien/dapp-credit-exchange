import React, { Component } from 'react';
import NavbarItem from './NavbarItem';
import PropTypes from 'prop-types';

class Navbar extends Component {
    handleClick = (navbarItemName) => {
        this.props.clickHandler(navbarItemName);
    }

    render() {
        return (
            <nav className="navbar is-transparent">
                <div className="navbar-brand">
                    <a className="navbar-item" href="#">
                        BANK
                    </a>
                    <div className="navbar-burger burger" data-target="navbarExampleTransparentExample">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                </div>

                <div className="navbar-menu">
                    <div className="navbar-start">
                        <NavbarItem name="填寫信用記錄" clickHandler={this.handleClick} />
                        <NavbarItem name="查詢信用記錄" clickHandler={this.handleClick} />
                    </div>
                </div>
            </nav>
        );
    }
}

Navbar.propTypes = {
    clickHandler: PropTypes.func
}

export default Navbar;