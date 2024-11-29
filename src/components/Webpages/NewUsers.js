import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import './Homepage.css';
import TaskBar from "./TaskBar";
import NavigationBar from "./NavigationBar";
import DeleteModal from "./DeleteModal";
import DataTable from 'react-data-table-component';
import config from '../config';

const NewUsers = () => {
    const [theUser, setTheUser] = useState({});
    const [allUsers, setAllUsers] = useState([]);
    const [selectedUserForView, setSelectedUserForView] = useState(null);
    const { pusername } = useParams();
    const [showViewModal, setShowViewModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedUserForDelete, setSelectedUserForDelete] = useState(null);
    const [showLargeIDModal, setShowLargeIDModal] = useState(false);

    const [showDeclineModal, setShowDeclineModal] = useState(false);
    const [declineReason, setDeclineReason] = useState('');
    const [otherReason, setOtherReason] = useState('');
    const [userEmail, setUserEmail] = useState('');

    const [showApproveModal, setShowApproveModal] = useState(false);
    const [selectedUserForApprove, setSelectedUserForApprove] = useState(null);

    const handleViewButton = (user) => {
        console.log("View Button Clicked");
        setSelectedUserForView(user); 
        setShowViewModal(true); 
    };

    const handleApproveButton = (user) => {
        setSelectedUserForApprove(user);
        setShowApproveModal(true);
    };

    const handleApproveConfirm = () => {
        if (!selectedUserForApprove) {
            console.error('No user selected for approval.');
            return;
        }

        axios.delete(`${config.address}/api/user/delete/transfer/${selectedUserForApprove._id}`)
            .then((response) => {
                console.log('User deleted:', response.data.message);

                const emailData = {
                    to: selectedUserForApprove.p_emailadd,
                    subject: 'Your Application Status',
                    text: `Good Day, ${selectedUserForApprove.p_fname}!\n\nWe are pleased to inform you that your application for an account has been approved. You are now eligible to send adoption applications through our platform.\n\nThank you for your commitment to providing a loving home for a pet!\n\nBest regards,\nPasay Animal Shelter\n\nBest Regards,\n\nPasay Animal Shelter`,
                };

                return axios.post(`${config.address}/api/send-email`, emailData);
            })
            .then((emailResponse) => {
                console.log('Approval email sent:', emailResponse.data);
                setShowApproveModal(false);
                setAllUsers(allUsers.filter(user => user._id !== selectedUserForApprove._id));
            })
            .catch(error => {
                console.error('Error during approval process:', error);
                alert('Failed to approve the user or send the email.');
            });
    };
    

    const handleApproveCancel = () => {
        setShowApproveModal(false);
    };


    useEffect(() => {
        axios.get(`${config.address}/api/user/all`)
            .then((response) => {
                console.log(response.data.users);
                setAllUsers(response.data.users);
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);

    useEffect(() => {
        if (pusername) {
            axios.get(`${config.address}/api/user/username/` + pusername)
                .then((response) => {
                    console.log("Fetched User Data:", response.data.theUser);
                    setSelectedUserForView(response.data.theUser); 
                })
                .catch((err) => {
                    console.log(err);
                });
        }
    }, [pusername]); 

    const handleDeleteButton = (user) => {
        setSelectedUserForDelete(user);
        setShowDeleteModal(true);
    };

    const handleDeleteConfirm = () => {
        axios.delete(`${config.address}/api/user/delete/${selectedUserForDelete._id}`)
            .then((response) => {
                console.log('User deleted:', response.data);
                setAllUsers(allUsers.filter(user => user._id !== selectedUserForDelete._id));
                setShowDeleteModal(false);
            })
            .catch((error) => {
                console.error('There was an error!', error);
            });
    };

    const handleDeleteCancel = () => {
        setShowDeleteModal(false);
    };

    const handleValidIDClick = () => {
        setShowLargeIDModal(true);
    };

    const handleDeclineButton = (user) => {
        if (!user) {
            console.error('No user provided for decline.');
            return;
        }
        
        setUserEmail(user.p_emailadd);
        setSelectedUserForView(user); 
        setShowDeclineModal(true);
    };
    

    const handleDeclineConfirm = () => {
        if (!selectedUserForView) {
            console.error('No user selected for decline.');
            return; 
        }
        
        const reasonToSend = declineReason === 'Other' ? otherReason : declineReason;

        axios.delete(`${config.address}/api/user/delete/${selectedUserForView._id}`)
            .then((response) => {
                console.log('User deleted:', response.data);

                const emailData = {
                    to: userEmail,
                    subject: 'Your Application Status',
                    text: `Good Day, ${selectedUserForView.p_fname}!\n\nWe appreciate your interest in adopting a pet through our platform. After careful consideration, we regret to inform you that your application for an account has been declined.\n\nThe reason for this decision is as follows: ${reasonToSend}.\n\nWe encourage you to correct the noted reason and consider signing up again. If you have any questions or would like more details about this decision, please do not hesitate to reach out.\n\nThank you for your understanding.\n\nBest regards,\nPasay Animal Shelter`,
                };

                return axios.post(`${config.address}/api/send-email`, emailData);
            })
            .then((emailResponse) => {
                console.log('Decline email sent:', emailResponse.data);
                setShowDeclineModal(false);
                setAllUsers(allUsers.filter(user => user._id !== selectedUserForView._id)); 
            })
            .catch(error => {
                console.error('Error during decline process:', error);
                alert('Failed to decline the user or send the email.');
            });
            setShowDeclineModal(false);
    };
    
    

    const columns = [
        {
            name: 'User ID',
            selector: row => row.pending_id,
            sortable: true,
        },
        {
            name: 'Username',
            selector: row => row.p_username,
            sortable: true,
        },
        {
            name: 'Last Name',
            selector: row => row.p_lname,
            sortable: true,
        },
        {
            name: 'First Name',
            selector: row => row.p_fname,
            sortable: true,
        },
        {
            name: 'Middle Initial',
            selector: row => row.p_mname,
            sortable: true,
        },
        {
            name: 'Actions',
            cell: row => (
                <>
                    <Button className="nuviewbtn" onClick={() => handleViewButton(row)}>View</Button>
                    <Button className="nuapprovebtn" onClick={() => handleApproveButton(row)}>Approve</Button>
                    <Button className="nudeclinebtn" onClick={() => handleDeclineButton(row)}>Decline</Button>
                </>
            ),
        },
    ];

    return (
        <>
            <div className="nubox">
                <div className="navbox">
                    <NavigationBar />
                </div>

                <div className="nubox2">
                    <TaskBar />

                    <div className="nubox3">
                        <div className="nubox4">
                            <h2 className="newuser">PENDING USERS</h2>
                        </div>
                        <div className="nutable">
                            <DataTable
                                columns={columns}
                                data={allUsers}
                                paginationPerPage={13}
                                paginationRowsPerPageOptions={[5, 10, 13]}
                                pagination
                                highlightOnHover
                                onRowClicked={handleViewButton}
                            />
                        </div>

                        {/* View Modal */}
                        <Modal show={showViewModal} onHide={() => setShowViewModal(false)} className="nucustom-modal">
                            <Modal.Header closeButton>
                                <Modal.Title>View User Information</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                {selectedUserForView && (
                                    <div className="nuview-modal-content">
                                        <div className="nuleft-column"> 
                                            {selectedUserForView.p_img && (
                                                <img
                                                    src={`${config.address}${selectedUserForView.p_img}`} // Use path for user image display
                                                    alt="User Image"
                                                    className="nuimg-preview"
                                                />
                                            )}
                                            <p>User ID: {selectedUserForView.pending_id}</p>
                                            <p>Username: {selectedUserForView.p_username}</p>
                                            <p>Email: {selectedUserForView.p_emailadd}</p>
                                            <p>First Name: {selectedUserForView.p_fname}</p>
                                            <p>Last Name: {selectedUserForView.p_lname}</p>
                                            <p>Middle Initial: {selectedUserForView.p_mname}</p>
                                        </div>
                                        <div className="nuright-column">
                                            <p>Address: {selectedUserForView.p_add}</p>
                                            <p>Gender: {selectedUserForView.p_gender}</p>
                                            <p>Birthdate: {selectedUserForView.p_birthdate}</p>
                                            <p>Valid ID:</p>
                                            {selectedUserForView.p_validID && (
                                                <img
                                                    src={`${config.address}${selectedUserForView.p_validID}`} // Use path for valid ID display
                                                    alt="Valid ID"
                                                    className="nuidimg-preview"
                                                    onClick={handleValidIDClick}
                                                />
                                            )}
                                        </div>
                                    </div>
                                )}
                            </Modal.Body>
                        </Modal>

                        {/* Large ID Modal */}
                        <Modal show={showLargeIDModal} onHide={() => setShowLargeIDModal(false)} dialogClassName="nucustom-modal">
                            <Modal.Header closeButton>
                                <Modal.Title>Valid ID</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                {selectedUserForView && selectedUserForView.p_validID && (
                                    <img
                                        src={`${config.address}${selectedUserForView.p_validID}`} // Use path for large valid ID display
                                        alt="Valid ID"
                                        className="numodal-image"
                                    />
                                )}
                            </Modal.Body>
                        </Modal>

                        {/* Decline Modal */}
                        <Modal show={showDeclineModal} onHide={() => setShowDeclineModal(false)}>
                            <Modal.Header closeButton>
                                <Modal.Title>Decline User</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <Form.Group controlId="declineReason">
                                    <Form.Label>Reason for Declining:</Form.Label>
                                    <Form.Control as="select" value={declineReason} onChange={(e) => setDeclineReason(e.target.value)}>
                                        <option value="">Select a reason</option>
                                        <option value="Invalid details">Invalid details</option>
                                        <option value="Not qualified">Not qualified</option>
                                        <option value="Other">Other</option>
                                    </Form.Control>
                                    {declineReason === 'Other' && (
                                        <Form.Control
                                            type="text"
                                            placeholder="Please specify"
                                            value={otherReason}
                                            onChange={(e) => setOtherReason(e.target.value)}
                                            style={{ marginTop: '10px' }}
                                        />
                                    )}
                                </Form.Group>
                            </Modal.Body>
                            <Modal.Footer>
                                <Button variant="secondary" onClick={() => setShowDeclineModal(false)}>
                                    Cancel
                                </Button>
                                <Button variant="primary" onClick={handleDeclineConfirm}>
                                    Confirm Decline
                                </Button>
                            </Modal.Footer>
                        </Modal>

                        {/* Approve Modal */}
                        <Modal show={showApproveModal} onHide={handleApproveCancel}>
                            <Modal.Header closeButton>
                                <Modal.Title>Approve User</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <p>Are you sure you want to approve this user?</p>
                            </Modal.Body>
                            <Modal.Footer>
                                <Button variant="secondary" onClick={handleApproveCancel}>
                                    Cancel
                                </Button>
                                <Button variant="primary" onClick={handleApproveConfirm}>
                                    Confirm Approval
                                </Button>
                            </Modal.Footer>
                        </Modal>

                        <DeleteModal
                            show={showDeleteModal}
                            onHide={handleDeleteCancel}
                            onDelete={handleDeleteConfirm}
                        />
                    </div>
                </div>
            </div>
        </>
    );
};

export default NewUsers;
