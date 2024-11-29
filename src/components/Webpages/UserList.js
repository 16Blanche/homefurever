import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import React, { useContext } from "react";
import Button from 'react-bootstrap/Button';
import './Homepage.css';
import TaskBar from "./TaskBar";
import NavigationBar from "./NavigationBar";
import Modal from 'react-bootstrap/Modal';
import AuthContext from '../../context/AuthContext';
import DataTable from 'react-data-table-component';
import { Tabs, Tab } from "react-bootstrap";
import Form from 'react-bootstrap/Form';
import config from '../config';

const UserList=()=>{

    const [searchQuery, setSearchQuery] = useState(""); 

    const [theUser,setTheUser]=useState({});
    const [allUsers, setAllUsers] = useState([]);

    const [showViewModal, setShowViewModal] = useState(false);
    const [showPendingViewModal, setShowPendingViewModal] = useState(false);
    const [selectedUserForView, setSelectedUserForView] = useState(null);
    const {vusername}=useParams();

    const [showLargeIDModal, setShowLargeIDModal] = useState(false);

    const [showConfirmModal, setShowConfirmModal] = useState(false); 
    const [roleChangeRequest, setRoleChangeRequest] = useState(null); 

    const [activeTab, setActiveTab] = useState("verified");
    const [verifiedUsers, setVerifiedUsers] = useState([]);
    const [pendingUsers, setPendingUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const [showDeclineModal, setShowDeclineModal] = useState(false);
    const [declineReason, setDeclineReason] = useState('');
    const [otherReason, setOtherReason] = useState('');
    const [userEmail, setUserEmail] = useState('');

    const [showApproveModal, setShowApproveModal] = useState(false);
    const [selectedUserForApprove, setSelectedUserForApprove] = useState(null);

    const navigate = useNavigate();
    const { user } = useContext(AuthContext);



    const handleViewButton = (user) => {
        console.log("View Button Clicked");
        setSelectedUserForView(user); 
        setShowViewModal(true); 
    };

    const handlePendingViewButton = (user) => {
        console.log("View Button Clicked");
        setSelectedUserForView(user); 
        setShowPendingViewModal(true); 
    };

    const openConfirmModal = (user, newRole) => {
        setRoleChangeRequest({ user, newRole });
        setShowConfirmModal(true);
    };

    const handleRoleChange = async () => {
        const { user, newRole } = roleChangeRequest;
        try {
            await axios.put(`${config.address}/api/user/${user._id}/role`, { v_role: newRole });

            setAllUsers(allUsers.map(u => u._id === user._id ? { ...u, v_role: newRole } : u));
            setShowConfirmModal(false); 
        } catch (err) {
            console.error('Error updating role:', err);
        }
    };

    useEffect(() => {
        axios.get(`${config.address}/api/user/all`)
            .then((response) => {
                console.log(response.data.users);
                setPendingUsers(response.data.users);
            })
            .catch((err) => console.error(err))
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        axios.get(`${config.address}/api/verified/all`)
            .then((response) => {
                console.log(response.data.users);
                setAllUsers(response.data.users);
            })
            .catch((err) => {
                console.error(err);
            });
    }, []);

    useEffect(() => {
        if (vusername) {
            axios.get(`${config.address}/api/verified/` + vusername)
                .then((response) => {
                    console.log("Fetched Pet Data:", response.data.theUser);
                    setSelectedUserForView(response.data.theUser); 

                })
                .catch((err) => {
                    console.log(err);
                });
            }
    }, [vusername]); 

    
    const handleValidIDClick = () => {
        setShowLargeIDModal(true);
    };

    const handleClick = () => {
        if (user) {
          navigate('/user/pending');
        } else {
          navigate('/login');
        }
      };

    const filteredUsers = allUsers.filter(user =>
        user.v_username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.v_lname.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.v_fname.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.v_mname.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleApproveButton = (user) => {
        setSelectedUserForApprove(user);
        setShowApproveModal(true);
    };

    const handleApproveCancel = () => {
        setShowApproveModal(false);
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
            selector: row => row.v_id,
            sortable: true,
        },
        {
            name: 'Username',
            selector: row => row.v_username,
            sortable: true,
        },
        {
            name: 'Last Name',
            selector: row => row.v_lname,
            sortable: true,
        },
        {
            name: 'First Name',
            selector: row => row.v_fname,
            sortable: true,
        },
        {
            name: 'Middle Initial',
            selector: row => row.v_mname,
            sortable: true,
        },
        {
            name: 'Actions',
            cell: row => (
                <>
                    <Button className="nuviewbtn" onClick={() => handleViewButton(row)}>View</Button>
                </>
            ),
        },
    ];

    const pendingcolumns = [
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
                    <Button className="nuviewbtn" onClick={() => handlePendingViewButton(row)}>View</Button>
                    <Button className="nuapprovebtn" onClick={() => handleApproveButton(row)}>Approve</Button>
                    <Button className="nudeclinebtn" onClick={() => handleDeclineButton(row)}>Decline</Button>
                </>
            ),
        },
    ];

    return (
        <>
            <div className="ulbox">

                <div className="navbox">
                <NavigationBar/>
                </div>

                <div className="ulbox2">
                    <TaskBar/>

                    <div className="ulbox3">
                        <div className="ulbox4">
                            <h2 className="userlist">USER LIST</h2>
                            <input
                                type="text"
                                className="petsearch"
                                placeholder="Find a user"
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                            />

                            {/* <Button className="ulpendingbtn" onClick={handleClick}>
                                <p className="ulpendingtxt">Pending Users</p>
                            </Button> */}

                        </div>
                        <div className="ultable">
                            <Tabs
                                id="user-management-tabs"
                                activeKey={activeTab}
                                onSelect={(tabKey) => setActiveTab(tabKey)}
                                className="mb-3 custom-tabs" 
                            >
                                <Tab eventKey="verified" title="Verified Users">
                                    <DataTable
                                        columns={columns}
                                        data={allUsers}
                                        paginationPerPage={13}
                                        paginationRowsPerPageOptions={[5, 10, 13]}
                                        pagination
                                        highlightOnHover
                                        progressPending={loading && activeTab === "verified"}
                                        onRowClicked={(row) => handleViewButton(row)}
                                    />
                                </Tab>
                                <Tab eventKey="pending" title="Pending Users">
                                    <DataTable
                                        columns={pendingcolumns}
                                        data={pendingUsers}
                                        paginationPerPage={13}
                                        paginationRowsPerPageOptions={[5, 10, 13]}
                                        pagination
                                        highlightOnHover
                                        progressPending={loading && activeTab === "pending"}
                                        onRowClicked={(row) => handlePendingViewButton(row)}
                                    />
                                </Tab>
                            </Tabs>
                        </div>

                        {/* View Modal */}
                        <Modal show={showViewModal} onHide={() => setShowViewModal(false)} className="ulcustom-modal">
                            <Modal.Header closeButton>
                                <Modal.Title>View User Information</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                {selectedUserForView && (
                                    <div className="ulview-modal-content">
                                        <div className="ulleft-column">
                                            {selectedUserForView.v_img && (
                                                <img
                                                    src={`${config.address}${selectedUserForView.v_img}`} 
                                                    alt="User Image"
                                                    className="ulimg-preview"
                                                />
                                            )}
                                            <p>User ID: {selectedUserForView.v_id}</p>
                                            <p>Status: {selectedUserForView.v_role}</p>
                                            <p>Username: {selectedUserForView.v_username}</p>
                                            <p>Email: {selectedUserForView.v_emailadd}</p>
                                            <p>First Name: {selectedUserForView.v_fname}</p>
                                            <p>Last Name: {selectedUserForView.v_lname}</p>
                                            <p>Middle Initial: {selectedUserForView.v_mname}</p>
                                        </div>
                                        <div className="ulright-column">
                                            <p>Address: {selectedUserForView.v_add}</p>
                                            <p>Gender: {selectedUserForView.v_gender}</p>
                                            <p>Birthdate: {selectedUserForView.v_birthdate}</p>
                                            <p>Valid ID:</p>
                                            {selectedUserForView.v_validID && (
                                                <img
                                                    src={`${config.address}${selectedUserForView.v_validID}`}
                                                    alt="Valid ID"
                                                    className="ulidimg-preview"
                                                    onClick={handleValidIDClick}
                                                />
                                            )}
                                        </div>
                                    </div>
                                )}
                            </Modal.Body>
                        </Modal>

                        {/* Large ID Modal */}
                        <Modal show={showLargeIDModal} onHide={() => setShowLargeIDModal(false)} dialogClassName="ulcustom-modal">
                            <Modal.Header closeButton>
                                <Modal.Title>Valid ID</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                {selectedUserForView && selectedUserForView.v_validID && (
                                    <img
                                        src={`${config.address}${selectedUserForView.v_validID}`} 
                                        alt="Valid ID"
                                        className="ulmodal-image"
                                    />
                                )}
                            </Modal.Body>
                        </Modal>

                        {/* Confirm Role Change Modal */}
                        <Modal show={showConfirmModal} onHide={() => setShowConfirmModal(false)} className="ulcustom-modal">
                            <Modal.Header closeButton>
                                <Modal.Title>Confirm Role Change</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                {roleChangeRequest && (
                                    <div>
                                        <p>Are you sure you want to change the role of user <strong>{roleChangeRequest.user.v_username}</strong> to <strong>{roleChangeRequest.newRole}</strong>?</p>
                                        <Button variant="danger" onClick={handleRoleChange}>Yes, Change Role</Button>
                                        <Button variant="secondary" onClick={() => setShowConfirmModal(false)}>Cancel</Button>
                                    </div>
                                )}
                            </Modal.Body>
                        </Modal>

                        {/* Pending User View Modal */}
                        <Modal show={showPendingViewModal} onHide={() => setShowPendingViewModal(false)} className="nucustom-modal">
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

                        {/* Pending Large ID Modal */}
                        <Modal show={showLargeIDModal} onHide={() => setShowLargeIDModal(false)} dialogClassName="nucustom-modal">
                            <Modal.Header closeButton>
                                <Modal.Title>Valid ID</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                {selectedUserForView && selectedUserForView.p_validID && (
                                    <img
                                        src={`${config.address}${selectedUserForView.p_validID}`}
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

                    </div>
                </div>
            </div>
        </>

    );
}

export default UserList;