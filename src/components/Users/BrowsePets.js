import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Modal from 'react-bootstrap/Modal';
import Image from 'react-bootstrap/Image';
import Button from 'react-bootstrap/Button';
import PinkNavigationBar from "./PinkNavigationBar";
import "./Users.css";
import imgpholder from "./assets/vaccination.png";

const convertToBase64 = (buffer) => {
    return btoa(
        new Uint8Array(buffer).reduce((data, byte) => data + String.fromCharCode(byte), '')
    );
};

const BrowsePets = () => {
    const [selectedPet, setSelectedPet] = useState(null);
    const [showViewPostModal, setShowViewPostModal] = useState(false);
    const [pets, setPets] = useState([]);
    const [filteredPets, setFilteredPets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedType, setSelectedType] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const petsPerPage = 10;
    const navigate = useNavigate();

    const [events, setEvents] = useState([]);

    useEffect(() => {
        axios.get("http://localhost:8000/api/pet/all")
            .then((response) => {
                const allPets = response.data.thePet.filter(pet => pet.p_status === 'For Adoption');
                setPets(allPets);
                setFilteredPets(allPets);
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    useEffect(() => {
        let updatedPets = pets;

        if (selectedType !== 'All') {
            updatedPets = updatedPets.filter(pet => pet.p_type === selectedType);
        }

        if (searchQuery) {
            updatedPets = updatedPets.filter(pet =>
                pet.p_name.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        setFilteredPets(updatedPets);
    }, [selectedType, searchQuery, pets]);

    // Pagination logic
    const indexOfLastPet = currentPage * petsPerPage;
    const indexOfFirstPet = indexOfLastPet - petsPerPage;
    const currentPets = filteredPets.slice(indexOfFirstPet, indexOfLastPet);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const totalPages = Math.ceil(filteredPets.length / petsPerPage);

    const handleViewProfile = (petId) => {
        navigate(`/pet/profile/${petId}`);
    };

    const handleTypeChange = (event) => {
        setSelectedType(event.target.value);
    };

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };

    // Fetch upcoming events
    useEffect(() => {
        axios.get('http://localhost:8000/api/events/all')  // Change the URL to match your API route
            .then((response) => {
                const upcomingEvents = response.data.theEvent.filter(event => new Date(event.e_date) >= new Date());
                setEvents(upcomingEvents.slice(0, 3)); // Show only 3 events
            })
            .catch((err) => {
                console.error('Error fetching events:', err);
            });
    }, []);

    const formatDate = (eventDate) => {
        const date = new Date(eventDate);
        const day = date.getDate();
        const dayOfWeek = date.toLocaleString('default', { weekday: 'long' });
        const month = date.toLocaleString('default', { month: 'short' });
        const year = date.getFullYear();
        const time = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        return { day, dayOfWeek, month, year, time };
    };

    return (
        <>
            <div className="bpbox1">
                <div className="pnavbox">
                    <PinkNavigationBar />
                </div>
                <div className="bpbox2">
                    <div className="bpboxx">
                        <div className="bpbox3">
                            <h1 className="bptitle">
                                <span className="bptitle1">Adopt</span>
                                <span className="bptitle2"> a Pet</span>
                            </h1>
                            <div className="search-bar">
                                <input
                                    type="text"
                                    placeholder="Find a pet"
                                    className="search-input"
                                    value={searchQuery}
                                    onChange={handleSearchChange}
                                />
                                <div className="bpsearchbtnbox">
                                    <Button
                                        variant="outline-secondary"
                                        className="search-button"
                                        onClick={() => {}}
                                    >
                                        <p>Search</p>
                                        <i className="fas fa-search"></i>
                                    </Button>
                                </div>
                            </div>
                            <p className="bpfiltername">Type:</p>
                            <select
                                id="pet-type"
                                value={selectedType}
                                onChange={handleTypeChange}
                                className="bpfilter-select"
                            >
                                <option value="All">All</option>
                                <option value="Cat">Cat</option>
                                <option value="Dog">Dog</option>
                            </select>
                        </div>

                        <div className="bpbox5">
                            <div className="pet-grid">
                                {currentPets && currentPets.map(pet => (
                                    <Button key={pet._id} className="pet-post" onClick={() => handleViewProfile(pet._id)}>
                                        <div className="mpimage-container">
                                            {pet.pet_img && (
                                                <Image src={`data:image/jpeg;base64,${convertToBase64(pet.pet_img.data)}`} rounded className="clickable-image" loading="lazy"/>
                                            )}
                                        </div>
                                        <p className="mpname">{pet.p_name}</p>
                                        <p className="mpdesc">{pet.p_age} years old, {pet.p_gender} {pet.p_type}</p>
                                    </Button>
                                ))}
                            </div>
                        </div>
                        {/* Pagination Controls */}
                        <div className="bppagination-container">
                                <button
                                    className="bppagination-button"
                                    onClick={() => paginate(currentPage - 1)}
                                    disabled={currentPage === 1}
                                >
                                    &lt; Prev
                                </button>

                                {[...Array(totalPages)].map((_, index) => (
                                    <button
                                        key={index + 1}
                                        onClick={() => paginate(index + 1)}
                                        className={`bppagination-button ${currentPage === index + 1 ? 'active' : ''}`}
                                    >
                                        {index + 1}
                                    </button>
                                ))}

                                <button
                                    className="bppagination-button"
                                    onClick={() => paginate(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                >
                                    Next &gt;
                                </button>
                            </div>
                    </div>

                    <Modal show={showViewPostModal} onHide={() => setShowViewPostModal(false)}>
                        <Modal.Header closeButton>
                            <Modal.Title>Pet Information</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            {selectedPet && (
                                <>
                                    {selectedPet.pet_img && (
                                        <Image
                                            src={`data:image/jpeg;base64,${convertToBase64(selectedPet.pet_img.data)}`}
                                            alt="Pet Image"
                                            rounded
                                            className="ulimg-preview"
                                        />
                                    )}
                                    <p><strong>Name:</strong> {selectedPet.p_name}</p>
                                    <p><strong>Species:</strong> {selectedPet.p_type}</p>
                                    <p><strong>Gender:</strong> {selectedPet.p_gender}</p>
                                    <p><strong>Age:</strong> {selectedPet.p_age}</p>
                                    <p><strong>Weight:</strong> {selectedPet.p_weight}</p>
                                    <p><strong>Breed:</strong> {selectedPet.p_breed}</p>
                                    <p><strong>Medical History:</strong> {selectedPet.p_medicalhistory}</p>
                                    <p><strong>Vaccines:</strong> {selectedPet.p_vaccines}</p>
                                </>
                            )}
                        </Modal.Body>
                    </Modal>
                    <div className="bpbox7">
                            <h2 className="bpbox7title">Events</h2>
                                {events.map(event => {
                                    const { day, dayOfWeek, month, year, time } = formatDate(event.e_date);
                                    return (
                                        <div className="bpeventscontainer" key={event._id}>
                                            <div className="bpeventsline" />
                                            <div className="bpeventsimgbox">
                                                <Image src={imgpholder} className="bpeventsimg"></Image>
                                            </div>
                                            <p className="bpeventsday">{day}</p>
                                            <div className="bpeventsbox4">
                                                <h2>{dayOfWeek}</h2>
                                                <h4>{month}, {year}</h4>
                                                <p>{time}</p>
                                                </div>
                                                <div className="bpeventsbox5">
                                                <h2>{event.e_title}</h2>
                                                <p>{event.e_description}</p>
                                            </div>
                                            
                                        </div>
                                    );
                                })}
                        </div>
                </div>
            </div>
        </>
    );
};

export default BrowsePets;
