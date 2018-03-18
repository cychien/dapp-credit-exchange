import React, { Component } from 'react';
import NavbarItem from './NavbarItem';
import PropTypes from 'prop-types';

class Navbar extends Component {
    handleClick = (navbarItemName) => {
        this.props.clickHandler(navbarItemName);
    }

    handleClickOnBurger = () => {
        document.getElementById('nav-menu').classList.toggle('is-active');
    }

    render() {
        return (
            <nav className="navbar is-light">
                <div className="navbar-brand">
                    <div className="navbar-item" href="#">
                        BANK
                    </div>
                    <div className="navbar-burger burger nav-toggle" onClick={this.handleClickOnBurger}>
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                </div>

                <div id="nav-menu" className="navbar-menu">
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