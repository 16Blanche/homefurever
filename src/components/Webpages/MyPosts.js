import React, { useState, useEffect } from "react";
import { Table } from 'react-bootstrap';
import axios from 'axios';
import Modal from 'react-bootstrap/Modal';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Image from 'react-bootstrap/Image';
import NavigationBar from "./NavigationBar";
import TaskBar from "./TaskBar";
import './Homepage.css';
import config from '../config';
import { ChevronLeft, ChevronRight } from 'react-bootstrap-icons';

const MyPosts = () => {
    const [pets, setPets] = useState([]);
    const [selectedPet, setSelectedPet] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [showViewPostModal, setShowViewPostModal] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [showConfirmRemoveModal, setShowConfirmRemoveModal] = useState(false);
    const [allPets, setAllPets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [description, setDescription] = useState(""); 
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredPets, setFilteredPets] = useState([]);
    const token = localStorage.getItem('token');
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        axios.get(`${config.address}/api/pet/all`)
            .then((response) => {
                console.log(response.data.thePet);
                setAllPets(response.data.thePet);
                setPets(response.data.thePet.filter(pet => pet.p_status === 'For Adoption'));
                setFilteredPets(response.data.thePet.filter(pet => pet.p_status === 'For Adoption')); // Initialize filtered pets
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);

    const handleView = (pet) => {
        setSelectedPet(pet);
        setShowViewModal(true);
    };

    const handleCloseViewModal = () => {
        setShowViewModal(false);
        setSelectedPet(null);
    };

    const handlePost = () => {
        setShowConfirmModal(true);
    };

    const handleViewPost = (pet) => {
        setSelectedPet(pet);
        setShowViewPostModal(true);
    };

    const handleCloseViewPostModal = () => {
        setShowViewPostModal(false);
        setSelectedPet(null);
    };

    
    const handleConfirmPost = async () => {
        setLoading(true); 
        try {
            await axios.put(`${config.address}/api/pet/update-status/${selectedPet._id}`, {
                p_status: 'For Adoption',
                p_description: description,
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
    
            const updatedPets = allPets.map(pet =>
                pet._id === selectedPet._id ? { ...pet, p_status: 'For Adoption', p_description: description } : pet
            );
    
            setAllPets(updatedPets);
            window.alert("Pet successfully posted!");
            setPets(updatedPets.filter(pet => pet.p_status === 'For Adoption'));
            setShowConfirmModal(false);
            setShowViewModal(false);
            setShowAddModal(false);

            console.log(`Pet ID: ${selectedPet._id} has been posted for adoption with description: ${description}`);
        } catch (err) {
            console.error("Error posting pet for adoption:", err);
            window.alert("Failed to post pet for adoption. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleRemove = () => {
        setShowViewModal(false);
        setShowConfirmRemoveModal(true); 
    };

    const confirmRemove = async () => {
        setLoading(true); // Set loading to true
        try {
            await axios.put(`${config.address}/api/pet/update-status/${selectedPet._id}`, { p_status: 'None' }, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            
            const updatedPets = allPets.map(pet =>
                pet._id === selectedPet._id ? { ...pet, p_status: 'None' } : pet
            );
    
            setAllPets(updatedPets);
            setPets(updatedPets.filter(pet => pet.p_status === 'For Adoption'));
            window.alert("Post successfully removed.");
            setShowConfirmRemoveModal(false);
            setShowViewPostModal(false);
    
            // Log the removal action
            console.log(`Pet ID: ${selectedPet._id} has been removed from adoption.`);
        } catch (err) {
            console.error("Error removing pet from adoption:", err);
            window.alert("Failed to remove pet from adoption. Please try again.");
        } finally {
            setLoading(false); // Reset loading state
        }
    };

    const closeConfirmRemoveModal = () => {
        setShowConfirmRemoveModal(false); 
    };

    const handleSearchChange = (e) => {
        const query = e.target.value;
        setSearchQuery(query);

        const filtered = pets.filter(pet =>
            pet.p_name.toLowerCase().includes(query.toLowerCase()) ||
            pet.p_type.toLowerCase().includes(query.toLowerCase()) ||
            pet.p_breed.toLowerCase().includes(query.toLowerCase())
        );

        setFilteredPets(filtered);
    };

    const handlePreviousImage = () => {
        if (currentImageIndex > 0) {
            setCurrentImageIndex(currentImageIndex - 1);
        }
    };

    const handleNextImage = () => {
        if (selectedPet && currentImageIndex < selectedPet.pet_img.length - 1) {
            setCurrentImageIndex(currentImageIndex + 1);
        }
    };

    return (
        <>
            <div className="mpmainbox">
                <div className="navbox">
                    <NavigationBar />
                </div>
                <div className="box2">
                    <TaskBar />
                    <div className="mpbox3">
                        <div className="mpbox4">
                            <h2 className="mptitle">MY POSTS</h2>
                            <input
                                type="text"
                                className="mpsearch"
                                placeholder="Find a pet"
                                value={searchQuery}
                                onChange={handleSearchChange}
                            />
                            <Button className="mpaddbtn" type="submit" variant="success" onClick={() => setShowAddModal(true)}>+ Add Post</Button>
                        </div>

                        <div className="mpbox5">
                            <div className="mprow">
                            {filteredPets && filteredPets.map(pet => (
                                    <Button key={pet._id} className="pet-post" onClick={() => handleViewPost(pet)}>
                                        <div className="mpimage-container">
                                            {pet.pet_img && pet.pet_img.length > 0 && (
                                                <Image
                                                    src={`${config.address}${pet.pet_img[0]}`}
                                                    rounded
                                                    className="mpimage"
                                                />
                                            )}
                                        </div>
                                        <p className="mpname">{pet.p_name}</p>
                                        <p className="mpdesc">{pet.p_age} years old, {pet.p_gender} {pet.p_type}</p>
                                    </Button>
                                ))}
                            </div>
                        </div>

                        {/* Add Modal */}
                        <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
                            <Modal.Header closeButton>
                                <Modal.Title>Add New Pet</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <Table striped bordered hover>
                                    <thead>
                                        <tr>
                                            <th>Name</th>
                                            <th>Species</th>
                                            <th>Breed</th>
                                            <th>Gender</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {allPets && allPets.filter(pet => pet.p_status !== 'For Adoption' && pet.p_status.toLowerCase() !== 'adopted').map((element, index) => (
                                            <tr key={element._id} onClick={() => handleView(element)} style={{ cursor: 'pointer' }}>
                                                <td>{element.p_name}</td>
                                                <td>{element.p_type}</td>
                                                <td>{element.p_breed}</td>
                                                <td>{element.p_gender}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            </Modal.Body>
                        </Modal>

                        {/* View Modal */}
                        <Modal show={showViewModal} onHide={handleCloseViewModal}>
                            <Modal.Header closeButton>
                                <Modal.Title>Pet Information</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                {selectedPet && (
                                    <>
                                    {selectedPet.pet_img && selectedPet.pet_img.length > 0 && (
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
                                                    src={`${config.address}${selectedPet.pet_img[currentImageIndex]}`}
                                                    alt={`Pet Image ${currentImageIndex + 1}`}
                                                    className="pl-image"
                                                />

                                                <div className="pppagebtn">
                                                    <Button
                                                        onClick={handleNextImage}
                                                        disabled={currentImageIndex === selectedPet.pet_img.length - 1}
                                                        className="pagination-button-right"
                                                    >
                                                        <ChevronRight />
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                        <p><strong>Name:</strong> {selectedPet.p_name}</p>
                                        <p><strong>Species:</strong> {selectedPet.p_type}</p>
                                        <p><strong>Gender:</strong> {selectedPet.p_gender}</p>
                                        <p><strong>Age:</strong> {selectedPet.p_age}</p>
                                        <p><strong>Weight:</strong> {selectedPet.p_weight}</p>
                                        <p><strong>Breed:</strong> {selectedPet.p_breed}</p>
                                        <p><strong>Medical History:</strong> {selectedPet.p_medicalhistory}</p>
                                        <p><strong>Vaccines:</strong> {selectedPet.p_vaccines}</p>
                                        {/* Input box for adding description */}
                                        <p><strong>Description:</strong></p>
                                        <textarea
                                            className="form-control"
                                            rows="3"
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)} 
                                            placeholder="Enter description for the pet"
                                        />
                                        <Button variant="success" onClick={handlePost} className="mt-3">Post</Button>
                                    </>
                                )}
                            </Modal.Body>
                        </Modal>


                        {/* Confirm Post Modal */}
                        <Modal show={showConfirmModal} onHide={() => setShowConfirmModal(false)}>
                            <Modal.Header closeButton>
                                <Modal.Title>Confirm Post</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <p>Are you sure you want to post this pet up For Adoption?</p>
                                <Button variant="success" onClick={handleConfirmPost} className="me-2">Yes</Button>
                                <Button variant="secondary" onClick={() => setShowConfirmModal(false)}>No</Button>
                            </Modal.Body>
                        </Modal>

                        {/* View Post Modal */}
                        <Modal show={showViewPostModal} onHide={handleCloseViewPostModal}>
                            <Modal.Header closeButton>
                                <Modal.Title>Pet Information</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                {selectedPet && (
                                    <>
                                    {selectedPet.pet_img && selectedPet.pet_img.length > 0 && (
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
                                                    src={`${config.address}${selectedPet.pet_img[currentImageIndex]}`}
                                                    alt={`Pet Image ${currentImageIndex + 1}`}
                                                    className="pl-image"
                                                />

                                                <div className="pppagebtn">
                                                    <Button
                                                        onClick={handleNextImage}
                                                        disabled={currentImageIndex === selectedPet.pet_img.length - 1}
                                                        className="pagination-button-right"
                                                    >
                                                        <ChevronRight />
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                        <p><strong>Name:</strong> {selectedPet.p_name}</p>
                                        <p><strong>Species:</strong> {selectedPet.p_type}</p>
                                        <p><strong>Gender:</strong> {selectedPet.p_gender}</p>
                                        <p><strong>Age:</strong> {selectedPet.p_age}</p>
                                        <p><strong>Weight:</strong> {selectedPet.p_weight}</p>
                                        <p><strong>Breed:</strong> {selectedPet.p_breed}</p>
                                        <p><strong>Medical History:</strong> {selectedPet.p_medicalhistory}</p>
                                        <p><strong>Vaccines:</strong> {selectedPet.p_vaccines}</p>
                                        <p><strong>Description:</strong> {selectedPet.p_description}</p>
                                    </>
                                )}
                            </Modal.Body>
                            <Modal.Footer>
                                <Button variant="danger" onClick={handleRemove}>Remove</Button>
                            </Modal.Footer>
                        </Modal>

                        {/* Confirmation Modal for Remove Action */}
                        <Modal show={showConfirmRemoveModal} onHide={closeConfirmRemoveModal}>
                            <Modal.Header closeButton>
                                <Modal.Title>Confirm Remove</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <p>Are you sure you want to remove this post?</p>
                            </Modal.Body>
                            <Modal.Footer>
                                <Button variant="danger" onClick={confirmRemove}>Yes</Button>
                                <Button variant="secondary" onClick={closeConfirmRemoveModal}>No</Button>
                            </Modal.Footer>
                        </Modal>
                    </div>
                </div>
            </div>
        </>
    );
}

export default MyPosts;
