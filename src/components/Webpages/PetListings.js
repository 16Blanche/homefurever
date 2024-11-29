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
import { Image } from "react-bootstrap";
import config from '../config';
import { ChevronLeft, ChevronRight } from 'react-bootstrap-icons';
import CreatableSelect from "react-select/creatable";

const vaccineOptions = [
    { value: "Rabies", label: "Rabies" },
    { value: "Parvovirus", label: "Parvovirus" },
    { value: "Distemper", label: "Distemper" },
    { value: "Adenovirus", label: "Adenovirus" },
    { value: "Leptospirosis", label: "Leptospirosis" },
    { value: "Bordetella", label: "Bordetella" },
    { value: "Parainfluenza", label: "Parainfluenza" },
    { value: "Lyme disease", label: "Lyme disease" },
    { value: "Feline Leukemia", label: "Feline Leukemia" },
    { value: "Calicivirus", label: "Calicivirus" }
];

const PetListings = () => {
    const navigate = useNavigate();
    const [allPets, setAllPets] = useState([]);
    const [filteredPets, setFilteredPets] = useState([]);

    const { pname } = useParams();
    const [thePet, setThePet] = useState({});
    const [page, setPage] = useState(0);

    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedPet, setSelectedPet] = useState(null);
    const [pets, setPets] = useState({
        p_medicalhistory: [], // Initialize arrays to avoid undefined issues
        p_vaccines: []
    });

    const [showViewModal, setShowViewModal] = useState(false);
    const [selectedPetForView, setSelectedPetForView] = useState(null);

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedPetForDelete, setSelectedPetForDelete] = useState(null);

    const [showArchiveModal, setShowArchiveModal] = useState(false);
    const [archiveReason, setArchiveReason] = useState("");
    const [selectedPetForArchive, setSelectedPetForArchive] = useState(null);

    const [searchQuery, setSearchQuery] = useState('');

    const { user, token } = useContext(AuthContext);

    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const [medicalHistoryInput, setMedicalHistoryInput] = useState("");
    const [selectedVaccine, setSelectedVaccine] = useState(null);

    const [otherArchiveReason, setOtherArchiveReason] = useState('');

    const handlePreviousImage = () => {
        if (currentImageIndex > 0) {
            setCurrentImageIndex(currentImageIndex - 1);
        }
    };

    const handleNextImage = () => {
        if (selectedPetForView && currentImageIndex < selectedPetForView.pet_img.length - 1) {
            setCurrentImageIndex(currentImageIndex + 1);
        }
    };

    const handleViewButton = (pet) => {
        setSelectedPetForView(pet);
        setShowViewModal(true);
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
        // Load medical history and vaccines as arrays, not strings
        setPets({
            p_medicalhistory: pet.p_medicalhistory || [], // Keep it as an array
            p_vaccines: pet.p_vaccines || []  // Keep it as an array
        });
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
            // Save medical history and vaccines as arrays
            p_medicalhistory: pets.p_medicalhistory,
            p_vaccines: pets.p_vaccines  
        };
    
        const token = localStorage.getItem('token');
    
        axios.put(`${config.address}/api/pet/update/${selectedPet._id}`, updatedPet, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })
            .then(response => {
                setAllPets(prevPets =>
                    prevPets.map(pet =>
                        pet._id === selectedPet._id ? { ...pet, ...updatedPet } : pet
                    )
                );
                window.alert("Pet successfully edited!");
                setShowEditModal(false);
                setSelectedPet(null);
            })
            .catch(err => {
                console.error("There was an error updating the pet!", err);
            });
    };
    

    const handleDeleteButton = (pet) => {
        setSelectedPetForDelete(pet);
        setShowDeleteModal(true);
    };

    const handleDeleteConfirm = () => {
        axios.delete(`${config.address}/api/pet/delete/${selectedPetForDelete._id}`)
            .then((response) => {
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
        const token = localStorage.getItem('token');
        const reasonToSend = archiveReason === 'Other' ? otherArchiveReason : archiveReason;
    
        axios.put(`${config.address}/api/pet/archive/${selectedPetForArchive._id}`, {
            reason: reasonToSend
        }, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })
            .then((response) => {
                setAllPets(prevPets => prevPets.map(pet =>
                    pet._id === selectedPetForArchive._id ? { ...pet, p_status: reasonToSend } : pet
                ));
                window.alert("Pet successfully archived!");
                handleArchiveModalClose();
            })
            .catch((err) => {
                console.error("Error archiving pet:", err);
                handleArchiveModalClose();
            });
    };
    

    const handleReasonChange = (event) => {
        setArchiveReason(event.target.value);
    };

    useEffect(() => {
        axios.get(`${config.address}/api/pet/all`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            }
        })
            .then((response) => {
                const fetchedPets = Array.isArray(response.data.thePet) ? response.data.thePet : [];
                setAllPets(fetchedPets);

                const filtered = fetchedPets.filter(pet =>
                    pet.p_status === 'none' || pet.p_status === 'For Adoption'
                );
                setFilteredPets(filtered);
            })
            .catch((err) => {
                console.error("Error fetching pet data:", err);
                setAllPets([]);
                setFilteredPets([]);
            });
    }, [token]);

    useEffect(() => {
        if (Array.isArray(allPets)) {
            const results = allPets.filter(pet =>
                (pet.p_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    pet.p_type.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    pet.p_breed.toLowerCase().includes(searchQuery.toLowerCase())) &&
                (pet.p_status === 'none' || pet.p_status === 'For Adoption')
            );
            setFilteredPets(results);
        }
    }, [searchQuery, allPets]);

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

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
                    {/* <Button className="plviewbtn" onClick={() => handleViewButton(row)}>View</Button> */}
                    <Button className="pleditbtn" onClick={() => handleEditButton(row)}>Edit</Button>
                    <Button className="pldeletebtn" onClick={() => handleArchiveModalShow(row)}>Delete</Button>
                </>
            ),
        },
    ];

    const handleAddMedicalHistory = (e) => {
        if (e.key === 'Enter' && medicalHistoryInput.trim() !== "") {
            const medicalHistoryArray = pets.p_medicalhistory || [];
            if (!medicalHistoryArray.includes(medicalHistoryInput)) {
                setPets({
                    ...pets,
                    p_medicalhistory: [...medicalHistoryArray, medicalHistoryInput] // Add new entry to array
                });
            }
            setMedicalHistoryInput(""); // Clear input after adding
            e.preventDefault(); // Prevent form submission on enter
        }
    };

    const handleRemoveMedicalHistory = (index) => {
        const updatedHistory = pets.p_medicalhistory?.filter((_, i) => i !== index) || [];
        setPets({ ...pets, p_medicalhistory: updatedHistory });
    };

    // Handle adding vaccines as tags
    const handleAddVaccine = (newValue) => {
        const vaccinesArray = pets.p_vaccines || [];
        if (newValue && !vaccinesArray.includes(newValue.value)) {
            setPets({
                ...pets,
                p_vaccines: [...vaccinesArray, newValue.value]
            });
        }
    };

    const handleRemoveVaccine = (index) => {
        const updatedVaccines = pets.p_vaccines?.filter((_, i) => i !== index) || [];
        setPets({ ...pets, p_vaccines: updatedVaccines });
    };

    return (
        <>
            <div className="petlistbox">
                <div className="navbox">
                    <NavigationBar />
                </div>

                <div className="petlistbox2">
                    <TaskBar />

                    <div className="petlistbox3">
                        <div className="petlistbox4">

                            <h2 className="petlistings">PET LIST</h2>

                            <input
                                type="text"
                                className="petsearch"
                                placeholder="Find a pet"
                                value={searchQuery}
                                onChange={handleSearchChange}
                            />

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
                                data={filteredPets}
                                paginationPerPage={13}
                                paginationRowsPerPageOptions={[5, 10, 13]}
                                pagination
                                highlightOnHover
                                onRowClicked={handleViewButton}
                            />
                        </div>

                        <Modal show={showViewModal} onHide={() => setShowViewModal(false)} className="plviewmodalwidth">
                        <Modal.Header closeButton>
                            <Modal.Title>View Pet Information</Modal.Title>
                        </Modal.Header>
                        <Modal.Body className="plviewmodal">
                            {selectedPetForView && (
                                <>
                                    {selectedPetForView.pet_img && selectedPetForView.pet_img.length > 0 && (
                                        <div className="pl-image-wrapper">
                                            <div className="pl-img-container">
                                                <div className="pppagebtn">
                                                    <Button
                                                        onClick={handlePreviousImage}
                                                        disabled={currentImageIndex === 0}
                                                        className="pagination-button-left"
                                                    >
                                                        <ChevronLeft />
                                                    </Button>
                                                </div>

                                                <Image
                                                    src={`${config.address}${selectedPetForView.pet_img[currentImageIndex]}`}
                                                    alt={`Pet Image ${currentImageIndex + 1}`}
                                                    className="pl-image"
                                                />

                                                <div className="pppagebtn">
                                                    <Button
                                                        onClick={handleNextImage}
                                                        disabled={currentImageIndex === selectedPetForView.pet_img.length - 1}
                                                        className="pagination-button-right"
                                                    >
                                                        <ChevronRight />
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    <div className="plvmodaldetbox">
                                        <div className="plvmodaldetbox2">
                                            <p>Pet ID: {selectedPetForView.p_id}</p>
                                            <p>Pet Name: {selectedPetForView.p_name}</p>
                                            <p>Species: {selectedPetForView.p_type}</p>
                                            <p>Breed: {selectedPetForView.p_breed}</p>
                                            <p>Age: {selectedPetForView.p_age}</p>
                                            <p>Gender: {selectedPetForView.p_gender}</p>
                                        </div>
                                        <div className="plvmodaldetbox2">
                                            <p>Weight: {selectedPetForView.p_weight}</p>
                                            {/* Use join to display the medical history array with commas */}
                                            <p>Medical History: {selectedPetForView.p_medicalhistory ? selectedPetForView.p_medicalhistory.join(", ") : 'None'}</p>
                                            <p>Vaccines: {selectedPetForView.p_vaccines ? selectedPetForView.p_vaccines.join(", ") : 'None'}</p>
                                        </div>
                                    </div>
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
                                        <Form.Control type="number" name="age" defaultValue={selectedPet?.p_age} required />
                                    </Form.Group>

                                    <Form.Group controlId="formGender" className="mt-2">
                                        <Form.Label>Gender</Form.Label>
                                        <Form.Control type="text" name="gender" defaultValue={selectedPet?.p_gender} required />
                                    </Form.Group>

                                    <Form.Group controlId="formWeight" className="mt-2">
                                        <Form.Label>Weight(kg)</Form.Label>
                                        <Form.Control type="number" name="weight" defaultValue={selectedPet?.p_weight} required />
                                    </Form.Group>

                                    <Form.Group controlId="formMedicalHistory" className="mt-2">
                                    <Form.Label>Medical History</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={medicalHistoryInput}
                                        placeholder="Add medical history and press enter"
                                        onChange={(e) => setMedicalHistoryInput(e.target.value)}
                                        onKeyPress={handleAddMedicalHistory}
                                    />
                                    <div className="nptags-container">
                                        {pets.p_medicalhistory && pets.p_medicalhistory.map((item, index) => (
                                            <span key={index} className="tag">
                                                {item} <Button variant="link" onClick={() => handleRemoveMedicalHistory(index)}>x</Button>
                                            </span>
                                        ))}
                                    </div>
                                </Form.Group>

                                <Form.Group controlId="formVaccines" className="mt-2">
                                    <Form.Label>Vaccines</Form.Label>
                                    <CreatableSelect
                                        options={vaccineOptions}
                                        onChange={handleAddVaccine}
                                        placeholder="Add or select vaccines"
                                        className="plvacc"
                                    />
                                    <div className="nptags-container">
                                        {pets.p_vaccines && pets.p_vaccines.map((item, index) => (
                                            <span key={index} className="tag">
                                                {item} <Button variant="link" onClick={() => handleRemoveVaccine(index)}>x</Button>
                                            </span>
                                        ))}
                                    </div>
                                </Form.Group>

                                    <Form.Group controlId="formPetImage" className="mt-2">
                                        <Form.Label>Pet Image</Form.Label>
                                        <Form.Control type="file" name="image" />
                                        {selectedPet?.p_image && (
                                            <img
                                                src={selectedPet?.p_image}
                                                alt="Pet Image"
                                                className="img-fluid mt-2"
                                                style={{ width: '150px' }}
                                            />
                                        )}
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
                                            <option value="Other">Other</option>
                                        </Form.Select>
                                    </Form.Group>

                                    {archiveReason === 'Other' && (
                                        <Form.Group controlId="otherArchiveReason" className="mt-3">
                                            <Form.Label>Please specify the reason</Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="Enter the reason"
                                                value={otherArchiveReason}
                                                onChange={(e) => setOtherArchiveReason(e.target.value)}
                                            />
                                        </Form.Group>
                                    )}
                                </Form>
                            </Modal.Body>
                            <Modal.Footer>
                                <Button variant="secondary" onClick={handleArchiveModalClose}>Close</Button>
                                <Button variant="primary" onClick={handleArchiveSubmit} disabled={archiveReason === '' || (archiveReason === 'Other' && otherArchiveReason === '')}>Archive</Button>
                            </Modal.Footer>
                        </Modal>
                    </div>
                </div>
            </div>
        </>
    );
}

export default PetListings;
