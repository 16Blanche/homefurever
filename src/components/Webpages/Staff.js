import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";
import React, { useEffect, useState, useContext } from "react";
import Button from 'react-bootstrap/Button';
import './Homepage.css';
import TaskBar from "./TaskBar";
import NavigationBar from "./NavigationBar";
import Modal from 'react-bootstrap/Modal';
import DataTable from 'react-data-table-component';
import AuthContext from '../../context/AuthContext';
import config from '../config';

const convertToBase64 = (buffer) => {
    return btoa(
        new Uint8Array(buffer).reduce((data, byte) => data + String.fromCharCode(byte), '')
    );
};

const Staff = () => {
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);

    const [theUser, setTheUser] = useState({});
    const [allStaff, setAllStaff] = useState([]);
    const [transferUser, setTransferUser] = useState([]);

    const [showViewModal, setShowViewModal] = useState(false);
    const [selectedStaffForView, setSelectedStaffForView] = useState(null);
    const { id } = useParams();

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedUserForDelete, setSelectedUserForDelete] = useState(null);
    const [deleteReason, setDeleteReason] = useState("");

    const [showUpdateStaffModal, setShowUpdateStaffModal] = useState(false);
    const [selectedStaffForUpdate, setSelectedStaffForUpdate] = useState(null); 

    const [showLargeIDModal, setShowLargeIDModal] = useState(false);
    const [showAddStaffModal, setShowAddStaffModal] = useState(false); // State for Add Staff Modal

    const [formData, setFormData] = useState({
        s_fname: "",
        s_lname: "",
        s_mname: "",
        s_add: "",
        s_contactnumber: "",
        s_position: "",
        s_gender: "",
        s_birthdate: "",
        s_email: ""
    });
    
    const [formErrors, setFormErrors] = useState({});

    const handleViewButton = (staff) => {
        console.log("View Button Clicked");
        setSelectedStaffForView(staff); 
        setShowViewModal(true); 
    };

    const handleUpdateButton = (staff) => {
        setSelectedStaffForUpdate(staff);
        setFormData({
            s_fname: staff.s_fname,
            s_lname: staff.s_lname,
            s_mname: staff.s_mname,
            s_add: staff.s_add,
            s_contactnumber: staff.s_contactnumber,
            s_position: staff.s_position,
            s_gender: staff.s_gender,
            s_birthdate: staff.s_birthdate,
            s_email: staff.s_email
        });
        setShowUpdateStaffModal(true); 
    };
    
    
    useEffect(() => {
        axios.get(`${config.address}/api/staff/all`)
            .then((response) => {
                console.log('API Response:', response.data);
                setAllStaff(response.data.theStaff || []); 
            })
            .catch((err) => {
                console.log('Error fetching staff:', err);
                setAllStaff([]); 
            });
    }, []);
    
    useEffect(() => {
        axios.get(`${config.address}/api/staff/id/` + id)
            .then((response) => {
                console.log("Fetched User Data:", response.data.theStaff);
                setSelectedStaffForView(response.data.theStaff); 
            })
            .catch((err) => {
                console.log(err);
            });
    }, [id]); 

    const handleDeleteButton = (user) => {
        setSelectedUserForDelete(user);
        setShowDeleteModal(true);
    };

    const handleDeleteConfirm = (staff) => {
        axios
            .delete(`${config.address}/api/staff/delete/${staff._id}`, {
                data: { deleteReason }
            })
            .then((response) => {
                console.log(response.data);
                setAllStaff(allStaff.filter((s) => s._id !== staff._id)); 
                window.alert("Staff successfully removed.");
                setShowDeleteModal(false);
            })
            .catch((error) => {
                console.error("Error transferring staff to DeletedStaff schema:", error);
            });
    };    
    
    const handleDeleteReasonChange = (e) => {
        setDeleteReason(e.target.value);
    };

    const handleDeleteCancel = () => {
        setShowDeleteModal(false);
    };

    const handleAddStaff = () => {
        setFormData(initialFormData); 
        setFormErrors({}); 
        setShowAddStaffModal(true); 
    };
    

    const handleAddStaffModalClose = () => {
        setFormData(initialFormData); 
        setFormErrors({}); 
        setShowAddStaffModal(false); 
    };

    const initialFormData = {
        s_fname: "",
        s_lname: "",
        s_mname: "",
        s_add: "",
        s_contactnumber: "",
        s_position: "",
        s_gender: "",
        s_birthdate: "",
        s_email: ""
    };
    
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const validateForm = () => {
        const errors = {};

        if (!formData.s_fname) {
            errors.s_fname = "First name is required";
        }

        if (!formData.s_lname) {
            errors.s_lname = "Last name is required";
        }

        if (!formData.s_mname) {
            errors.s_mname = "Middle name is required";
        }

        if (!formData.s_add) {
            errors.s_add = "Address is required";
        }

        if (!formData.s_contactnumber) {
            errors.s_contactnumber = "Contact number is required";
        }

        if (!formData.s_position) {
            errors.s_position = "Position is required";
        }

        if (!formData.s_gender) {
            errors.s_gender = "Gender is required";
        }

        if (!formData.s_birthdate) {
            errors.s_birthdate = "Birthdate is required";
        }

        if (!formData.s_email) {
            errors.s_email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(formData.s_email)) {
            errors.s_email = "Email is invalid";
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            axios.post(`${config.address}/api/staff/new`, formData)
                .then((response) => {
                    console.log("Staff added:", response.data);
                    setAllStaff([...allStaff, response.data.savedStaff]);
                    window.alert("Staff successfully added.");
                    handleAddStaffModalClose(); 
                })
                .catch((err) => {
                    console.error("There was an error adding the staff!", err);
                });
        }
    };

    const handleUpdateFormSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            axios.put(`${config.address}/api/staff/update/${selectedStaffForUpdate._id}`, formData)
                .then((response) => {
                    console.log("Staff updated:", response.data);
                    const updatedStaffList = allStaff.map(staff =>
                        staff._id === selectedStaffForUpdate._id ? response.data.theUpdateStaff : staff
                    );
                    setAllStaff(updatedStaffList);
                    window.alert("Information successfully updated.");
                    setShowUpdateStaffModal(false);
                    alert('Staff updated successfully!');
                })
                .catch((err) => {
                    console.error("There was an error updating the staff!", err);
                });
        }
    };
    
    const handleAdmins = () => {
        if (user) {
          navigate('/admins');
        } else {
          navigate('/login');
        }
      };

      const handleHistory = () => {
        if (user) {
          navigate('/staff/history');
        } else {
          navigate('/login');
        }
      };

      const columns = [
        {
            name: 'User ID',
            selector: row => row.s_id,
            sortable: true,
        },
        {
            name: 'Last Name',
            selector: row => row.s_lname,
            sortable: true,
        },
        {
            name: 'First Name',
            selector: row => row.s_fname,
            sortable: true,
        },
        {
            name: 'Middle Initial',
            selector: row => row.s_mname,
            sortable: true,
        },
        {
            name: 'Position',
            selector: row => row.s_position,
            sortable: true,
        },
        {
            name: 'Actions',
            cell: row => (
                <>
                    <Button className="nuviewbtn" onClick={() => handleViewButton(row)}>View</Button>
                    <Button className="nuapprovebtn" onClick={() => handleUpdateButton(row)}>Edit</Button>
                    <Button className="nudeclinebtn" onClick={() => handleDeleteButton(row)}>Delete</Button>
                </>
            ),
        },
    ];

    return (
        <>
            <div className="staffbox">
                <div className="navbox">
                    <NavigationBar />
                </div>

                <div className="nubox2">
                    <TaskBar />

                    <div className="nubox3">
                        <div className="nubox4">
                            <h2 className="newuser">STAFF LIST</h2>
                            <input type="text" className="petsearch" placeholder="Search"/>
                            <Button className="staddstbtn" onClick={handleAddStaff}>
                                <p className="staddsttxt">+ Add Staff</p>
                            </Button>
                            <Button className="staddstbtn" onClick={handleAdmins}>
                                <p className="staddsttxt">Admins</p>
                            </Button>
                            <Button className="staddstbtn" onClick={handleHistory}>
                                <p className="staddsttxt">Activity Log</p>
                            </Button>
                        </div>
                        <div className="nutable">
                            <DataTable
                                columns={columns}
                                data={allStaff}
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
                                <Modal.Title>View Staff Information</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                {selectedStaffForView && (
                                    <div className="nuview-modal-content">
                                        <div className="nuleft-column"> 
                                            <p>Staff ID: {selectedStaffForView.s_id}</p>
                                            <p>Last Name: {selectedStaffForView.s_lname}</p>
                                            <p>First Name: {selectedStaffForView.s_fname}</p>
                                            <p>Middle Name: {selectedStaffForView.s_mname}</p>
                                            <p>Gender: {selectedStaffForView.s_gender}</p>
                                            <p>Position: {selectedStaffForView.s_position}</p>
                                        </div>
                                        <div className="nuright-column">
                                            <p>Address: {selectedStaffForView.s_add}</p>
                                            <p>Contact Number: {selectedStaffForView.s_contactnumber}</p>
                                            <p>Date of Birth: {selectedStaffForView.s_birthdate}</p>
                                            <p>Email: {selectedStaffForView.s_email}</p>
                                        </div>
                                    </div>
                                )}
                            </Modal.Body>
                        </Modal>

                        {/* Add Staff Modal */}
                        <Modal show={showAddStaffModal} onHide={handleAddStaffModalClose} className="custom-modal">
                            <Modal.Header closeButton>
                                <Modal.Title>Add Staff</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <form onSubmit={handleFormSubmit}>
                                    <div className="form-row">
                                        {/* First Column */}
                                        <div className="form-column">
                                            <div className="form-group">
                                                <label>First Name</label>
                                                <input 
                                                    type="text" 
                                                    className={`form-control ${formErrors.s_fname ? 'is-invalid' : ''}`} 
                                                    placeholder="Enter first name" 
                                                    name="s_fname" 
                                                    value={formData.s_fname} 
                                                    onChange={handleInputChange} 
                                                />
                                                {formErrors.s_fname && <div className="invalid-feedback">{formErrors.s_fname}</div>}
                                            </div>
                                            <div className="form-group">
                                                <label>Last Name</label>
                                                <input 
                                                    type="text" 
                                                    className={`form-control ${formErrors.s_lname ? 'is-invalid' : ''}`} 
                                                    placeholder="Enter last name" 
                                                    name="s_lname" 
                                                    value={formData.s_lname} 
                                                    onChange={handleInputChange} 
                                                />
                                                {formErrors.s_lname && <div className="invalid-feedback">{formErrors.s_lname}</div>}
                                            </div>
                                            <div className="form-group">
                                                <label>Middle Name</label>
                                                <input 
                                                    type="text" 
                                                    className={`form-control ${formErrors.s_mname ? 'is-invalid' : ''}`} 
                                                    placeholder="Enter middle name" 
                                                    name="s_mname" 
                                                    value={formData.s_mname} 
                                                    onChange={handleInputChange} 
                                                />
                                                {formErrors.s_mname && <div className="invalid-feedback">{formErrors.s_mname}</div>}
                                            </div>
                                            <div className="form-group">
                                                <label>Gender</label>
                                                <select 
                                                    className={`form-control ${formErrors.s_gender ? 'is-invalid' : ''}`} 
                                                    name="s_gender" 
                                                    value={formData.s_gender} 
                                                    onChange={handleInputChange}
                                                >
                                                    <option value="">-Select gender-</option>
                                                    <option value="Male">Male</option>
                                                    <option value="Female">Female</option>
                                                </select>
                                                {formErrors.s_gender && <div className="invalid-feedback">{formErrors.s_gender}</div>}
                                            </div>
                                            <div className="form-group">
                                                <label>Position</label>
                                                <input 
                                                    type="text" 
                                                    className={`form-control ${formErrors.s_position ? 'is-invalid' : ''}`} 
                                                    placeholder="Enter position" 
                                                    name="s_position" 
                                                    value={formData.s_position} 
                                                    onChange={handleInputChange} 
                                                />
                                                {formErrors.s_position && <div className="invalid-feedback">{formErrors.s_position}</div>}
                                            </div>
                                        </div>

                                        {/* Second Column */}
                                        <div className="form-column">
                                            <div className="form-group">
                                                <label>Address</label>
                                                <input 
                                                    type="text" 
                                                    className={`form-control ${formErrors.s_add ? 'is-invalid' : ''}`} 
                                                    placeholder="Enter address" 
                                                    name="s_add" 
                                                    value={formData.s_add} 
                                                    onChange={handleInputChange} 
                                                />
                                                {formErrors.s_add && <div className="invalid-feedback">{formErrors.s_add}</div>}
                                            </div>
                                            <div className="form-group">
                                                <label>Contact Number</label>
                                                <input 
                                                    type="text" 
                                                    className={`form-control ${formErrors.s_contactnumber ? 'is-invalid' : ''}`} 
                                                    placeholder="Enter contact number" 
                                                    name="s_contactnumber" 
                                                    value={formData.s_contactnumber} 
                                                    onChange={handleInputChange} 
                                                />
                                                {formErrors.s_contactnumber && <div className="invalid-feedback">{formErrors.s_contactnumber}</div>}
                                            </div>
                                            <div className="form-group">
                                                <label>Date of Birth</label>
                                                <input 
                                                    type="date" 
                                                    className={`form-control ${formErrors.s_birthdate ? 'is-invalid' : ''}`} 
                                                    name="s_birthdate" 
                                                    value={formData.s_birthdate} 
                                                    onChange={handleInputChange} 
                                                />
                                                {formErrors.s_birthdate && <div className="invalid-feedback">{formErrors.s_birthdate}</div>}
                                            </div>
                                            <div className="form-group">
                                                <label>Email</label>
                                                <input 
                                                    type="email" 
                                                    className={`form-control ${formErrors.s_email ? 'is-invalid' : ''}`} 
                                                    placeholder="Enter email" 
                                                    name="s_email" 
                                                    value={formData.s_email} 
                                                    onChange={handleInputChange} 
                                                />
                                                {formErrors.s_email && <div className="invalid-feedback">{formErrors.s_email}</div>}
                                            </div>
                                        </div>
                                    </div>
                                    <Button variant="primary" type="submit">
                                        Add Staff
                                    </Button>
                                </form>
                            </Modal.Body>
                        </Modal>


                        {/* Update Staff Modal */}
                        <Modal show={showUpdateStaffModal} onHide={() => setShowUpdateStaffModal(false)} className="custom-modal">
                            <Modal.Header closeButton>
                                <Modal.Title>Update Staff Information</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <form onSubmit={handleUpdateFormSubmit}>
                                    <div className="form-row">
                                        {/* First Column */}
                                        <div className="form-column">
                                            <div className="form-group">
                                                <label>First Name</label>
                                                <input 
                                                    type="text" 
                                                    className={`form-control ${formErrors.s_fname ? 'is-invalid' : ''}`} 
                                                    placeholder="Enter first name" 
                                                    name="s_fname" 
                                                    value={formData.s_fname} 
                                                    onChange={handleInputChange} 
                                                />
                                                {formErrors.s_fname && <div className="invalid-feedback">{formErrors.s_fname}</div>}
                                            </div>
                                            <div className="form-group">
                                                <label>Last Name</label>
                                                <input 
                                                    type="text" 
                                                    className={`form-control ${formErrors.s_lname ? 'is-invalid' : ''}`} 
                                                    placeholder="Enter last name" 
                                                    name="s_lname" 
                                                    value={formData.s_lname} 
                                                    onChange={handleInputChange} 
                                                />
                                                {formErrors.s_lname && <div className="invalid-feedback">{formErrors.s_lname}</div>}
                                            </div>
                                            <div className="form-group">
                                                <label>Middle Name</label>
                                                <input 
                                                    type="text" 
                                                    className={`form-control ${formErrors.s_mname ? 'is-invalid' : ''}`} 
                                                    placeholder="Enter middle name" 
                                                    name="s_mname" 
                                                    value={formData.s_mname} 
                                                    onChange={handleInputChange} 
                                                />
                                                {formErrors.s_mname && <div className="invalid-feedback">{formErrors.s_mname}</div>}
                                            </div>
                                            <div className="form-group">
                                                <label>Gender</label>
                                                <select 
                                                    className={`form-control ${formErrors.s_gender ? 'is-invalid' : ''}`} 
                                                    name="s_gender" 
                                                    value={formData.s_gender} 
                                                    onChange={handleInputChange}
                                                >
                                                    <option value="">-Select gender-</option>
                                                    <option value="Male">Male</option>
                                                    <option value="Female">Female</option>
                                                </select>
                                                {formErrors.s_gender && <div className="invalid-feedback">{formErrors.s_gender}</div>}
                                            </div>
                                            <div className="form-group">
                                                <label>Position</label>
                                                <input 
                                                    type="text" 
                                                    className={`form-control ${formErrors.s_position ? 'is-invalid' : ''}`} 
                                                    placeholder="Enter position" 
                                                    name="s_position" 
                                                    value={formData.s_position} 
                                                    onChange={handleInputChange} 
                                                />
                                                {formErrors.s_position && <div className="invalid-feedback">{formErrors.s_position}</div>}
                                            </div>
                                        </div>

                                        {/* Second Column */}
                                        <div className="form-column">
                                            <div className="form-group">
                                                <label>Address</label>
                                                <input 
                                                    type="text" 
                                                    className={`form-control ${formErrors.s_add ? 'is-invalid' : ''}`} 
                                                    placeholder="Enter address" 
                                                    name="s_add" 
                                                    value={formData.s_add} 
                                                    onChange={handleInputChange} 
                                                />
                                                {formErrors.s_add && <div className="invalid-feedback">{formErrors.s_add}</div>}
                                            </div>
                                            <div className="form-group">
                                                <label>Contact Number</label>
                                                <input 
                                                    type="text" 
                                                    className={`form-control ${formErrors.s_contactnumber ? 'is-invalid' : ''}`} 
                                                    placeholder="Enter contact number" 
                                                    name="s_contactnumber" 
                                                    value={formData.s_contactnumber} 
                                                    onChange={handleInputChange} 
                                                />
                                                {formErrors.s_contactnumber && <div className="invalid-feedback">{formErrors.s_contactnumber}</div>}
                                            </div>
                                            <div className="form-group">
                                                <label>Date of Birth</label>
                                                <input 
                                                    type="date" 
                                                    className={`form-control ${formErrors.s_birthdate ? 'is-invalid' : ''}`} 
                                                    name="s_birthdate" 
                                                    value={formData.s_birthdate} 
                                                    onChange={handleInputChange} 
                                                />
                                                {formErrors.s_birthdate && <div className="invalid-feedback">{formErrors.s_birthdate}</div>}
                                            </div>
                                            <div className="form-group">
                                                <label>Email</label>
                                                <input 
                                                    type="email" 
                                                    className={`form-control ${formErrors.s_email ? 'is-invalid' : ''}`} 
                                                    placeholder="Enter email" 
                                                    name="s_email" 
                                                    value={formData.s_email} 
                                                    onChange={handleInputChange} 
                                                />
                                                {formErrors.s_email && <div className="invalid-feedback">{formErrors.s_email}</div>}
                                            </div>
                                        </div>
                                    </div>
                                    <Button variant="primary" type="submit">
                                        Update Staff
                                    </Button>
                                </form>
                            </Modal.Body>
                        </Modal>

                        {/* Delete Modal */}
                        <Modal show={showDeleteModal} onHide={handleDeleteCancel}>
                        <Modal.Header closeButton>
                            <Modal.Title>Confirm Staff Deletion</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <p>Are you sure you want to delete this staff member? Their data will be transferred to the Deleted Staff archive.</p>
                            <div className="form-group">
                                <label>Reason for Deletion</label>
                                <select
                                    type="text"
                                    className="form-control"
                                    placeholder="Enter reason for deletion"
                                    value={deleteReason}
                                    onChange={handleDeleteReasonChange}
                                >
                                    <option value="">-Select Reason-</option>
                                    <option value="Resigned">Resigned</option>
                                    <option value="Terminated">Terminated</option>
                                    <option value="Retired">Retired</option>
                                    <option value="Deceased">Deceased</option>
                                    <option value="Data Correction">Data Correction</option>
                                </select>
                            </div>
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

export default Staff;
