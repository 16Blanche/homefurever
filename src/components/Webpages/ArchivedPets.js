import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Homepage from "./Homepage";
import Button from 'react-bootstrap/Button';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import "./Homepage.css";
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import NavigationBar from "./NavigationBar";
import TaskBar from "./TaskBar";
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import DeleteModal from "./DeleteModal";
import { FormGroup } from "react-bootstrap";

 
const ArchivedPets =()=>{
    const navigate = useNavigate();
    const [allPets,setAllPets] =useState([]);
    const [filteredPets, setFilteredPets] = useState([]); 

    const {apname}=useParams();
    const [thePet,setThePet]=useState({});
    const [page,setPage] = useState(0);

    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedPet, setSelectedPet] = useState(null);
    const [pets, setPets] = useState(thePet);
    
    const [showViewModal, setShowViewModal] = useState(false);
    const [selectedPetForView, setSelectedPetForView] = useState(null);

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedPetForDelete, setSelectedPetForDelete] = useState(null);

    const [selectedArchivedPet, setSelectedArchivedPet] = useState(null);

    const [showRestoreModal, setShowRestoreModal] = useState(false);

    const handleViewButton = (pet) => {
        console.log("View Button Clicked");
        setSelectedPetForView(pet); // Set selected pet data
        setShowViewModal(true); // Open view modal
    };

    const handleEditButton = (pet) => {
        setSelectedPet(pet);
        setShowEditModal(true);
    };

    const handleEditSubmit = (e) => {
        e.preventDefault();
        const updatedPet = {
            ...selectedPet,
            ap_name: e.target.elements.name.value,
            ap_type: e.target.elements.type.value,
            ap_breed: e.target.elements.breed.value,
            ap_age: e.target.elements.age.value,
            ap_gender: e.target.elements.gender.value,
            ap_weight: e.target.elements.weight.value,
            ap_medicalhistory: e.target.elements.medicalhistory.value,
            ap_vaccines: e.target.elements.vaccines.value,
        };
    
        console.log("Updated Pet Data:", updatedPet); // Log updatedPet for debugging
    
        axios.put(`http://localhost:8000/api/archived/update/${selectedPet.ap_name}`, updatedPet)
            .then(response => {
                console.log("Update Response:", response); // Log response for debugging
                setAllPets(prevPets => prevPets.map(pet => pet.ap_name === updatedPet.ap_name ? updatedPet : pet));
                setShowEditModal(false);
                setSelectedPet(null);
            })
            .catch(err => {
                console.error("There was an error updating the pet!", err);
                if (err.response) {
                    console.error("Error Data:", err.response.data); // Log error response data
                }
            });
    };
    
      const handleDeleteButton = (pet) => {
        setSelectedPetForDelete(pet);
        setShowDeleteModal(true);
    };

      const handleDeleteConfirm = () => {
        axios.delete(`http://localhost:8000/api/pet/delete/${selectedPetForDelete._id}`)
            .then((response) => {
                console.log('Pet deleted:', response.data);
                setAllPets(allPets.filter(pet => pet._id !== selectedPetForDelete._id));
                setShowDeleteModal(false);
            })
            .catch((error) => {
                console.error('There was an error!', error);
            });
    };

    const handleDeleteCancel = () => {
        setShowDeleteModal(false);
    };

      

    useEffect(()=>{
        axios.get("http://localhost:8000/api/archived/all")
        .then((response)=>{
            console.log(response.data.apets);
            setAllPets(response.data.apets);
        })
        .catch((err)=>{
            console.log(err);
        })
    },[])

    const handleRestoreSubmit = (archivedPetId) => {
        axios.post(`http://localhost:8000/api/pet/restore/${archivedPetId}`)
            .then((response) => {
                setAllPets([...allPets, response.data.restoredPet]);
                console.log(response.data.message);
                handleRestoreModalClose();
            })
            .catch((err) => {
                console.log(err);
                handleRestoreModalClose();
            });
    };

    const handleRestoreModalOpen = (archivedPet) => {
        setSelectedArchivedPet(archivedPet);
        setShowRestoreModal(true);
    };

    const handleRestoreModalClose = () => {
        setShowRestoreModal(false);
        setSelectedArchivedPet(null);
    };

    useEffect(() => {
        axios.get("http://localhost:8000/api/archived/" + apname)
            .then((response) => {
                console.log("Fetched Pet Data:", response.data.apets);
                setSelectedPetForView(response.data.apets); // Update selected pet data

            })
            .catch((err) => {
                console.log(err);
            });
    }, [apname]); // Include pname in dependency array to re-fetch data when it changes
 

    return(
        <>
        <div className="petlistbox">

                <div className="navbox">
                <NavigationBar/>
                </div>

                <div className="petlistbox2">
                    <TaskBar/>

                    <div className="petlistbox3">
                    <div className="petlistbox4">

                        <h2 className="petlistings">ARCHIVED PETS</h2>
                        <input type="text" className="petsearch" placeholder="Find a pet"/>
                        </div>
                        
                        
                        <table className="pltable">
                            <thead>
                                <tr className="pltheader">
                                    <th>Pet ID</th>
                                    <th>Pet Name</th>
                                    <th>Species</th>
                                    <th>Gender</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                            {allPets.map((element,index)=>{
                        return (<tr key={element._id}>

                                    <td>{element.ap_id}</td>
                                    <td>{element.ap_name}</td>
                                    <td>{element.ap_type}</td>
                                    <td>{element.ap_gender}</td>
                                    <td>
                                        <Button className="plviewbtn" onClick={() => handleViewButton(element)}>View</Button>
                                        {/* <Button className="pleditbtn" onClick={() => handleEditButton(element)}>Edit</Button>
                                        <Button className="pldeletebtn" onClick={() => handleRestoreModalOpen(element)}>Restore</Button> */}
                                    </td>
 
                                </tr>)    
                    })}    
                            </tbody>
                        </table>

                        {/* View Modal */}
                        <Modal show={showViewModal} onHide={() => setShowViewModal(false)}>
                            <Modal.Header closeButton>
                                <Modal.Title>View Pet Information</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                {selectedPetForView && (
                                    <>
                                        <p>Pet ID: {selectedPetForView.ap_id}</p>
                                        <p>Pet Name: {selectedPetForView.ap_name}</p>
                                        <p>Species: {selectedPetForView.ap_type}</p>
                                        <p>Breed: {selectedPetForView.ap_breed}</p>
                                        <p>Age: {selectedPetForView.ap_age}</p>
                                        <p>Gender: {selectedPetForView.ap_gender}</p>
                                        <p>Weight: {selectedPetForView.ap_weight}</p>
                                        <p>Medical History: {selectedPetForView.ap_medicalhistory}</p>
                                        <p>Vaccines: {selectedPetForView.ap_vaccines}</p>
                                        <p>Archive Reason: {selectedPetForView.ap_reason}</p>
                                    </>
                                )}
                            </Modal.Body>
                        </Modal>

                        {/* Edit Modal */}
                        {/* <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
                            <Modal.Header closeButton>
                                <Modal.Title>Edit Pet Information</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <Form onSubmit={handleEditSubmit}>
                                    <Form.Group controlId="formName">
                                        <Form.Label>Name</Form.Label>
                                        <Form.Control type="text" name="name" defaultValue={selectedPet?.ap_name} required />
                                    </Form.Group>
                                    <Form.Group controlId="formType" className="mt-2">
                                        <Form.Label>Type</Form.Label>
                                        <Form.Control type="text" name="type" defaultValue={selectedPet?.ap_type} required />
                                    </Form.Group>
                                    <Form.Group controlId="formBreed" className="mt-2">
                                        <Form.Label>Breed</Form.Label>
                                        <Form.Control type="text" name="breed" defaultValue={selectedPet?.ap_breed} required />
                                    </Form.Group>
                                    <Form.Group controlId="formAge" className="mt-2">
                                        <Form.Label>Age</Form.Label>
                                        <Form.Control type="text" name="age" defaultValue={selectedPet?.ap_age} required />
                                    </Form.Group>
                                    <Form.Group controlId="formGender" className="mt-2">
                                        <Form.Label>Gender</Form.Label>
                                        <Form.Control type="text" name="gender" defaultValue={selectedPet?.ap_gender} required />
                                    </Form.Group>
                                    <Form.Group controlId="formWeight" className="mt-2">
                                        <Form.Label>Weight(kg)</Form.Label>
                                        <Form.Control type="text" name="weight" defaultValue={selectedPet?.ap_weight} required />
                                    </Form.Group>
                                    <Form.Group controlId="formMedicalHistory" className="mt-2">
                                        <Form.Label>Medical History</Form.Label>
                                        <Form.Control type="text" name="medicalhistory" defaultValue={selectedPet?.ap_medicalhistory} required />
                                    </Form.Group>
                                    <Form.Group controlId="formVaccines" className="mt-2">
                                        <Form.Label>Vaccines</Form.Label>
                                        <Form.Control type="text" name="vaccines" defaultValue={selectedPet?.ap_vaccines} required />
                                    </Form.Group>
                                    <Button variant="primary" type="submit" className="mt-3">Save Changes</Button>
                                </Form>
                            </Modal.Body>
                        </Modal> */}

                        {/* <DeleteModal
                                show={showDeleteModal}
                                onHide={handleDeleteCancel}
                                onDelete={handleDeleteConfirm}
                        /> */}

                        {/* <Modal show={showRestoreModal} onHide={() => setShowRestoreModal(false)}>
                            <Modal.Header closeButton>
                                <Modal.Title>Restore Pet</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <FormGroup>Are you sure you want to restore this pet?</FormGroup>
                                <FormGroup>
                                    <button onClick={handleRestoreSubmit} className="mt-3">Yes</button>
                                    <button onClick={handleRestoreModalClose} className="mt-3">No</button>
                                </FormGroup>
                                
                            </Modal.Body>
                        </Modal> */}


                    </div>
                </div>
            </div>
        </>
    )
}

export default ArchivedPets ;