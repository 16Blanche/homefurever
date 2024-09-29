import { Link, NavLink, useNavigate, useParams } from "react-router-dom";
import React, { useEffect, useState, useContext } from "react";
import Button from 'react-bootstrap/Button';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import Image from 'react-bootstrap/Image';
import TheImage from './assets/mainbg.png'
import './Homepage.css';
import TheLogo from './assets/logo.png'

import AuthContext from '../../context/AuthContext';

const NavigationBar=()=>{
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);

    const handleHome = () => {
        if (user) {
          navigate('/home');
        } else {
          navigate('/login');
        }
      };
    return (
        <>
            <Navbar className="navbar">
            <Image require src={TheLogo} className="logo"></Image>
                <Container className="navcontainer">
                    <Navbar.Brand className="navtitle"></Navbar.Brand>
                    <div className="navlink-container">
                    <NavLink onClick={handleHome} className="navlink">Home</NavLink>
                    </div>
                    <div className="navlink-container">
                    <NavLink to="/aboutus" className="navlink">About Us</NavLink>
                    </div>
                    <div className="navlink-container">
                    <NavLink to="/nearbyservices" className="navlink">Nearby Services</NavLink>
                    </div>
                    <div className="navlink-container">
                    <NavLink to="/chat" className="navlink">Messages</NavLink>
                    </div>
                    <div className="pnavlink-container">
                    <NavLink to="/notifications" className="navlink">Notifications</NavLink>
                    </div>
                    <div className="navlink-container">
                    <NavLink to="/account" className="navlink">Account</NavLink>
                    </div>
                    <Nav className="me-auto">
                    </Nav>
                </Container>
            </Navbar>
        </>
    )
}

export default NavigationBar;
