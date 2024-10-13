import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import Button from 'react-bootstrap/Button';
import './Homepage.css';
import TaskBar from "./TaskBar";
import NavigationBar from "./NavigationBar";
import Modal from 'react-bootstrap/Modal';
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

    const handleViewButton = (user) => {
        console.log("View Button Clicked");
        setSelectedUserForView(user); 
        setShowViewModal(true); 
    };

    const handleApprove = (userId) => {
        axios.delete(`${config.address}/api/user/delete/transfer/${userId}`)
            .then((response) => {
                setAllUsers(allUsers.filter(user => user._id !== userId));
                console.log(response.data.message);
            })
            .catch((err) => {
                console.log(err);
            });
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
                    <Button className="nuapprovebtn" onClick={() => handleApprove(row._id)}>Approve</Button>
                    <Button className="nudeclinebtn" onClick={() => handleDeleteButton(row)}>Decline</Button>
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
