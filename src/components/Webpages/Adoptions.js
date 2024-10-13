import React, { useEffect, useState } from "react";
import { Card, Modal, Button, Form, Image } from "react-bootstrap";
import NavigationBar from "./NavigationBar";
import TaskBar from "./TaskBar";
import axios from "axios";
import './Homepage.css';
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight } from 'react-bootstrap-icons';
import config from '../config';

const Adoptions = () => {
    const [pendingAdoptions, setPendingAdoptions] = useState([]);
    const [activeAdoptions, setActiveAdoptions] = useState([]);
    const [selectedAdoption, setSelectedAdoption] = useState(null);
    const [selectedActiveAdoption, setSelectedActiveAdoption] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [showActiveModal, setShowActiveModal] = useState(false);
    const [showDateModal, setShowDateModal] = useState(false);
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [visitDate, setVisitDate] = useState('');
    const [visitTime, setVisitTime] = useState('');
    const [rejectionReason, setRejectionReason] = useState('');
    const [otherReason, setOtherReason] = useState('');
    const [showFailedModal, setShowFailedModal] = useState(false);
    const [failedReason, setFailedReason] = useState('');
    const [otherFailedReason, setOtherFailedReason] = useState('');

    const navigate = useNavigate();

    const [pendingStartIndex, setPendingStartIndex] = useState(0);
    const [activeStartIndex, setActiveStartIndex] = useState(0);
    const cardsToShow = 5;

    const fetchAdoptions = () => {
        axios.get(`${config.address}/api/adoption/pending`)
            .then((response) => {
                console.log("Pending Adoptions Response:", response.data); 
                setPendingAdoptions(response.data || []);
            })
            .catch((err) => {
                console.error("Error fetching pending adoptions:", err);
            });

        axios.get(`${config.address}/api/adoption/active`)
            .then((response) => {
                console.log("Active Adoptions Response:", response.data); 
                setActiveAdoptions(response.data || []);
            })
            .catch((err) => {
                console.error("Error fetching active adoptions:", err);
            });
    };

    useEffect(() => {
        fetchAdoptions();
    }, []);

    const handleShowModal = (adoption) => {
        setSelectedAdoption(adoption);
        setShowModal(true);
    };

    const handleShowActiveModal = (adoption) => {
        setSelectedActiveAdoption(adoption);
        setShowActiveModal(true);
    };

    const handleCloseActiveModal = () => {
        setShowActiveModal(false);
        setSelectedActiveAdoption(null);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedAdoption(null);
    };

    const handleAccept = () => {
        setShowModal(false);
        setShowDateModal(true);
    };

    const handleReject = () => {
        setShowModal(false);
        setShowRejectModal(true);
    };

    const handleRejectConfirmation = () => {
        axios.patch(`${config.address}/api/adoption/decline/${selectedAdoption._id}`, { rejection_reason: rejectionReason === 'Other' ? otherReason : rejectionReason })
            .then(() => {
                setPendingAdoptions(prev => prev.filter(adopt => adopt._id !== selectedAdoption._id));
                setShowRejectModal(false);
                setSelectedAdoption(null);
                setRejectionReason('');
                setOtherReason('');
                alert('Adoption rejected successfully.');
                fetchAdoptions();
            })
            .catch(err => console.error("Error rejecting adoption:", err));
    };

    const handleSubmitDate = () => {
        axios.patch(`${config.address}/api/adoption/approve/${selectedAdoption._id}`, { visitDate, visitTime })
            .then(() => {
                setPendingAdoptions(prev => prev.filter(adopt => adopt._id !== selectedAdoption._id));
                setShowDateModal(false);
                setVisitDate('');
                setVisitTime('');
                alert('Adoption approved and visit scheduled.');
                fetchAdoptions(); 
            })
            .catch(err => console.error("Error approving adoption:", err));
    };

    const handleCompleteAdoption = () => {
        if (!selectedActiveAdoption || !selectedActiveAdoption._id) {
            console.error("No active adoption selected or missing adoption ID");
            return;
        }
        axios.patch(`${config.address}/api/adoption/complete/${selectedActiveAdoption._id}`)
            .then(() => {
                alert('Adoption marked as complete.');
                fetchAdoptions();
                setShowActiveModal(false);
            })
            .catch(err => console.error("Error completing adoption:", err));
    };

    const handleFailAdoption = () => {
        setShowModal(false);
        setShowFailedModal(true);
    };

    const handleSubmitFailed = () => {
        axios.patch(`${config.address}/api/adoption/fail/${selectedActiveAdoption._id}`, { reason: failedReason === 'Other' ? otherFailedReason : failedReason })
            .then(() => {
                alert('Adoption marked as failed.');
                fetchAdoptions();
                setShowFailedModal(false);
                setFailedReason('');
                setOtherFailedReason('');
                setShowActiveModal(false);
            })
            .catch(err => console.error("Error failing adoption:", err));
    };

    const handlePendingNext = () => {
        if (pendingStartIndex + cardsToShow < pendingAdoptions.length) {
            setPendingStartIndex(prevIndex => prevIndex + cardsToShow);
        }
    };

    const handlePendingPrev = () => {
        if (pendingStartIndex - cardsToShow >= 0) {
            setPendingStartIndex(prevIndex => prevIndex - cardsToShow);
        }
    };

    const handleActiveNext = () => {
        if (activeStartIndex + cardsToShow < activeAdoptions.length) {
            setActiveStartIndex(prevIndex => prevIndex + cardsToShow);
        }
    };

    const handleActivePrev = () => {
        if (activeStartIndex - cardsToShow >= 0) {
            setActiveStartIndex(prevIndex => prevIndex - cardsToShow);
        }
    };

    const handleRejectionReasonChange = (e) => {
        setRejectionReason(e.target.value);
        if (e.target.value !== 'Other') {
            setOtherReason('');
        }
    };

    const handleFailedReasonChange = (e) => {
        setFailedReason(e.target.value);
        if (e.target.value !== 'Other') {
            setOtherFailedReason('');
        }
    };

    return (
        <>
            <div className="adoptionsmainbox">
                <div className="navbox">
                    <NavigationBar />
                </div>
                <div className="box2">
                    <TaskBar />
                    <div className="adoptions-box2">
                        
                        {/* Pending Adoptions */}
                        <div className="adoptions-box3">
                            <div className="adoptions-titlenbtn">
                                <h2 className="adoptions-title">PENDING ADOPTIONS</h2>
                                <div className="adoptions-btns">
                                    <Button className="adoptions-feedbackbtn" onClick={() => navigate('/adoptions/past')}>Past Adoptions</Button>
                                    <Button className="adoptions-feedbackbtn" onClick={() => navigate('/feedbacks')}>View Feedback</Button>
                                </div>
                            </div>

                            <div className="adoptions-box">
                                <div className="pagination-prev">
                                    <Button 
                                        className="left-button" 
                                        onClick={handlePendingPrev} 
                                        disabled={pendingStartIndex === 0}>
                                        <ChevronLeft/>
                                    </Button>
                                </div>
                                
                                {pendingAdoptions.length > 0 ? (
                                    pendingAdoptions.slice(pendingStartIndex, pendingStartIndex + cardsToShow).map((adoption) => (
                                        <Card key={adoption._id} className="adoption-card" onClick={() => handleShowModal(adoption)}>
                                            <Card.Body>
                                            {adoption.p_id.pet_img && adoption.p_id.pet_img.length > 0 && (
                                                <Image
                                                    src={`${config.address}${adoption.p_id.pet_img[0]}`} // Use path for image display
                                                    alt={adoption.p_id.p_name}
                                                    fluid
                                                    className="adoptions-pimg"
                                                />
                                            )}
                                                <Card.Text className="adoptions-text">
                                                    <div>
                                                        <strong>Adopter:</strong> {adoption.v_id.v_fname} {adoption.v_id.v_lname}
                                                    </div>
                                                    <div>
                                                        <strong>Pet Name:</strong> {adoption.p_id.p_name}
                                                    </div>
                                                    <div>
                                                        <strong>Pet Type:</strong> {adoption.p_id.p_type}
                                                    </div>
                                                    <div>
                                                        <strong>Home Type:</strong> {adoption.home_type}
                                                    </div>
                                                </Card.Text>
                                            </Card.Body>
                                        </Card>
                                    ))
                                ) : (
                                    <p>No pending adoptions</p>
                                )}

                                <div className="pagination-next">
                                    <Button 
                                        className="right-button" 
                                        onClick={handlePendingNext} 
                                        disabled={pendingStartIndex + cardsToShow >= pendingAdoptions.length}>
                                        <ChevronRight/>
                                    </Button>
                                </div>
                            </div>
                        </div>


                        {/* Active Adoptions */}
                        <div className="adoptions-box3">
                            <h2 className="adoptions-title2">ACTIVE ADOPTIONS</h2>

                            <div className="adoptions-box">
                                <Button 
                                    className="left-button" 
                                    onClick={handleActivePrev} 
                                    disabled={activeStartIndex === 0}>
                                    <ChevronLeft/>
                                </Button>

                                {activeAdoptions.length > 0 ? (
                                    activeAdoptions.slice(activeStartIndex, activeStartIndex + cardsToShow).map((adoption) => (
                                        <Card key={adoption._id} className="adoption-card" onClick={() => handleShowActiveModal(adoption)}>
                                            <Card.Body>
                                            {adoption.p_id.pet_img && adoption.p_id.pet_img.length > 0 && (
                                                <Image
                                                    src={`${config.address}${adoption.p_id.pet_img[0]}`} // Use path for image display
                                                    alt={adoption.p_id.p_name}
                                                    fluid
                                                    className="adoptions-pimg"
                                                />
                                            )}
                                                <Card.Text className="adoptions-text">
                                                    <div>
                                                        <strong>Adopter:</strong> {adoption.v_id.v_fname} {adoption.v_id.v_lname}
                                                    </div>
                                                    <div>
                                                        <strong>Pet Name:</strong> {adoption.p_id.p_name}
                                                    </div>
                                                    <div>
                                                        <strong>Pet Type:</strong> {adoption.p_id.p_type}
                                                    </div>
                                                    <div>
                                                        <strong>Home Type:</strong> {adoption.home_type}
                                                    </div>
                                                </Card.Text>
                                            </Card.Body>
                                        </Card>
                                    ))
                                ) : (
                                    <p>No active adoptions</p>
                                )}

                                <Button 
                                    className="right-button" 
                                    onClick={handleActiveNext} 
                                    disabled={activeStartIndex + cardsToShow >= activeAdoptions.length}>
                                    <ChevronRight/>
                                </Button>
                            </div>
                        </div>

                        {/* Modal for displaying full adoption details */}
                        {selectedAdoption && (
                            <Modal show={showModal} onHide={handleCloseModal}>
                                <Modal.Header closeButton>
                                    <Modal.Title>Pending Adoption Details</Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                    <h4>Pet Information</h4>
                                    <p><strong>Name:</strong> {selectedAdoption.p_id.p_name}</p>
                                    <p><strong>Type:</strong> {selectedAdoption.p_id.p_type}</p>
                                    <p><strong>Age:</strong> {selectedAdoption.p_id.p_age}</p>
                                    <p><strong>Gender:</strong> {selectedAdoption.p_id.p_gender}</p>

                                    <h4>Adopter Information</h4>
                                    <p><strong>Full Name:</strong> {selectedAdoption.v_id.v_fname} {selectedAdoption.v_id.v_mname} {selectedAdoption.v_id.v_lname}</p>
                                    <p><strong>Occupation:</strong> {selectedAdoption.occupation}</p>
                                    <p><strong>Address:</strong> {selectedAdoption.v_id.v_add}</p>
                                    <p><strong>Email:</strong> {selectedAdoption.v_id.v_emailadd}</p>
                                    <p><strong>Contact Number:</strong> {selectedAdoption.v_id.v_contactnumber}</p>

                                    <h4>Household Information</h4>
                                    <p><strong>Home Type:</strong> {selectedAdoption.home_type}</p>
                                    <p><strong>Years Resided:</strong> {selectedAdoption.years_resided}</p>
                                    <p><strong>Adults in Household:</strong> {selectedAdoption.adults_in_household}</p>
                                    <p><strong>Children in Household:</strong> {selectedAdoption.children_in_household}</p>
                                    <p><strong>Allergic to Pets:</strong> {selectedAdoption.allergic_to_pets ? 'Yes' : 'No'}</p>
                                    <p><strong>Household Description:</strong> {selectedAdoption.household_description}</p>
                                </Modal.Body>
                                <Modal.Footer>
                                    <Button variant="success" onClick={handleAccept}>Accept</Button>
                                    <Button variant="danger" onClick={handleReject}>Reject</Button>
                                </Modal.Footer>
                            </Modal>
                        )}

                        {/* Modal for displaying active adoption details */}
                        {selectedActiveAdoption && (
                            <Modal show={showActiveModal} onHide={handleCloseActiveModal}>
                                <Modal.Header closeButton>
                                    <Modal.Title>Active Adoption Details</Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                    <h4>Pet Information</h4>
                                    <p><strong>Name:</strong> {selectedActiveAdoption.p_id.p_name}</p>
                                    <p><strong>Type:</strong> {selectedActiveAdoption.p_id.p_type}</p>
                                    <p><strong>Age:</strong> {selectedActiveAdoption.p_id.p_age}</p>
                                    <p><strong>Gender:</strong> {selectedActiveAdoption.p_id.p_gender}</p>

                                    <h4>Adopter Information</h4>
                                    <p><strong>Full Name:</strong> {selectedActiveAdoption.v_id.v_fname} {selectedActiveAdoption.v_id.v_mname} {selectedActiveAdoption.v_id.v_lname}</p>
                                    <p><strong>Occupation:</strong> {selectedActiveAdoption.occupation}</p>
                                    <p><strong>Address:</strong> {selectedActiveAdoption.v_id.v_add}</p>
                                    <p><strong>Email:</strong> {selectedActiveAdoption.v_id.v_emailadd}</p>
                                    <p><strong>Contact Number:</strong> {selectedActiveAdoption.v_id.v_contactnumber}</p>

                                    <h4>Household Information</h4>
                                    <p><strong>Home Type:</strong> {selectedActiveAdoption.home_type}</p>
                                    <p><strong>Years Resided:</strong> {selectedActiveAdoption.years_resided}</p>
                                    <p><strong>Adults in Household:</strong> {selectedActiveAdoption.adults_in_household}</p>
                                    <p><strong>Children in Household:</strong> {selectedActiveAdoption.children_in_household}</p>
                                    <p><strong>Allergic to Pets:</strong> {selectedActiveAdoption.allergic_to_pets ? 'Yes' : 'No'}</p>
                                    <p><strong>Household Description:</strong> {selectedActiveAdoption.household_description}</p>
                                </Modal.Body>
                                <Modal.Footer>
                                    <Button variant="success" onClick={handleCompleteAdoption}>Complete</Button>
                                    <Button variant="danger" onClick={handleFailAdoption}>Fail</Button>
                                </Modal.Footer>
                            </Modal>
                        )}

                        {/* Modal for Failed Adoption */}
                        <Modal show={showFailedModal} onHide={() => setShowFailedModal(false)}>
                            <Modal.Header closeButton>
                                <Modal.Title>Reason for Failed Adoption</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <Form.Group controlId="failedReason">
                                    <Form.Label>Select Reason for Failure</Form.Label>
                                    <Form.Control
                                        as="select"
                                        value={failedReason}
                                        onChange={handleFailedReasonChange}
                                    >
                                        <option value="">-- Select a Reason --</option>
                                        <option value="Incompatible with pet">Incompatible with pet</option>
                                        <option value="Incomplete documentation">Incomplete documentation</option>
                                        <option value="No longer interested">No longer interested</option>
                                        <option value="Failed home visit">Failed home visit</option>
                                        <option value="Other">Other</option>
                                    </Form.Control>
                                </Form.Group>

                                {failedReason === 'Other' && (
                                    <Form.Group controlId="otherFailedReason" className="mt-3">
                                        <Form.Label>Please specify the reason</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Enter the reason"
                                            value={otherFailedReason}
                                            onChange={(e) => setOtherFailedReason(e.target.value)}
                                        />
                                    </Form.Group>
                                )}
                            </Modal.Body>
                            <Modal.Footer>
                                <Button variant="secondary" onClick={() => setShowFailedModal(false)}>
                                    Cancel
                                </Button>
                                <Button
                                    variant="danger"
                                    onClick={handleSubmitFailed}
                                    disabled={failedReason === '' || (failedReason === 'Other' && otherFailedReason === '')}
                                >
                                    Submit Failure Reason
                                </Button>
                            </Modal.Footer>
                        </Modal>

                        {/* Modal for scheduling a visit */}
                        <Modal show={showDateModal} onHide={() => setShowDateModal(false)}>
                            <Modal.Header closeButton>
                                <Modal.Title>Schedule Visit</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <Form>
                                    <Form.Group controlId="visitDate">
                                        <Form.Label>Select Date</Form.Label>
                                        <Form.Control
                                            type="date"
                                            value={visitDate}
                                            onChange={(e) => setVisitDate(e.target.value)}
                                        />
                                    </Form.Group>
                                    <Form.Group controlId="visitTime">
                                        <Form.Label>Select Time</Form.Label>
                                        <Form.Control
                                            type="time"
                                            value={visitTime}
                                            onChange={(e) => setVisitTime(e.target.value)}
                                        />
                                    </Form.Group>
                                </Form>
                            </Modal.Body>
                            <Modal.Footer>
                                <Button variant="primary" onClick={handleSubmitDate}>Submit</Button>
                            </Modal.Footer>
                        </Modal>

                        {/* Modal for reject confirmation */}
                        <Modal show={showRejectModal} onHide={() => setShowRejectModal(false)}>
                            <Modal.Header closeButton>
                                <Modal.Title>Reject Adoption</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <p>Are you sure you want to reject the application?</p>
                                <Form>
                                    <Form.Group controlId="rejectionReason">
                                        <Form.Label>Reason for Rejection</Form.Label>
                                        <Form.Control
                                            as="select"
                                            value={rejectionReason}
                                            onChange={handleRejectionReasonChange}
                                        >
                                            <option value="">Select a reason</option>
                                            <option value="Not Suitable">Not Suitable</option>
                                            <option value="Incomplete Information">Incomplete Information</option>
                                            <option value="Other">Other</option>
                                        </Form.Control>
                                    </Form.Group>

                                    {rejectionReason === 'Other' && (
                                        <Form.Group controlId="otherReason" className="mt-3">
                                            <Form.Label>Please specify the reason</Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="Enter the reason"
                                                value={otherReason}
                                                onChange={(e) => setOtherReason(e.target.value)}
                                            />
                                        </Form.Group>
                                    )}
                                </Form>
                            </Modal.Body>
                            <Modal.Footer>
                                <Button variant="secondary" onClick={() => setShowRejectModal(false)}>
                                    Cancel
                                </Button>
                                <Button
                                    variant="danger"
                                    onClick={() => handleRejectConfirmation(rejectionReason, otherReason)}
                                    disabled={rejectionReason === '' || (rejectionReason === 'Other' && otherReason === '')}
                                >
                                    Confirm Reject
                                </Button>
                            </Modal.Footer>
                        </Modal>

                    </div>
                </div>
            </div>
        </>
    );
};

export default Adoptions;
