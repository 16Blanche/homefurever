import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Button from 'react-bootstrap/Button';
import "./Homepage.css";
import NavigationBar from "./NavigationBar";
import TaskBar from "./TaskBar";
import Modal from 'react-bootstrap/Modal';
import DataTable from 'react-data-table-component';

 
const ArchivedPets =()=>{
    const navigate = useNavigate();
    const [allPets,setAllPets] =useState([]);
    const [filteredPets, setFilteredPets] = useState([]); 
    const [searchQuery, setSearchQuery] = useState('');

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
    
        console.log("Updated Pet Data:", updatedPet);
    
        axios.put(`http://54.206.91.60/api/archived/update/${selectedPet.ap_name}`, updatedPet)
            .then(response => {
                console.log("Update Response:", response);
                setAllPets(prevPets => prevPets.map(pet => pet.ap_name === updatedPet.ap_name ? updatedPet : pet));
                setShowEditModal(false);
                setSelectedPet(null);
            })
            .catch(err => {
                console.error("There was an error updating the pet!", err);
                if (err.response) {
                    console.error("Error Data:", err.response.data);
                }
            });
    };
    
      const handleDeleteButton = (pet) => {
        setSelectedPetForDelete(pet);
        setShowDeleteModal(true);
    };

      const handleDeleteConfirm = () => {
        axios.delete(`http://54.206.91.60/api/pet/delete/${selectedPetForDelete._id}`)
            .then((response) => {
                console.log('Pet deleted:', response.data);
                setAllPets(allPets.filter(pet => pet._id !== selectedPetForDelete._id));
                setShowDeleteModal(false);
            })
            .catch((error) => {
                console.error('There was an error!', error);
            });
    };

    useEffect(()=>{
        axios.get("http://54.206.91.60/api/archived/all")
        .then((response)=>{
            console.log(response.data.apets);
            setAllPets(response.data.apets);
        })
        .catch((err)=>{
            console.log(err);
        })
    },[])

    useEffect(() => {
        const results = allPets.filter(pet =>
            pet.ap_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            pet.ap_type.toLowerCase().includes(searchQuery.toLowerCase()) ||
            pet.ap_breed.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredPets(results);
    }, [searchQuery, allPets]); 

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleRestoreSubmit = (archivedPetId) => {
        axios.post(`http://54.206.91.60/api/pet/restore/${archivedPetId}`)
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
        axios.get("http://54.206.91.60/api/archived/" + apname)
            .then((response) => {
                console.log("Fetched Pet Data:", response.data.apets);
                setSelectedPetForView(response.data.apets); 

            })
            .catch((err) => {
                console.log(err);
            });
    }, [apname]); 

    const columns = [
        {
            name: 'Pet ID',
            selector: row => row.ap_id,
            sortable: true,
        },
        {
            name: 'Pet Name',
            selector: row => row.ap_name,
            sortable: true,
        },
        {
            name: 'Species',
            selector: row => row.ap_type,
            sortable: true,
        },
        {
            name: 'Gender',
            selector: row => row.ap_gender,
            sortable: true,
        },
        {
            name: 'Status',
            selector: row => row.ap_reason,
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
                    </div>
                </div>
            </div>
        </>
    )
}

export default ArchivedPets ;