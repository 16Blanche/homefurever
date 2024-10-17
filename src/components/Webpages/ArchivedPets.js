import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Button from 'react-bootstrap/Button';
import "./Homepage.css";
import NavigationBar from "./NavigationBar";
import TaskBar from "./TaskBar";
import Modal from 'react-bootstrap/Modal';
import DataTable from 'react-data-table-component';
import { Image } from "react-bootstrap";
import config from '../config';
import React, { useContext } from "react";
import AuthContext from '../../context/AuthContext';
import { ChevronLeft, ChevronRight } from 'react-bootstrap-icons';

const ArchivedPets = () => {
    const navigate = useNavigate();
    const [allPets, setAllPets] = useState([]);
    const [filteredPets, setFilteredPets] = useState([]); 
    const [searchQuery, setSearchQuery] = useState('');

    const { apname } = useParams();
    const [selectedPetForView, setSelectedPetForView] = useState(null);
    const [showViewModal, setShowViewModal] = useState(false);

    const { user, token } = useContext(AuthContext);

    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const handleViewButton = (pet) => {
        console.log("View Button Clicked");
        setSelectedPetForView(pet);
        setShowViewModal(true);
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

            // Filter out pets with status 'none' or 'For Adoption'
            const filtered = fetchedPets.filter(pet => 
                pet.p_status !== 'none' && pet.p_status !== 'For Adoption'
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
        const results = allPets.filter(pet => {
            const nameMatches = pet.p_name && pet.p_name.toLowerCase().includes(searchQuery.toLowerCase());
            const typeMatches = pet.p_type && pet.p_type.toLowerCase().includes(searchQuery.toLowerCase());
            const breedMatches = pet.p_breed && pet.p_breed.toLowerCase().includes(searchQuery.toLowerCase());
            return (nameMatches || typeMatches || breedMatches) && 
                (pet.p_status !== 'none' && pet.p_status !== 'For Adoption'); // Include status check
        });
        setFilteredPets(results);
    }, [searchQuery, allPets]);

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    useEffect(() => {
        axios.get(`${config.address}/api/archived/` + apname)
            .then((response) => {
                setSelectedPetForView(response.data.pets); // Assuming the response contains pets with p_ fields
            })
            .catch((err) => {
                console.log(err);
            });
    }, [apname]); 

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
                </>
            ),
        },
    ];

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
                            <h2 className="petlistings">ARCHIVED PETS</h2>
                            <input
                                type="text"
                                className="petsearch"
                                placeholder="Find a pet"
                                value={searchQuery}
                                onChange={handleSearchChange}
                            />
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

                        {/* View Modal */}
                        <Modal show={showViewModal} onHide={() => setShowViewModal(false)} className="alviewmodalwidth">
                            <Modal.Header closeButton>
                                <Modal.Title>View Pet Information</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
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
                                            <p>Medical History: {selectedPetForView.p_medicalhistory}</p>
                                            <p>Vaccines: {selectedPetForView.p_vaccines}</p>
                                            <p>Status: {selectedPetForView.p_status}</p>
                                        </div>
                                        </div>
                                    </>
                                )}
                            </Modal.Body>
                        </Modal>
                    </div>
                </div>
            </div>
        </>
    );
}

export default ArchivedPets;
