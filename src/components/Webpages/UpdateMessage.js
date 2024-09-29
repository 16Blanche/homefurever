import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; // Assuming jwtDecode is properly imported
import Button from 'react-bootstrap/Button';
import StartNavBar from './StartNavBar';

const UpdateMessage = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');

    useEffect(() => {
        // Get token from local storage and decode it to get the username
        const token = localStorage.getItem('token');
        if (token) {
            const decodedToken = jwtDecode(token);
            setUsername(decodedToken.username); // Assuming the token contains 'username'
        }
    }, []);

    // Function to handle the "Next" button click and redirect to the update credentials page
    const handleNext = () => {
        navigate('/update-credentials');
    };

    return (
        <>
            <div className="mainupdatemsgbox">
                <div className="navbox">
                    <StartNavBar />
                    <div className="updatemsgbox1">
                        <div className="updatemsgbox2">
                            <h2 className='updatemsgtitle'>Welcome, {username}!</h2>
                            <p className='updatemsgtxt'>To ensure your account is secure, please update your credentials before continuing.</p>
                            <Button className='updatemsgbtn' onClick={handleNext} variant="primary">Next</Button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default UpdateMessage;
