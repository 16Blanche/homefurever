import React, { useEffect, useState, useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
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
    const { logout } = useContext(AuthContext);

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

    const handleLogout = async () => {
        await logout();
        navigate('/login'); 
    };

    const isNearbyServicesVisible = user && user.role === 'super-admin';

    return (
        <div>
            <Navbar className="navbar">
                <Image src={TheLogo} className="logo" />
                <Container className="navcontainer">
                    <Navbar.Brand className="navtitle"></Navbar.Brand>
                    <div className={`navcontainer1 ${!isNearbyServicesVisible ? 'shift-right' : ''}`}>
                    <div className="navlink-container">
                        <NavLink to="/home" className="navlink">Home</NavLink>
                    </div>
                    <div className="navlink-container">
                        <NavLink to="/admin/aboutus" className="navlink">About Us</NavLink>
                    </div>
                    {user && user.role === 'super-admin' && ( 
                        <div className="navlink-container">
                            <NavLink to="/nearby-services" className="navlink">Nearby Services</NavLink>
                        </div>
                    )}
                    <div className="navlink-container">
                        <NavLink to="/chat" className="navlink">Messages</NavLink>
                    </div>

                    {/* Notifications Dropdown */}
                    <div className="navlink-container">
                        <Dropdown align="end">
                            <Dropdown.Toggle as={CustomToggle} id="notifications-dropdown">
                                Notifications
                            </Dropdown.Toggle>

                            <Dropdown.Menu className="notifications-menu">
                                <Dropdown.Header>Notifications</Dropdown.Header>
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
                    <Button className="navlink-signout" onClick={handleLogout}>
                            SIGN OUT
                    </Button>
                    <Nav className="me-auto">
                    </Nav>
                    </div>
                </Container>
            </Navbar>
        </div>
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
