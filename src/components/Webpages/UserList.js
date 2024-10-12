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

const convertToBase64 = (buffer) => {
    return btoa(
        new Uint8Array(buffer).reduce((data, byte) => data + String.fromCharCode(byte), '')
    );
};

const UserList=()=>{

    const [searchQuery, setSearchQuery] = useState(""); 

    const [theUser,setTheUser]=useState({});
    const [allUsers, setAllUsers] = useState([]);

    const [showViewModal, setShowViewModal] = useState(false);
    const [selectedUserForView, setSelectedUserForView] = useState(null);
    const {vusername}=useParams();

    const [showLargeIDModal, setShowLargeIDModal] = useState(false);

    const [showConfirmModal, setShowConfirmModal] = useState(false); 
    const [roleChangeRequest, setRoleChangeRequest] = useState(null); 

    const navigate = useNavigate();
    const { user } = useContext(AuthContext);

    const handleViewButton = (user) => {
        console.log("View Button Clicked");
        setSelectedUserForView(user); 
        setShowViewModal(true); 
    };

    const openConfirmModal = (user, newRole) => {
        setRoleChangeRequest({ user, newRole });
        setShowConfirmModal(true);
    };

    const handleRoleChange = async () => {
        const { user, newRole } = roleChangeRequest;
        try {
            await axios.put(`http://54.206.91.60/api/user/${user._id}/role`, { v_role: newRole });

            setAllUsers(allUsers.map(u => u._id === user._id ? { ...u, v_role: newRole } : u));
            setShowConfirmModal(false); 
        } catch (err) {
            console.error('Error updating role:', err);
        }
    };

    useEffect(() => {
        axios.get("http://54.206.91.60/api/verified/all")
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
            axios.get("http://54.206.91.60/api/verified/" + vusername)
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
                    <Button className="ulviewbtn" onClick={() => handleViewButton(row)}>View</Button>
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

                            <Button className="ulpendingbtn" onClick={handleClick}>
                                <p className="ulpendingtxt">Pending Users</p>
                            </Button>

                        </div>
                        <div className="ultable">
                            <DataTable
                                columns={columns}
                                data={filteredUsers}
                                paginationPerPage={13}
                                paginationRowsPerPageOptions={[5, 10, 13]}
                                pagination
                                highlightOnHover
                                onRowClicked={handleViewButton}
                            />
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
                                                    src={`data:image/jpeg;base64,${convertToBase64(selectedUserForView.v_img.data)}`}
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
                                                    src={`data:image/jpeg;base64,${convertToBase64(selectedUserForView.v_validID.data)}`}
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
                                        src={`data:image/jpeg;base64,${convertToBase64(selectedUserForView.v_validID.data)}`}
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

                    </div>
                </div>
            </div>
        </>

    );
}

export default UserList;