import React, { useEffect, useState, useContext } from "react";
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import Image from 'react-bootstrap/Image';
import PinkNavigationBar from "./PinkNavigationBar";
import './Users.css';
import AuthContext from '../../context/AuthContext';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { StarFill, Star } from 'react-bootstrap-icons';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import { Check, Close } from '@mui/icons-material';
import config from '../config';

const AdoptionTracker = () => {
    const [adoptions, setAdoptions] = useState([]);
    const [selectedAdoption, setSelectedAdoption] = useState(null);
    const [selectedPet, setSelectedPet] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [userProfileImage, setUserProfileImage] = useState(null);
    const [userProfile, setUserProfile] = useState(null);
    const [showFeedbackModal, setShowFeedbackModal] = useState(false);
    const [rating, setRating] = useState(0);
    const [feedbackText, setFeedbackText] = useState('');
    const [feedbackExists, setFeedbackExists] = useState(false);
    const [statusFilter, setStatusFilter] = useState('');
    const { user } = useContext(AuthContext);

    const steps = ['Submitted', 'Accepted', 'Adoption Complete'];

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
        
                setUserProfile(response.data.user);
                setUserProfileImage(response.data.user.profileImage ? `${config.address}${response.data.user.profileImage}` : null);
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
    
    useEffect(() => {
        const fetchAdoptions = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                console.error('No access token found.');
                setError('No access token found.');
                setLoading(false);
                return;
            }

            try {
                const response = await axios.get(`${config.address}/api/my/adoptions`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                const sortedAdoptions = response.data.sort((a, b) => new Date(b.a_submitted_at) - new Date(a.a_submitted_at));

                setAdoptions(sortedAdoptions);
                setLoading(false);

                if (sortedAdoptions.length > 0) {
                    const firstAdoptionId = sortedAdoptions[0]._id;
                    const firstPetId = sortedAdoptions[0].p_id._id;
                    await checkFeedbackExists(firstAdoptionId, firstPetId);
                }
            } catch (error) {
                if (error.response) {
                    setError(error.response.data.message || 'Failed to fetch adoptions');
                } else if (error.request) {
                    setError('No response received');
                } else {
                    setError('Error fetching adoptions');
                }
                setLoading(false);
            }
        };

        fetchAdoptions();
    }, []);

    const fetchPetById = async (petId) => {
        try {
            const response = await axios.get(`${config.address}/api/pet/${petId}`);
            setSelectedPet(response.data.thePet);
        } catch (error) {
            console.error('Error fetching pet:', error);
            setError('Failed to fetch pet details');
        }
    };

    const handleAdoptionClick = (adoption) => {
        setSelectedAdoption(adoption);
        fetchPetById(adoption.p_id._id);
        
        if (adoption._id) {
            checkFeedbackExists(adoption._id);
        }
    };

    const getStatusMessage = (status, visitDate = '', visitTime = '') => {
        const formattedDate = visitDate ? new Date(visitDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '';
        
        const formatTime = (time) => {
            const [hours, minutes] = time.split(':');
            const date = new Date();
            date.setHours(parseInt(hours, 10));
            date.setMinutes(parseInt(minutes, 10));
            return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        };

        const formattedTime = visitTime ? formatTime(visitTime) : 'N/A';

        switch (status) {
            case 'pending':
                return 'Your application form has been submitted. We are currently reviewing your request. Please be patient as this process may take some time.';
            case 'accepted':
                return `Congratulations! Your adoption request has been accepted. You are scheduled to visit the shelter on ${formattedDate} at ${formattedTime} for further assessment. We look forward to meeting you!`;
            case 'rejected':
                return 'Unfortunately, your adoption request has been rejected. We encourage you to reach out to us if you have any questions or would like to try again in the future.';
            case 'failed':
                return 'There was an issue processing your adoption request. Please try again later or contact support for assistance.';
            case 'complete':
                return feedbackExists
                    ? 'Thank you for providing a forever home to your new pet! You have already submitted feedback for this adoption. If you have any more comments, please contact support.' 
                    : 'Thank you for providing a forever home to your new pet! We would love to hear about your experience. Please provide your feedback by clicking the button below.';
            default:
                return 'Status unknown. Please contact support for more information.';
        }
    };

    const handleSubmitFeedback = async () => {
        try {
            const response = await axios.patch(`${config.address}/api/submit/feedback`, {
                adoptionId: selectedAdoption._id,
                petId: selectedAdoption.p_id._id,
                userId: user._id,
                rating,
                feedbackText,
            });
    
            alert(response.data.message);
    
            setShowFeedbackModal(false);

            setFeedbackExists(true);

            const updatedAdoptions = await axios.get(`${config.address}/api/my/adoptions`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                }
            });
            setAdoptions(updatedAdoptions.data);
            window.alert("Feedback submitted.");
            
        } catch (error) {
            console.error('Error submitting feedback:', error);
        }
    };
    
    const checkFeedbackExists = async (adoptionId) => {
        try {
            const response = await axios.get(`${config.address}/api/feedback/check/${adoptionId}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setFeedbackExists(response.data.exists); 
        } catch (error) {
            console.error('Error checking feedback:', error);
            setFeedbackExists(false);
        }
    };
    
    const StarRating = ({ rating, onRatingChange }) => {
        const handleClick = (value) => {
            onRatingChange(value);
        };

        return (
            <div>
                {[1, 2, 3, 4, 5].map((star) => (
                    <span key={star} onClick={() => handleClick(star)} style={{ cursor: 'pointer' }}>
                        {star <= rating ? <StarFill size={22} color="#ffc30f"/> : <Star size={22} color="#ffc30f"/>}
                    </span>
                ))}
            </div>
        );
    };

    const getActiveStep = (status) => {
        switch (status) {
            case 'submitted':
                return 0;
            case 'pending':
                return 1;
            case 'accepted':
                return 2; 
            case 'rejected':
                return 1;
            case 'complete':
                return 3;
            case 'failed':
                return 2;
            default:
                return 0; 
        }
    }

    const isStepFailed = (status) => {
        return status === 'rejected' || status === 'failed';
    };

    const handleStatusFilterChange = (e) => {
        setStatusFilter(e.target.value);
    };

    const filteredAdoptions = statusFilter
        ? adoptions.filter(adoption => adoption.status === statusFilter)
        : adoptions;
    
    const getStatusStyles = (status) => {
        switch (status) {
            case 'pending':
                return { color: 'orange' }; 
            case 'accepted':
                return { color: '#5cb85c' }; 
            case 'complete':
                return { color: '#0275d8' };
            case 'rejected': 
            case 'failed':
                return { color: '#d9534f' }; 
            default:
                return { color: '#f8f9fa' };
        }
    };

    return (
        <div className="box">
            <div className="navbox">
                <PinkNavigationBar />
            </div>
            <div className="trackerbox1">
                <div className="trackerbox2">

                    {userProfile && (
                        <div className="tracker-profile-box">
                            <div className="tracker-profile-imgbox">
                                <Image src={userProfileImage} alt="Profile" className="tracker-profile-img" />
                            </div>
                            <div className="tracker-profile-text">
                                <p className="tracker-profile-uname">{userProfile.firstName} {userProfile.lastName}</p>
                                <p className="tracker-profile-petadopter">PET ADOPTER</p>
                            </div>
                        </div>
                    )}

                    <div className="tracker-myadoptions">
                        <p className="tracker-overview">OVERVIEW</p>
                        <div className="tracker-myadoptions-header">
                            <div className="tracker-line"></div>
                            <p className="tracker-myadoptionstxt">MY ADOPTIONS</p>
                        </div>
                    </div>

                    <div className="filter-container">
                        <Form.Select 
                            aria-label="Filter adoptions by status"
                            value={statusFilter}
                            onChange={handleStatusFilterChange}
                            className="status-filter-dropdown"
                        >
                            <option value="">All Adoptions</option>
                            <option value="pending">Pending</option>
                            <option value="accepted">Accepted</option>
                            <option value="complete">Completed</option>
                            <option value="rejected">Rejected</option>
                            <option value="failed">Failed</option>
                        </Form.Select>
                    </div>

                    <div className="tracker-adoption-container">
                        {filteredAdoptions.length > 0 ? (
                            filteredAdoptions.map((adoption) => (
                                <div key={adoption._id} className="tracker-pet-button">
                                    <Button
                                        className="tracker-adoption-box"
                                        onClick={() => handleAdoptionClick(adoption)}
                                    >
                                        {adoption.p_id && adoption.p_id.pet_img && adoption.p_id.pet_img.length > 0 && (
                                            <div className="tracker-petimg-ph">
                                                <Image
                                                    src={`${config.address}${adoption.p_id.pet_img[0]}`} 
                                                    className="tracker-petimg-preview"
                                                    alt={adoption.p_id.p_name}
                                                />
                                            </div>
                                        )}

                                        <div className="tracker-profile-pettext">
                                            <p className="tracker-pprofile-name">{adoption.p_id ? adoption.p_id.p_name : 'Unknown'}</p>
                                            <p className="tracker-pprofile-det">
                                                {adoption.p_id ? `${adoption.p_id.p_gender} ${adoption.p_id.p_type}` : 'No details available'}
                                            </p>
                                        </div>
                                        <div className="tracker-card-status" style={getStatusStyles(adoption.status)}>
                                            <p>{adoption.status}</p>
                                        </div>
                                    </Button>
                                </div>
                            ))
                        ) : (
                            <p>No adoptions found</p>
                        )}
                    </div>
                </div>

                <div className="trackerbox3">
                    {selectedPet ? (
                        <div className="tracker-adoption-header">
                            <div className="tracker-adoption-head">
                                <div className="tracker-line2" />
                                <div className="tracker-head-col">
                                    <p className="tracker-here">Here's your</p>
                                    <p className="tracker-adoptionstats">Adoption Status</p>
                                </div>
                            </div>

                            <div className="tracker-pet-details">
                            {selectedPet.pet_img && selectedPet.pet_img.length > 0 && (
                                <Image
                                    src={`${config.address}${selectedPet.pet_img[0]}`} 
                                    className="tracker-pet-img"
                                    alt={selectedPet.p_name}
                                />
                            )}
                                <div className="tracker-pet-info">
                                    <p className="tracker-pet-name">{selectedPet.p_name}</p>
                                    <p className="tracker-age">Age: {selectedPet.p_age}</p>
                                    <p>Gender: {selectedPet.p_gender}</p>
                                    <p>Pet Type: {selectedPet.p_type}</p>
                                    <p>Breed: {selectedPet.p_breed}</p>
                                </div>
                            </div>

                            <div className="tracker-adoption-progress">
                            <Stepper activeStep={getActiveStep(selectedAdoption?.status)} alternativeLabel>
                                {steps.map((label, index) => {
                                    const currentStep = getActiveStep(selectedAdoption?.status);
                                    const isStepCompleted = index < currentStep;
                                    const isStepActive = index === currentStep;
                                    const isStepFailed = (selectedAdoption?.status === 'rejected' && index === 1) || (selectedAdoption?.status === 'failed' && index === 2);
                                    const stepColor = isStepFailed ? 'red' : (isStepCompleted ? '#ff66b2' : 'gray'); 

                                    return (
                                        <Step key={label} completed={isStepCompleted}>
                                            <StepLabel
                                                StepIconProps={{
                                                    style: { color: stepColor },
                                                    component: isStepFailed ? Close : undefined 
                                                }}
                                            >
                                                {label}
                                            </StepLabel>
                                        </Step>
                                    );
                                })}
                            </Stepper>

                            <div className="tracker-progress-texts">
                                <div className="tracker-progress-desc">
                                    <div className="tracker-line3" />
                                    <p className="tracker-prog-status">Status: {selectedAdoption.status}</p>
                                </div>
                                <div />
                                <p className="tracker-progressmsg">{getStatusMessage(selectedAdoption.status, selectedAdoption.visitDate, selectedAdoption.visitTime)}</p>

                                {selectedAdoption.status === 'rejected' && (
                                    <p className="tracker-progressmsg">Reason: {selectedAdoption.rejection_reason}</p>
                                )}

                                {selectedAdoption.status === 'failed' && (
                                    <p className="tracker-progressmsg">Reason: {selectedAdoption.failedReason}</p>
                                )}

                                <div className="tracker-action">
                                    {selectedAdoption && selectedAdoption.status === 'complete' && !feedbackExists && (
                                        <Button
                                            onClick={() => setShowFeedbackModal(true)}
                                            className="tracker-feedback-btn"
                                        >
                                            Provide Feedback
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </div>

                        </div>
                    ) : (
                        <div className="tracker-adoption-header">
                            <p>Select an adoption to see details</p>
                        </div>
                    )}

                    <Modal show={showFeedbackModal} onHide={() => setShowFeedbackModal(false)}>
                        <Modal.Header closeButton>
                            <Modal.Title>Submit Feedback</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Form>
                                <Form.Group controlId="feedbackRating">
                                    <Form.Label>Rating</Form.Label>
                                    <StarRating rating={rating} onRatingChange={setRating} />
                                </Form.Group>
                                <Form.Group controlId="feedbackText">
                                    <Form.Label>Feedback</Form.Label>
                                    <Form.Control 
                                        as="textarea" 
                                        rows={3} 
                                        value={feedbackText} 
                                        onChange={(e) => setFeedbackText(e.target.value)} />
                                </Form.Group>
                            </Form>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={() => setShowFeedbackModal(false)}>
                                Close
                            </Button>
                            <Button variant="primary" onClick={handleSubmitFeedback}>
                                Submit Feedback
                            </Button>
                        </Modal.Footer>
                    </Modal>
                </div>
            </div>
        </div>
    );
};

export default AdoptionTracker;
