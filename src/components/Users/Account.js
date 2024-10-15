import React, { useEffect, useState, useContext } from "react";
import { Container, Row, Col, Button, Image } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom'; 
import PinkNavigationBar from "./PinkNavigationBar";
import axios from 'axios';
import AuthContext from '../../context/AuthContext'; 
import "./Users.css";
import config from '../config';

const Account = () => {
    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { logout } = useContext(AuthContext); 
    const navigate = useNavigate(); 

    useEffect(() => {
        const fetchUserProfile = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                console.error('No access token found.');
                setLoading(false);
                return;
            }
        
            try {
                const response = await axios.get(`${config.address}/api/user/profile`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,  
                        'Content-Type': 'application/json'
                    }
                });
        
                setProfileData(response.data.user);
            } catch (error) {
                if (error.response) {
                    console.error('Failed to fetch profile:', error.response.data.message || error.response.statusText);
                    setError(error.response.data.message || 'Failed to fetch profile');
                } else if (error.request) {
                    console.error('Error fetching profile:', error.request);
                    setError('No response received');
                } else {
                    console.error('Error fetching profile:', error.message);
                    setError('Error fetching profile');
                }
            } finally {
                setLoading(false);
            }
        };
    
        fetchUserProfile();
    }, []);

    const handleSignOut = async () => {
        console.log('Logging out...');
        logout();
        console.log('Redirecting to login...');
        navigate('/login');
    };
    
    const handleTracker = async () => {
        navigate('/adoption/tracker');
    };
    
    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;
    if (!profileData) return <p>No profile data available</p>;

    return (
        <div className="box">
            <div className="navbox">
                <PinkNavigationBar />
            </div>
            <div className="accbox">
                <div className="accwbox">
                    <div className="accbox1">
                        {/* <h1>Profile</h1> */}
                        <div className="profile-header">
                            <Image 
                                src={profileData.profileImage ? `${config.address}${profileData.profileImage}` : 'fallback-image-url'} 
                                roundedCircle 
                                className="account-profile-image" 
                            />
                            <div className="profile-info">
                                <h1>{profileData.username}</h1>
                            </div>
                        </div>
                            <Button onClick={handleTracker} className="accmabtn">MY ADOPTIONS</Button>

                    </div>
                    <div className="accbox2">
                    <div className="basic-info">
                            <h2>User Information</h2>
                            <div className="basic-info-content">
                                <h2>{`${profileData.firstName} ${profileData.lastName}`}</h2>
                                <p>Full Name</p>
                                <h2>{profileData.birthday}</h2>
                                <p>Birthday</p>
                                <h2>{profileData.gender}</h2>
                                <p>Gender</p>
                                <h2>{profileData.address}</h2>
                                <p>Address</p>
                            </div>
                        </div>
                        <div className="basic-info">
                            <h2>Contact Information</h2>
                            <div className="basic-info-content">                            
                                <h2>{profileData.contactNumber}</h2>
                                <p>Mobile</p>
                                <h2>{profileData.email}</h2>
                                <p>Email</p>
                            </div>
                        </div>
                        <div className="accsout">
                            <Button variant="pink" className="accsobtn" onClick={handleSignOut}>Sign Out</Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Account;
