import { Link, redirect, useNavigate, useParams } from "react-router-dom";
import React, { useContext } from 'react';
import Button from 'react-bootstrap/Button';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import Image from 'react-bootstrap/Image';
import TheImage from './assets/mainbg.png';
import TheLogo from './assets/logo.png';
import HomeImg from './assets/home.png';
import PetList from './assets/petlist.png';
import UserList from './assets/userlist.png';
import PendingUsers from './assets/pendingusers.png';
import Staff from './assets/staffimg.png';
import Feedbacks from './assets/feedbacks.png';
import MyPosts from './assets/myposts.png';
import Events from './assets/eventsicon.png';
import AnimalPopulation from './assets/animalpopulation.png';
import AuthContext from '../../context/AuthContext';
import './Homepage.css';

const TaskBar = () => {
    const navigate = useNavigate();
    const { logout, user } = useContext(AuthContext); // Get user from AuthContext

    const handleNavigation = (path) => {
        navigate(path);
    };
    console.log('Logged in user:', user);
    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <>
            <div className="taskbar">
                <div className="adminempty">
                    <Image require src={TheLogo} className="tblogo"></Image>
                    <h1 className="tbadmin">Admin</h1>
                </div>

                <div className="buttonbox">
                    <Button className="button" onClick={() => handleNavigation('/home')}>
                        <Image require src={HomeImg} className="tbicon"></Image>
                        <p className="tbbtntext">Home</p>
                    </Button>
                </div>

                <div className="buttonbox">
                    <Button className="button" onClick={() => handleNavigation('/pet/all')}>
                        <Image require src={PetList} className="tbicon"></Image>
                        <p className="tbbtntext">Pet List</p>
                    </Button>
                </div>

                {user && user.role === 'super-admin' && (
                    <div className="buttonbox">
                        <Button className="button" onClick={() => handleNavigation('/user/all')}>
                            <Image require src={UserList} className="tbicon"></Image>
                            <p className="tbbtntext">User List</p>
                        </Button>
                    </div>
                )}

                {user && user.role === 'super-admin' && (
                    <div className="buttonbox">
                        <Button className="button" onClick={() => handleNavigation('/staff')}>
                            <Image require src={Staff} className="tbicon"></Image>
                            <p className="tbbtntext">Staff</p>
                        </Button>
                    </div>
                )}

                <div className="buttonbox">
                    <Button className="button" onClick={() => handleNavigation('/adoptions')}>
                        <Image require src={Feedbacks} className="tbicon"></Image>
                        <p className="tbbtntext">Adoptions</p>
                    </Button>
                </div>

                <div className="buttonbox">
                    <Button className="button" onClick={() => handleNavigation('/events')}>
                        <Image require src={Events} className="tbicon"></Image>
                        <p className="tbbtntext">Events</p>
                    </Button>
                </div>

                <div className="buttonbox">
                    <Button className="button" onClick={() => handleNavigation('/barangay/table')}>
                        <Image require src={AnimalPopulation} className="tbicon"></Image>
                        <p className="tbbtntext">Animal Record</p>
                    </Button>
                </div>

            </div>
        </>
    );
};

export default TaskBar;
