import './Users.css';
import { Link, NavLink, useNavigate, useParams } from "react-router-dom";
import React, { useContext } from "react";
import Button from 'react-bootstrap/Button';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import Image from 'react-bootstrap/Image';
import TheImage from './assets/mainbg.png'
import TheLogo from './assets/logo.png'
import Dropdown from 'react-bootstrap/Dropdown';
import UserPh from './assets/userph.jpg';
import AuthContext from '../../context/AuthContext';

const PinkNavigationBar=()=>{
    const { user, loading, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const notifications = [
        {
            id: 1,
            userImg: UserPh,
            text: "Pasay Animal Shelter sent you a message.",
            time: "1h"
        }

    ];

    const handleAccountRedirect = () => navigate('/account');
    const handleLogout = () => {
        logout(); // Call logout function
        navigate('/'); // Redirect to the homepage or login after logging out
    };

    return (
        <div id="user-nav">
            <Navbar className="pinknavbar">
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
                                <NavLink to="/pet/events" className="pnavlink">Events</NavLink>
                            </div>

                            <div className="pnavlink-container">
                                <NavLink to="/nearbyservices" className="pnavlink">Nearby Services</NavLink>
                            </div>

                            <div className="pnavlink-container">
                                <NavLink to="/message" className="pnavlink">Messages</NavLink>
                            </div>

                            <div className="pnavlink-container">
                                <Dropdown align="end">
                                    <Dropdown.Toggle as={CustomToggle} id="pnotifications-dropdown">
                                        <p className="pnotifheader">Notifications</p>
                                    </Dropdown.Toggle>

                                    <Dropdown.Menu className="pnotifications-menu" style={{ marginTop: '.7rem' }}>
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
                        <Dropdown align="end">
                            <Dropdown.Toggle as={CustomToggle} id="account-dropdown">
                                <p className="pnotifheader">Account</p>
                            </Dropdown.Toggle>

                            <Dropdown.Menu style={{ marginTop: '.7rem' }}>
                                <Dropdown.Item onClick={handleAccountRedirect}>
                                    My Account
                                </Dropdown.Item>
                                <Dropdown.Divider />
                                <Dropdown.Item onClick={handleLogout}>
                                    Logout
                                </Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </div>
                    <Nav className="me-auto">
                    </Nav>
                </Container>
            </Navbar>
        </div>
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
