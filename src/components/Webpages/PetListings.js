import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Button from 'react-bootstrap/Button';
import "./Homepage.css";
import NavigationBar from "./NavigationBar";
import TaskBar from "./TaskBar";
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import DeleteModal from "./DeleteModal";
import React, { useContext } from "react";
import DataTable from 'react-data-table-component';
import AuthContext from '../../context/AuthContext';


// Define the convertToBase64 function before using it
const convertToBase64 = (buffer) => {
    return btoa(
        new Uint8Array(buffer).reduce((data, byte) => data + String.fromCharCode(byte), '')
    );
};

const PetListings =()=>{
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const [allPets,setAllPets] =useState([]);
    const [filteredPets, setFilteredPets] = useState([]); 

    const {pname}=useParams();
    const [thePet,setThePet]=useState({});
    const [page,setPage] = useState(0);

    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedPet, setSelectedPet] = useState(null);
    const [pets, setPets] = useState(thePet);
    
    const [showViewModal, setShowViewModal] = useState(false);
    const [selectedPetForView, setSelectedPetForView] = useState(null);

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedPetForDelete, setSelectedPetForDelete] = useState(null);

    const [showArchiveModal, setShowArchiveModal] = useState(false);
    const [archiveReason, setArchiveReason] = useState("");
    const [selectedPetForArchive, setSelectedPetForArchive] = useState(null);
    

    const handleViewButton = (pet) => {
        console.log("View Button Clicked");
        setSelectedPetForView(pet); // Set selected pet data
        setShowViewModal(true); // Open view modal
    };

    const PostsClick = () => {
        if (user) {
          navigate('/posts');
        } else {
          navigate('/login');
        }
      };

    const handleEditButton = (pet) => {
        setSelectedPet(pet);
        setShowEditModal(true);
    };

    const handleEditSubmit = (e) => {
        e.preventDefault();
        const updatedPet = {
            p_name: e.target.elements.name.value,
            p_type: e.target.elements.type.value,
            p_breed: e.target.elements.breed.value,
            p_age: e.target.elements.age.value,
            p_gender: e.target.elements.gender.value,
            p_weight: e.target.elements.weight.value,
            p_medicalhistory: e.target.elements.medicalhistory.value,
            p_vaccines: e.target.elements.vaccines.value,
        };    
    
        console.log("Updated Pet Data:", updatedPet); // Log updatedPet for debugging
    
        axios.put(`http://localhost:8000/api/pet/update/${selectedPet._id}`, updatedPet)
            .then(response => {
                console.log("Update Response:", response); // Log response for debugging
                
                // Update the local state without refreshing the page
                setAllPets(prevPets => 
                    prevPets.map(pet => 
                        pet._id === selectedPet._id ? { ...pet, ...updatedPet } : pet
                    )
                );
                setShowEditModal(false); // Close the modal after the update
                setSelectedPet(null); // Clear the selected pet
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

    // const handleArchive = (petId) => {
    //     axios.delete(`http://localhost:8000/api/pet/delete/transfer/${petId}`)
    //         .then((response) => {
    //             setAllPets(allPets.filter(pet => pet._id !== petId));
    //             console.log(response.data.message);
    //         })
    //         .catch((err) => {
    //             console.log(err);
    //         });
    // };

    const handleArchiveModalShow = (pet) => {
        setSelectedPetForArchive(pet);
        setShowArchiveModal(true);
    };

    const handleArchiveModalClose = () => {
        setShowArchiveModal(false);
        setArchiveReason("");
        setSelectedPetForArchive(null);
    };

    const handleArchiveSubmit = () => {
        axios.delete(`http://localhost:8000/api/pet/delete/transfer/${selectedPetForArchive._id}/${archiveReason}`)
            .then((response) => {
                setAllPets(prevPets => prevPets.filter(pet => pet._id !== selectedPetForArchive._id));
                console.log(response.data.message);
                handleArchiveModalClose();
            })
            .catch((err) => {
                console.log(err);
                handleArchiveModalClose();
            });
    };
    
    

    const handleReasonChange = (event) => {
        setArchiveReason(event.target.value);
    };
      

    useEffect(()=>{
        axios.get("http://localhost:8000/api/pet/all")
        .then((response)=>{
            console.log(response.data.thePet);
            setAllPets(response.data.thePet);
        })
        .catch((err)=>{
            console.log(err);
        })
    },[])

    useEffect(() => {
        axios.delete('http://localhost:8000/api/pet/delete/:id')
            .then((response) => {
                console.log(response.data.thePet);
            }) 
            .catch((error) => {
                console.error('There was an error!', error);
            })
    }, []);

    useEffect(() => {
        axios.get("http://localhost:8000/api/pet/name/" + pname)
            .then((response) => {
                console.log("Fetched Pet Data:", response.data.thePet);
                setSelectedPetForView(response.data.thePet); // Update selected pet data

            })
            .catch((err) => {
                console.log(err);
            });
    }, [pname]); // Include pname in dependency array to re-fetch data when it changes

    const columns = [
            {
                name: 'Pet ID',
                selector: row => row.p_id,
                sortable: true,
            },
            {
                name: 'Pet Name',
                selector: row => row.p_name,
                sortable: true,
            },
            {
                name: 'Species',
                selector: row => row.p_type,
                sortable: true,
            },
            {
                name: 'Gender',
                selector: row => row.p_gender,
                sortable: true,
            },
            {
                name: 'Status',
                selector: row => row.p_status,
                sortable: true,
            },
            {
                name: 'Actions',
                cell: row => (
                    <>
                        <Button className="plviewbtn" onClick={() => handleViewButton(row)}>View</Button>
                        <Button className="pleditbtn" onClick={() => handleEditButton(row)}>Edit</Button>
                        <Button className="pldeletebtn" onClick={() => handleArchiveModalShow(row)}>Delete</Button>
                    </>
                ),
            },
        ];

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

                        <h2 className="petlistings">PET LIST</h2>
                        <input type="text" className="petsearch" placeholder="Find a pet"/>

                        <form action="/pet/new" className="plbutton">
                            <Button className="plbtntext" type="submit">+ Add Pet</Button>
                        </form>

                        <form action="/pet/archived" className="plbutton2">
                            <Button className="plbtntext" type="submit">Archived Pets</Button>
                        </form>

                        <form action="/posts" className="plbutton2">
                            <Button className="plbtntext" onClick={PostsClick}>My Posts</Button>
                        </form>
                        </div>
                        <div className="pltable">
                            <DataTable
                                columns={columns}
                                data={allPets}
                                paginationPerPage={13}
                                paginationRowsPerPageOptions={[5, 10, 13]}
                                pagination
                                highlightOnHover
                                onRowClicked={handleViewButton}
                            />
                        </div>

                        {/* View Modal */}
                        <Modal show={showViewModal} onHide={() => setShowViewModal(false)}>
                            <Modal.Header closeButton>
                                <Modal.Title>View Pet Information</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                {selectedPetForView && (
                                    <>
                                        {selectedPetForView.pet_img && (
                                        <img
                                            src={`data:image/jpeg;base64,${convertToBase64(selectedPetForView.pet_img.data)}`}
                                            alt="Pet Image"
                                            className="ulimg-preview"
                                        />
                                        )}
                                        <p>Pet ID: {selectedPetForView.p_id}</p>
                                        <p>Pet Name: {selectedPetForView.p_name}</p>
                                        <p>Species: {selectedPetForView.p_type}</p>
                                        <p>Breed: {selectedPetForView.p_breed}</p>
                                        <p>Age: {selectedPetForView.p_age}</p>
                                        <p>Gender: {selectedPetForView.p_gender}</p>
                                        <p>Weight: {selectedPetForView.p_weight}</p>
                                        <p>Medical History: {selectedPetForView.p_medicalhistory}</p>
                                        <p>Vaccines: {selectedPetForView.p_vaccines}</p>
                                    </>
                                )}
                            </Modal.Body>
                        </Modal>

                        {/* Edit Modal */}
                        <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
                            <Modal.Header closeButton>
                                <Modal.Title>Edit Pet Information</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <Form onSubmit={handleEditSubmit}>
                                    <Form.Group controlId="formName">
                                        <Form.Label>Name</Form.Label>
                                        <Form.Control type="text" name="name" defaultValue={selectedPet?.p_name} required />
                                    </Form.Group>
                                    <Form.Group controlId="formType" className="mt-2">
                                        <Form.Label>Type</Form.Label>
                                        <Form.Control type="text" name="type" defaultValue={selectedPet?.p_type} required />
                                    </Form.Group>
                                    <Form.Group controlId="formBreed" className="mt-2">
                                        <Form.Label>Breed</Form.Label>
                                        <Form.Control type="text" name="breed" defaultValue={selectedPet?.p_breed} required />
                                    </Form.Group>
                                    <Form.Group controlId="formAge" className="mt-2">
                                        <Form.Label>Age</Form.Label>
                                        <Form.Control type="text" name="age" defaultValue={selectedPet?.p_age} required />
                                    </Form.Group>
                                    <Form.Group controlId="formGender" className="mt-2">
                                        <Form.Label>Gender</Form.Label>
                                        <Form.Control type="text" name="gender" defaultValue={selectedPet?.p_gender} required />
                                    </Form.Group>
                                    <Form.Group controlId="formWeight" className="mt-2">
                                        <Form.Label>Weight(kg)</Form.Label>
                                        <Form.Control type="text" name="weight" defaultValue={selectedPet?.p_weight} required />
                                    </Form.Group>
                                    <Form.Group controlId="formMedicalHistory" className="mt-2">
                                        <Form.Label>Medical History</Form.Label>
                                        <Form.Control type="text" name="medicalhistory" defaultValue={selectedPet?.p_medicalhistory} required />
                                    </Form.Group>
                                    <Form.Group controlId="formVaccines" className="mt-2">
                                        <Form.Label>Vaccines</Form.Label>
                                        <Form.Control type="text" name="vaccines" defaultValue={selectedPet?.p_vaccines} required />
                                    </Form.Group>
                                    <Button variant="primary" type="submit" className="mt-3">Save Changes</Button>
                                </Form>
                            </Modal.Body>
                        </Modal>

                        <DeleteModal
                                show={showDeleteModal}
                                onHide={handleDeleteCancel}
                                onDelete={handleDeleteConfirm}
                        />

                         {/* Archive Modal */}
                        <Modal show={showArchiveModal} onHide={handleArchiveModalClose}>
                            <Modal.Header closeButton>
                                <Modal.Title>Archive Pet</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <Form>
                                    <Form.Group>
                                        <Form.Label className="plformq">Are you sure you want to archive {selectedPetForArchive?.p_name}?</Form.Label>
                                    </Form.Group>
                                    <Form.Group controlId="archiveReason">
                                        <Form.Label>Reason for Archiving</Form.Label>
                                         <Form.Select value={archiveReason} onChange={handleReasonChange} placeholder="Select a reason" required>
                                         <option value="">-Select a reason-</option>
                                            <option value="Adopted">Adopted</option>
                                            <option value="Euthanized">Euthanized</option>
                                            <option value="Passed Away">Passed Away</option>
                                        </Form.Select>      
                                    </Form.Group>
                                </Form>
                            </Modal.Body>
                            <Modal.Footer>
                                <Button variant="secondary" onClick={handleArchiveModalClose}>Close</Button>
                                <Button variant="primary" onClick={handleArchiveSubmit}>Archive</Button>
                            </Modal.Footer>
                        </Modal>


                    </div>
                </div>
            </div>
        </>
    )
}

export default PetListings ;