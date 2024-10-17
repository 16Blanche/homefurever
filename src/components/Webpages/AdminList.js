import axios from "axios";
import CryptoJS from 'crypto-js';
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
import DataTable from 'react-data-table-component';
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
    const [showConfirmationModal, setShowConfirmationModal] = useState(false);


    const [showPassword, setShowPassword] = useState(false);

    const generateUsername = (firstName, lastName) => {
        const shortFirstName = firstName.charAt(0).toLowerCase();
        const shortLastName = lastName.slice(0, 5).toLowerCase();
        const randomNum = Math.floor(Math.random() * 1000);
        return `${shortFirstName}${shortLastName}${randomNum}`;
    };
    
    
    const generatePassword = () => {
        const randomBytes = CryptoJS.lib.WordArray.random(10); 
        return randomBytes.toString(CryptoJS.enc.Hex); 
    };

    const handlePasswordToggle = () => {
        setShowPassword(!showPassword);
    };

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        username: "",
        password: ""
    });

    const handleConfirmation = (e) => {
        e.preventDefault(); 
        setShowConfirmationModal(true);
    }
    

    const [formErrors, setFormErrors] = useState({});

    const validateForm = () => {
        const errors = {};
        if (!formData.username) errors.username = "Username is required";
        if (!formData.password) {
            errors.password = "Password is required";
        } else if (formData.password.length < 6) {
            errors.password = "Password must be at least 6 characters";
        }
        if (!formData.s_id) {
            errors.s_id = "Staff ID is required";
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
                const admins = response.data.admins || [];
                const filteredAdmins = admins.filter(admin => admin.a_role === 'admin');
                setAllAdmins(filteredAdmins);
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
        setShowAddAdminModal(true); 
    };

    const handleStaffSelection = (staff) => {
        setSelectedStaff(staff);
        setFormData({
            s_id: staff.s_id,
            firstName: staff.s_fname,
            lastName: staff.s_lname,
            middleName: staff.s_mname,
            address: staff.s_add,
            contact: staff.s_contactnumber,
            position: staff.s_position,
            gender: staff.s_gender,
            birthdate: staff.s_birthdate,
            email: staff.s_email,

            username: '',
            password: ''
        });
        setShowAddAdminModal(false); 
    };

    const handleConfirmAddAdmin = async () => {
        const generatedUsername = generateUsername(formData.firstName, formData.lastName);
        const generatedPassword = generatePassword();
    
        const updatedFormData = {
            ...formData,
            username: generatedUsername,
            password: generatedPassword,
            s_id: selectedStaff.s_id 
        };
    
        setFormData(updatedFormData);
    
        if (validateForm()) {
            try {
                const response = await axios.post(`${config.address}/api/admin/new`, {
                    firstName: updatedFormData.firstName, 
                    lastName: updatedFormData.lastName,
                    middleName: updatedFormData.middleName,
                    address: updatedFormData.address,
                    contact: updatedFormData.contact,
                    position: updatedFormData.position,
                    gender: updatedFormData.gender,
                    birthdate: updatedFormData.birthdate,
                    email: updatedFormData.email,
                    username: generatedUsername,
                    password: generatedPassword,
                    s_id: updatedFormData.s_id
                });
    
                console.log("Admin added:", response.data);
                setShowConfirmationModal(false); 

                await axios.post(`${config.address}/api/send-email`, {
                    to: updatedFormData.email,
                    subject: "Your Admin Credentials",
                    text: `Dear ${updatedFormData.firstName},\n\nYour admin account has been created. Below are your login credentials:\n\nUsername: ${generatedUsername}\nPassword: ${generatedPassword}\n\nPlease change your password after logging in.\n`
                });
                console.log("Email successfully sent");
    
                fetchAdmins();
    
            } catch (err) {
                console.error("There was an error adding the admin!", err.response ? err.response.data : err.message);
            }
        }
    };

    const fetchAdmins = () => {
        console.log("Fetching admin data from the API...");
    
        axios.get(`${config.address}/api/admin/all`)
            .then((response) => {
                console.log("Admin data fetched from API response:", response.data);
    
                if (response.data && Array.isArray(response.data.admins)) {
                    // Filter admins to only include those with s_role === 'admin'
                    const filteredAdmins = response.data.admins.filter(admin => admin.s_role === 'admin' || admin.s_role === 'pending-admin');
                    
                    console.log("Number of admins with s_role 'admin' retrieved:", filteredAdmins.length);
                    setAllAdmins(filteredAdmins); // Set state with only the filtered admins
                } else {
                    console.error("Unexpected response structure:", response.data);
                }
            })
            .catch((err) => {
                console.error("Error fetching admins:", err.message);
                console.error("Full error object:", err);
            });
    };
    
    
    useEffect(() => {
        fetchAdmins(); // Fetch admins when the component mounts
    }, []);

    useEffect(() => {
        console.log("allAdmins state updated:", allAdmins);
    }, [allAdmins]);

    
    
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

    // const handleDeleteConfirm = async (admin) => {
    //     try {
    //         // Ensure the ID is correctly passed in the URL
    //         await axios.post(`http://52.64.196.154/api/deletedadmin/new/${admin._id}`, {
    //             da_id: admin.a_id,
    //             da_fname: admin.a_fname,
    //             da_lname: admin.a_lname,
    //             da_email: admin.a_email,
    //             da_username: admin.a_username,
    //             da_password: admin.a_password // Ensure you handle passwords securely
    //         });
    
    //         // Delete the admin from the current list
    //         await axios.delete(`http://52.64.196.154/api/admin/delete/${admin._id}`);
        
    //         // Update the state to remove the admin from the list
    //         setAllAdmins(allAdmins.filter((s) => s._id !== admin._id)); // Remove from current admin list
    //         setShowDeleteModal(false);
    //     } catch (error) {
    //         console.error("Error handling deletion:", error);
    //     }
    // };

    const handleDeleteConfirm = async (admin) => {
        try {
            await axios.patch(`${config.address}/api/admin/update/${admin._id}`, {
                s_role: 'deleted-admin'
            });

            setAllAdmins(allAdmins.filter((s) => s._id !== admin._id));
            setShowDeleteModal(false);
        } catch (error) {
            console.error("Error handling deletion:", error);
        }
    };
    
    const columns = [
        {
            name: 'User ID',
            selector: row => row.a_id,
            sortable: true,
        },
        {
            name: 'Username',
            selector: row => row.a_username, 
            sortable: true,
        },
        {
            name: 'Last Name',
            selector: row => row.a_lname, 
            sortable: true,
        },
        {
            name: 'First Name',
            selector: row => row.a_fname, 
            sortable: true,
        },
        {
            name: 'Email',
            selector: row => row.a_email, 
            sortable: true,
        },
        {
            name: 'Actions',
            cell: row => (
                <>
                    <Button className="nudeclinebtn" onClick={() => handleDeleteButton(row)}>Delete</Button>
                </>
            ),
        },
    ];
    
    return (
        <>
            <div className="adminbox">
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
                        <div className="nutable">
                        <DataTable
                            columns={columns}
                            data={allAdmins} // Make sure this is correctly passed
                            paginationPerPage={13}
                            paginationRowsPerPageOptions={[5, 10, 13]}
                            pagination
                            highlightOnHover
                            onRowClicked={handleViewButton}
                        />
                        </div>

                        {/* View Modal */}
                        <Modal show={showViewModal} onHide={() => setShowViewModal(false)} className="plviewmodalwidth">
                            <Modal.Header closeButton>
                                <Modal.Title>View Admin Information</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                {selectedUserForView && (
                                    <div className="nuview-modal-content">
                                        <div className="nuleft-column"> 
                                            {/* <p>User ID: {selectedUserForView.a_id}</p> */}
                                            <p>Username: {selectedUserForView.a_username}</p>
                                            <p>First Name: {selectedUserForView.a_fname}</p>
                                            <p>Last Name: {selectedUserForView.a_lname}</p>
                                            <p>Middle Name: {selectedUserForView.a_mname}</p>
                                            <p>Email: {selectedUserForView.a_email}</p>
                                        </div>
                                        <div className="nuright-column">
                                            <p>Address: {selectedUserForView.a_add}</p>
                                            <p>Gender: {selectedUserForView.a_gender}</p>
                                            <p>Date of Birth: {selectedUserForView.a_birthdate}</p>
                                            <p>Phone Number: {selectedUserForView.a_contactnumber}</p>
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



                        {/* New Confirmation Modal */}
                        <Modal show={showConfirmationModal} onHide={() => setShowConfirmationModal(false)}>
                            <Modal.Header closeButton>
                                <Modal.Title>Confirm Add Admin</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <p>Are you sure you want to add {selectedStaff?.s_fname} {selectedStaff?.s_lname} as an admin?</p>
                                <p>Please ensure the email address below is correct before proceeding: <strong>Email: {formData.email}</strong></p>
                            </Modal.Body>
                            <Modal.Footer>
                                <Button variant="secondary" onClick={() => setShowConfirmationModal(false)}>
                                    Cancel
                                </Button>
                                <Button variant="primary" onClick={handleConfirmAddAdmin}>
                                    Confirm
                                </Button>
                            </Modal.Footer>
                        </Modal>


                    {/* STAFF SELECTION MODAL */}
                    <Modal show={selectedStaff !== null} onHide={() => setSelectedStaff(null)}>
                        <Modal.Header closeButton>
                            <Modal.Title>Assign Admin Credentials</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <form onSubmit={handleConfirmation}>
                                <div>
                                    <p>First Name: {formData.firstName}</p>
                                    <p>Middle Name: {formData.middleName}</p>
                                    <p>Last Name: {formData.lastName}</p>
                                    <p>Position: {formData.position}</p>
                                    <p>Gender: {formData.gender}</p>
                                    <p>Position: {formData.position}</p>
                                    <p>Email: {formData.email}</p>
                                    <p>Contact Number: {formData.contact}</p>
                                    <p>Address: {formData.address}</p>
                                    <p>Birthdate: {formData.birthdate}</p>
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
