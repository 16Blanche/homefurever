import React from 'react';
import { NavLink } from 'react-router-dom';
import { Navbar, Container, Image } from 'react-bootstrap';
import './Users.css';
import TheLogo from './assets/logo.png';

const LoggedOutNavbar = () => {
    return (
        <div id="user-nav">
        <Navbar className="pinknavbar">
            <Image src={TheLogo} className="plogo"/>
            <div style={{ width:'20%' }}></div>
            <Container className="pnavcontainer">

                <div className="pnavlink-container">
                    <NavLink to="/pets/browse" className="pnavlink">Browse</NavLink>
                </div>
                <div className="pnavlink-container">
                    <NavLink to="/about/us" className="pnavlink">About Us</NavLink>
                </div>
                <div className="pnavlink-container">
                    <NavLink to="/login" className="pnavlink">Log In</NavLink>
                </div>
                <div className="pnavlink-container">
                    <NavLink to="/signup" className="pnavlink">Sign Up</NavLink>
                </div>
            </Container>
        </Navbar>
        </div>
    );
};

export default LoggedOutNavbar;
