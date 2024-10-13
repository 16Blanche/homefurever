import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import React, { useEffect, useState, useContext } from "react";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Table from 'react-bootstrap/Table';
import NavigationBar from "./NavigationBar";
import TaskBar from "./TaskBar";
import AuthContext from '../../context/AuthContext';
import './Homepage.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import config from '../config';

const AdminList = () => {
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const { pusername } = useParams();

    const [allStaff, setAllStaff] = useState([]);
    const [allAdmins, setAllAdmins] = useState([]);
    const [selectedUserForView, setSelectedUserForView] = useState(null);
    const [selectedUserForDelete, setSelectedUserForDelete] = useState(null);
    const [selectedStaff, setSelectedStaff] = useState(null);

    const [showViewModal, setShowViewModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showAddAdminModal, setShowAddAdminModal] = useState(false);

    const [showPassword, setShowPassword] = useState(false);

    const handlePasswordToggle = () => {
        setShowPassword(!showPassword);
    };

    const [formData, setFormData] = useState({
        s_id: "",
        firstName: "",
        lastName: "",
        email: "",
        username: "",
        password: ""
    });
    

    const [formErrors, setFormErrors] = useState({});

    const validateForm = () => {
        const errors = {};
        if (!formData.username) errors.username = "Username is required";
        if (!formData.password) {
            errors.password = "Password is required";
        } else if (formData.password.length < 6) {
            errors.password = "Password must be at least 6 characters";
        }
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    useEffect(() => {
        axios.get(`${config.address}/api/staff/all`)
            .then((response) => {
                setAllStaff(response.data.theStaff || []);
            })
            .catch((err) => {
                console.error("Error fetching staff:", err);
            });
    }, []);

useEffect(() => {
    axios.get(`${config.address}/api/admin/all`)
        .then((response) => {
            setAllAdmins(response.data.admins || []);
        })
        .catch((err) => {
            console.error("Error fetching admins:", err);
        });
}, []);


    useEffect(() => {
        if (pusername) {
            axios.get(`${config.address}/api/user/username/${pusername}`)
                .then((response) => {
                    setSelectedUserForView(response.data.theUser);
                })
                .catch((err) => {
                    console.error("Error fetching user by username:", err);
                });
        }
    }, [pusername]);

    const handleAddAdmin = () => {
        setShowAddAdminModal(true); // Open the staff selection modal
    };

    const handleStaffSelection = (staff) => {
        setSelectedStaff(staff);
        setFormData({
            s_id: staff.s_id,
            firstName: staff.s_fname,
            lastName: staff.s_lname,
            email: staff.s_email,
            username: '',
            password: ''
        });
        setShowAddAdminModal(false); // Close staff selection modal
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            axios.post(`${config.address}/api/admin/new`, {
                a_id: selectedStaff.s_id, // Include s_id if required
                firstName: formData.firstName, 
                lastName: formData.lastName,
                email: formData.email,
                username: formData.username,
                password: formData.password
            })
            .then((response) => {
                console.log("Admin added:", response.data);
                setShowAddAdminModal(false); // Close modal after adding admin
                // Optionally, refresh the admin list here
            })
            .catch((err) => {
                console.error("There was an error adding the admin!", err.response ? err.response.data : err.message);
            });
        }
    };
    

        // Handle input change
        const handleInputChange = (e) => {
            const { name, value } = e.target;
            setFormData({ ...formData, [name]: value });
        };

    const handleViewButton = (user) => {
        setSelectedUserForView(user);
        setShowViewModal(true);
    };

    const handleDeleteButton = (user) => {
        setSelectedUserForDelete(user);
        setShowDeleteModal(true);
    };

    const handleDeleteCancel = () => {
        setShowDeleteModal(false);
    };

    // const handleDeleteConfirm = (admin) => {
    //     axios.delete(`http://52.64.196.154/api/admin/delete/${admin._id}`)
    //         .then((response) => {
    //             console.log(response.data);
    //             setAllAdmins(allAdmins.filter((s) => s._id !== admin._id)); // Remove from current staff list
    //             setShowDeleteModal(false);
    //         })
    //         .catch((error) => {
    //             console.error("Error transferring staff to DeletedStaff schema:", error);
    //         });
    // };

    const handleDeleteConfirm = async (admin) => {
        try {
            // Ensure the ID is correctly passed in the URL
            await axios.post(`${config.address}/api/deletedadmin/new/${admin._id}`, {
                da_id: admin.a_id,
                da_fname: admin.a_fname,
                da_lname: admin.a_lname,
                da_email: admin.a_email,
                da_username: admin.a_username,
                da_password: admin.a_password // Ensure you handle passwords securely
            });
    
            // Delete the admin from the current list
            await axios.delete(`${config.address}/api/admin/delete/${admin._id}`);
        
            // Update the state to remove the admin from the list
            setAllAdmins(allAdmins.filter((s) => s._id !== admin._id)); // Remove from current admin list
            setShowDeleteModal(false);
        } catch (error) {
            console.error("Error handling deletion:", error);
        }
    };
    
    

    return (
        <>
            <div className="box">
                <div className="navbox">
                    <NavigationBar />
                </div>

                <div className="nubox2">
                    <TaskBar />

                    <div className="nubox3">
                        <div className="nubox4">
                            <h2 className="newuser">ADMINS</h2>
                            <input type="text" className="petsearch" placeholder="Search"/>
                            <Button className="staddstbtn" onClick={handleAddAdmin}>
                                <p className="staddsttxt">+ Add Admin</p>
                            </Button>
                        </div>
                        <table className="nutable">
                            <thead>
                                <tr className="pltheader">
                                    <th>Staff ID</th>
                                    <th>Username</th>
                                    <th>Last Name</th>
                                    <th>First Name</th>
                                    <th>Email</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {allAdmins.map((element) => (
                                    <tr key={element._id}>
                                        <td className="nutabletext">{element.s_id}</td>
                                        <td className="nutabletext">{element.a_username}</td>
                                        <td className="nutabletext">{element.a_lname}</td>
                                        <td className="nutabletext">{element.a_fname}</td>
                                        <td className="nutabletext">{element.a_email}</td>
                                        <td>
                                            {/* <Button className="nuviewbtn" onClick={() => handleViewButton(element)}>View</Button> */}
                                            <Button className="nudeclinebtn" onClick={() => handleDeleteButton(element)}>Delete</Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {/* View Modal */}
                        <Modal show={showViewModal} onHide={() => setShowViewModal(false)}>
                            <Modal.Header closeButton>
                                <Modal.Title>View Admin Information</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                {selectedUserForView && (
                                    <div className="nuview-modal-content">
                                        <div className="nuleft-column"> 
                                            <p>User ID: {selectedUserForView.s_id}</p>
                                            <p>Username: {selectedUserForView.a_username}</p>
                                            <p>Email: {selectedUserForView.s_email}</p>
                                            <p>First Name: {selectedUserForView.firstName}</p>
                                            <p>Last Name: {selectedUserForView.lastName}</p>
                                            <p>Middle Name: {selectedUserForView.middleName}</p>
                                        </div>
                                        <div className="nuright-column">
                                            <p>Address: {selectedUserForView.address}</p>
                                            <p>Gender: {selectedUserForView.gender}</p>
                                            <p>Date of Birth: {selectedUserForView.dateOfBirth}</p>
                                            <p>Phone Number: {selectedUserForView.contactNumber}</p>
                                        </div>
                                    </div>
                                )}
                            </Modal.Body>
                        </Modal>

                        {/* Add Admin Modal */}
                        <Modal show={showAddAdminModal} onHide={() => setShowAddAdminModal(false)}>
                            <Modal.Header closeButton>
                                <Modal.Title>Select Staff to Add as Admin</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <Table striped bordered hover>
                                    <thead>
                                        <tr>
                                            <th>First Name</th>
                                            <th>Last Name</th>
                                            <th>Position</th>
                                            {/* <th>Action</th> */}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {allStaff && allStaff.filter(admin => admin.s_role !== 'admin').map(staff => (
                                            <tr key={staff._id} onClick={() => handleStaffSelection(staff)} style={{ cursor: 'pointer' }}>
                                                <td>{staff.s_fname}</td>
                                                <td>{staff.s_lname}</td>
                                                <td>{staff.s_position}</td>
                                                {/* <td>
                                                    <Button variant="primary" onClick={() => handleStaffSelection(staff)}>
                                                        Select
                                                    </Button>
                                                </td> */}
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            </Modal.Body>
                        </Modal>

                        {/* Form for assigning username and password */}
                        <Modal show={selectedStaff !== null} onHide={() => setSelectedStaff(null)}>
                        <Modal.Header closeButton>
                            <Modal.Title>Assign Admin Credentials</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <form onSubmit={handleFormSubmit}>
                                <div className="form-group">
                                    <label>First Name</label>
                                    <input 
                                        type="text" 
                                        className={`form-control ${formErrors.firstName ? 'is-invalid' : ''}`} 
                                        name="firstName" 
                                        value={formData.firstName} 
                                        onChange={handleInputChange} 
                                        disabled
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Last Name</label>
                                    <input 
                                        type="text" 
                                        className={`form-control ${formErrors.lastName ? 'is-invalid' : ''}`} 
                                        name="lastName" 
                                        value={formData.lastName} 
                                        onChange={handleInputChange} 
                                        disabled
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Email</label>
                                    <input 
                                        type="email" 
                                        className={`form-control ${formErrors.email ? 'is-invalid' : ''}`} 
                                        name="email" 
                                        value={formData.email} 
                                        onChange={handleInputChange} 
                                        disabled
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Username</label>
                                    <input 
                                        type="text" 
                                        className={`form-control ${formErrors.username ? 'is-invalid' : ''}`} 
                                        name="username" 
                                        value={formData.username} 
                                        onChange={handleInputChange} 
                                    />
                                    {formErrors.username && <div className="invalid-feedback">{formErrors.username}</div>}
                                </div>
                                <div className="form-group password-input-group">
                                <label>Password</label>
                                <div className="input-group">
                                    <input 
                                        type={showPassword ? "text" : "password"} 
                                        className={`form-control ${formErrors.password ? 'is-invalid' : ''}`} 
                                        name="password" 
                                        value={formData.password} 
                                        onChange={handleInputChange} 
                                    />
                                    <div className="input-group-append">
                                        <span className="input-group-text">
                                            <FontAwesomeIcon 
                                                icon={showPassword ? faEyeSlash : faEye} 
                                                onMouseDown={handlePasswordToggle} 
                                                onMouseUp={handlePasswordToggle} 
                                                onMouseLeave={() => setShowPassword(false)} 
                                                style={{ cursor: "pointer" }} 
                                            />
                                        </span>
                                    </div>
                                </div>
                                {formErrors.password && <div className="invalid-feedback">{formErrors.password}</div>}
                            </div>

                                <Button variant="primary" type="submit">
                                    Add Admin
                                </Button>
                            </form>
                        </Modal.Body>
                    </Modal>

                    {/* Delete Modal */}
                    <Modal show={showDeleteModal} onHide={handleDeleteCancel}>
                        <Modal.Header closeButton>
                            <Modal.Title>Confirm Admin Deletion</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <p>Are you sure you want to remove this user as an admin?</p>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={handleDeleteCancel}>
                                Cancel
                            </Button>
                            <Button variant="danger" onClick={() => handleDeleteConfirm(selectedUserForDelete)}>
                                Confirm Delete
                            </Button>
                        </Modal.Footer>
                    </Modal>

                    </div>
                </div>
            </div>
        </>
    );
};

export default AdminList;
