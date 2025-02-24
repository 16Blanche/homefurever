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

const NavigationBar = () => {
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);

    const notifications = [
        {
            id: 1,
            userImg: UserPh,
            text: "Elicah Janica sent you a message.",
            time: "1h"
        },
        {
            id: 2,
            userImg: UserPh,
            text: "Bella Yves posted a feedback.",
            time: "2h"
        },
        {
            id: 3,
            userImg: UserPh,
            text: "Kween Erza submitted an application.",
            time: "5h"
        },

    ];

    // const handleHome = () => {
    //     console.log('User:', user); // Debugging output
    //     if (user) {
    //         console.log('Navigating to Home');
    //         navigate('/home');
    //     } else {
    //         console.log('Navigating to Login');
    //         navigate('/login');
    //     }
    // 
    // };
    

    return (
        <>
            <Navbar className="pinknavbar">
                <Image src={TheLogo} className="logo" />
                <Container className="navcontainer">
                    <Navbar.Brand className="navtitle"></Navbar.Brand>
                    <div className="navlink-container">
                        <NavLink to="/home" className="pinknavlink">Home</NavLink>
                    </div>
                    <div className="navlink-container">
                        <NavLink to="/admin/aboutus" className="pinknavlink">About Us</NavLink>
                    </div>
                    <div className="navlink-container">
                        <NavLink to="/nearby-services" className="pinknavlink">Nearby Services</NavLink>
                    </div>
                    <div className="navlink-container">
                        <NavLink to="/chat" className="pinknavlink">Messages</NavLink>
                    </div>

                    {/* Notifications Dropdown */}
                    <div className="navlink-container">
                        <Dropdown align="end" className="pinknavlink">
                            <Dropdown.Toggle as={CustomToggle} id="notifications-dropdown" >
                                Notifications
                            </Dropdown.Toggle>

                            <Dropdown.Menu className="notifications-menu">
                                <Dropdown.Header >Notifications</Dropdown.Header>
                                {notifications.map(notification => (
                                    <Dropdown.Item key={notification.id} className="notification-item">
                                        <div className="notification-content">
                                            <Image src={notification.userImg} roundedCircle className="notification-img" />
                                            <div className="notification-text">
                                                <span>{notification.text}</span>
                                                <small className="text-muted">{notification.time}</small>
                                            </div>
                                        </div>
                                    </Dropdown.Item>
                                ))}
                                {notifications.length === 0 && (
                                    <Dropdown.Item disabled>No notifications</Dropdown.Item>
                                )}
                                <Dropdown.Item className="see-all">See previous notifications</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </div>

                    {/* <div className="navlink-container">
                        <NavLink to="/admin/account" className="navlink">Account</NavLink>
                    </div> */}
                    <Nav className="me-auto">
                    </Nav>
                </Container>
            </Navbar>
        </>
    );
}

const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
    <a
        href=""
        ref={ref}
        onClick={(e) => {
            e.preventDefault();
            onClick(e);
        }}
        className="custom-dropdown-toggle"
    >
        {children}
    </a>
));

export default NavigationBar;
