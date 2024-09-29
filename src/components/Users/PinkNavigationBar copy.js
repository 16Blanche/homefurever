import { Link, NavLink, useNavigate, useParams } from "react-router-dom";
import React from "react";
import Button from 'react-bootstrap/Button';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import Image from 'react-bootstrap/Image';
import TheImage from './assets/mainbg.png'
import './Users.css';
import TheLogo from './assets/logo.png'
import Dropdown from 'react-bootstrap/Dropdown';
import UserPh from './assets/userph.jpg';

const PinkNavigationBar=()=>{

    const notifications = [
        {
            id: 1,
            userImg: UserPh,
            text: "Pasay Animal Shelter sent you a message.",
            time: "1h"
        }

    ];

    return (
        <>
            <Navbar className="pnavbar">
            <Image require src={TheLogo} className="plogo"></Image>
                <Container className="pnavcontainer">
                    <Navbar.Brand className="pnavtitle"></Navbar.Brand>
                    <div className="pnavlink-container">
                    <NavLink to="/browse/pets" className="pnavlink">Home</NavLink>
                    </div>
                    <div className="pnavlink-container">
                        <NavLink to="/aboutus" className="pnavlink">About Us</NavLink>
                    </div>
                    <div className="pnavlink-container">
                        <NavLink to="/nearbyservices" className="pnavlink">Nearby Services</NavLink>
                    </div>
                    <div className="pnavlink-container">
                        <NavLink to="/message" className="pnavlink">Messages</NavLink>
                    </div>

                    {/* Notifications Dropdown */}
                    <div className="pnavlink-container">
                        <Dropdown align="end">
                            <Dropdown.Toggle as={CustomToggle} id="pnotifications-dropdown" >
                                <p className="pnotifheader">Notifications</p>
                            </Dropdown.Toggle>

                            <Dropdown.Menu className="pnotifications-menu">
                                <Dropdown.Header>Notifications</Dropdown.Header>
                                {notifications.map(notification => (
                                    <Dropdown.Item key={notification.id} className="pnotification-item">
                                        <div className="pnotification-content">
                                            <Image src={notification.userImg} roundedCircle className="pnotification-img" />
                                            <div className="pnotification-text">
                                                <span>{notification.text}</span>
                                                <small className="ptext-muted">{notification.time}</small>
                                            </div>
                                        </div>
                                    </Dropdown.Item>
                                ))}
                                {notifications.length === 0 && (
                                    <Dropdown.Item disabled>No notifications</Dropdown.Item>
                                )}
                                <Dropdown.Item className="psee-all">See previous notifications</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </div>

                    <div className="pnavlink-container">
                        <NavLink to="/account" className="pnavlink">Account</NavLink>
                    </div>
                    <Nav className="me-auto">
                    </Nav>
                </Container>
            </Navbar>
        </>
    )
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

export default PinkNavigationBar;
