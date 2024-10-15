import axios from "axios";
import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Modal from 'react-bootstrap/Modal';
import Image from 'react-bootstrap/Image';
import Button from 'react-bootstrap/Button';
import PinkNavigationBar from "./PinkNavigationBar";
import "./Users.css";
import imgpholder from "./assets/vaccination.png";
import config from '../config'
import LoggedOutNavbar from "./LoggedOutNavBar";
import AuthContext from '../../context/AuthContext';


const LoggedOutBrowse = () => {
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

    const [randomServices, setRandomServices] = useState([]);

    const { user} = useContext(AuthContext);

    useEffect(() => {
        axios.get(`${config.address}/api/pet/all`)
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

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <div className="bpbox1">
                <div className="pnavbox">
                <LoggedOutNavbar/>
                </div>
                <div className="lobpbox2">
                    <div className="lobpboxx">
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
                                        {pet.pet_img && pet.pet_img.length > 0 && (
                                                <Image 
                                                src={`${config.address}${pet.pet_img[0]}`} 
                                                rounded 
                                                className="clickable-image" 
                                                loading="lazy"
                                            />
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
                                        src={`${config.address}${selectedPet.pet_img[0]}`}
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

                </div>
            </div>
        </>
    );
};

export default LoggedOutBrowse;
