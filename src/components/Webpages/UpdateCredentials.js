import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import Image from 'react-bootstrap/Image';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import StartNavBar from './StartNavBar';
import LogoImg from "./assets/logo.png";
import config from '../config';

const UpdateCredentials = () => {
    const navigate = useNavigate();
    const [newUsername, setNewUsername] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [reEnterPassword, setReEnterPassword] = useState('');
    const [error, setError] = useState('');
    const [validationErrors, setValidationErrors] = useState({});
    const [showModal, setShowModal] = useState(false); // State to control the modal visibility

    const validateForm = () => {
        const errors = {};

        if (!newUsername) {
            errors.newUsername = 'Username is required';
        } else if (newUsername.length < 3) {
            errors.newUsername = 'Username must be at least 3 characters';
        }

        if (!newPassword) {
            errors.newPassword = 'Password is required';
        } else if (newPassword.length < 6) {
            errors.newPassword = 'Password must be at least 6 characters';
        }

        if (!reEnterPassword) {
            errors.reEnterPassword = 'Please re-enter the password';
        } else if (newPassword !== reEnterPassword) {
            errors.reEnterPassword = 'Passwords do not match';
        }

        return errors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const errors = validateForm();
        if (Object.keys(errors).length > 0) {
            setValidationErrors(errors);
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const decodedToken = jwtDecode(token); // Decode the token to get the user ID
            const userId = decodedToken.id;

            await axios.patch(`${config.address}/api/admin/update-credentials/${userId}`, {
                newUsername,
                newPassword
            });

            // Show success modal after successful update
            setShowModal(true);
        } catch (err) {
            console.error(err);
            setError('Error updating credentials');
        }
    };

    // Handle closing the modal and redirect to login
    const handleCloseModal = () => {
        setShowModal(false);
        navigate('/login');
    };

    return (
        <>
            <div className="mainupdatebox">
                <div className="navbox">
                    <StartNavBar />
                    <div className="updatebox1">
                        <div className="updatebox2">
                            <Image className="updatelogo" src={LogoImg}></Image>
                            <h2 className="updatetxt">Update Credentials</h2>
                            <form onSubmit={handleSubmit}>
                                <p className="updatetitle">New Username</p>
                                <input
                                    type="text"
                                    className="updateinput"
                                    placeholder="Enter your new username"
                                    value={newUsername}
                                    onChange={(e) => setNewUsername(e.target.value)}
                                />
                                {validationErrors.newUsername && <p className="update-error-message">{validationErrors.newUsername}</p>}

                                <p className="updatetitle">New Password</p>
                                <input
                                    type="password"
                                    className="updateinput"
                                    placeholder="Enter your new password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                />
                                {validationErrors.newPassword && <p className="update-error-message">{validationErrors.newPassword}</p>}

                                <p className="updatetitle">Re-enter Password</p>
                                <input
                                    type="password"
                                    className="updateinput"
                                    placeholder="Re-enter your new password"
                                    value={reEnterPassword}
                                    onChange={(e) => setReEnterPassword(e.target.value)}
                                />
                                {validationErrors.reEnterPassword && <p className="update-error-message">{validationErrors.reEnterPassword}</p>}

                                {error && <p className="update-error-message">{error}</p>}

                                <button type="submit" className="updatebtn">Submit</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            {/* Success Modal */}
            <Modal show={showModal} onHide={handleCloseModal} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Success</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Your credentials have been successfully updated. You can now log in with your new username and password.
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={handleCloseModal}>
                        OK
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default UpdateCredentials;
