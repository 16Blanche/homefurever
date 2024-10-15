import React, { useEffect, useState, useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Image from 'react-bootstrap/Image';
import Dropdown from 'react-bootstrap/Dropdown';
import TheLogo from './assets/logo.png';
import UserPh from './assets/userph.jpg';
import './Homepage.css';

import AuthContext from '../../context/AuthContext';

const StartNavBar = () => {
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);    

    return (
        <>
            <Navbar className="startnavbar">
                <Image src={TheLogo} className="startlogo" />
                <Navbar.Brand className="startnavtitle">E-Pet Adopt</Navbar.Brand>
                <div className="startspace"></div>
                <Container className="startnavcontainer">
                
                    <div className="startnavlink-container">
                        <NavLink to="/pets/browse" className="startnavlink">Browse</NavLink>
                    </div>
                    <div className="startnavlink-container">
                        <NavLink to="/about/us" className="startnavlink">About Us</NavLink>
                    </div>
                    <div className="startnavlink-container">
                        <NavLink to="/login" className="startnavlink">Login</NavLink>
                    </div>
                    <div className="startnavlink-container">
                        <NavLink to="/signup" className="startnavlink startsignup-btn">Sign Up</NavLink>
                    </div>

                    <Nav className="me-auto">
                    </Nav>
                </Container>
            </Navbar>
        </>
    );
}

export default StartNavBar;
