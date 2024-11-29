import React, { useEffect, useState } from "react";
import { Modal, Button, Form, Image } from "react-bootstrap";
import NavigationBar from "./NavigationBar";
import TaskBar from "./TaskBar";
import axios from "axios";
import './Homepage.css';
import DataTable from 'react-data-table-component';
import config from '../config';

const PastAdoptions = () => {
    const [adoptions, setAdoptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [selectedAdoption, setSelectedAdoption] = useState(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const fetchPastAdoptions = async () => {
            try {
                const response = await axios.get(`${config.address}/api/adoption/past`);
                setAdoptions(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching completed adoptions:', error);
                setLoading(false);
            }
        };

        fetchPastAdoptions();
    }, []);

    const filteredAdoptions = adoptions.filter((adoption) => {
        const matchesSearchQuery = adoption.p_id?.p_name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatusFilter = statusFilter ? adoption.status === statusFilter : true;
        return matchesSearchQuery && matchesStatusFilter;
    });

    const handleRowClick = (row) => {
        setSelectedAdoption(row);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedAdoption(null);
    };

    const columns = [
        {
            name: 'ID',
            selector: row => row.a_id,
            sortable: true,
        },
        {
            name: 'Last Name',
            selector: row => row.v_id?.v_lname || '',
            sortable: true,
        },
        {
            name: 'First Name',
            selector: row => row.v_id?.v_fname || '',
            sortable: true,
        },
        {
            name: 'M.I',
            selector: row => row.v_id?.v_mname || '',
            sortable: true,
        },
        {
            name: 'Pet Name',
            selector: row => row.p_id?.p_name || '',
            sortable: true,
        },
        {
            name: 'Species',
            selector: row => row.p_id?.p_type || '',
            sortable: true,
        },
        {
            name: 'Gender',
            selector: row => row.p_id?.p_gender || '',
            sortable: true,
        },
        {
            name: 'Status',
            selector: row => row.status || '',
            sortable: true,
        },
    ];

    return (
        <>
            <div className="pastadoptbox">
                <div className="navbox">
                    <NavigationBar />
                </div>
                <div className="box2">
                    <TaskBar />
                    <div className="pastadoptbox2">
                        <div className="pastadoptbox4">
                            <h2 className="petlistings">ARCHIVED ADOPTIONS</h2>
                            <input
                                type="text"
                                className="petsearch"
                                placeholder="Search Adoption"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)} 
                            />
                            <Form.Select
                                className="pastddown"
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                aria-label="Filter by status"
                            >
                                <option value="">All</option>
                                <option value="failed">Failed</option>
                                <option value="rejected">Rejected</option>
                                <option value="complete">Complete</option>
                            </Form.Select>
                        </div>
                        <div className="pltable">
                            <DataTable
                                columns={columns}
                                data={filteredAdoptions} 
                                paginationPerPage={13}
                                paginationRowsPerPageOptions={[5, 10, 13]}
                                pagination
                                highlightOnHover
                                progressPending={loading}
                                onRowClicked={handleRowClick}
                            />
                        </div>
                    </div>
                </div>
            </div>
            {selectedAdoption && (
                <Modal show={showModal} onHide={handleCloseModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>Adoption Details</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <h4>Pet Information</h4>
                        {selectedAdoption.p_id?.pet_img && (
                            <Image
                                src={`${config.address}${selectedAdoption.p_id.pet_img[0]}`} // URL for the image
                                alt={selectedAdoption.p_id?.p_name}
                                fluid
                                className="adoption-pet-image"
                            />
                        )}
                        <p><strong>Name:</strong> {selectedAdoption.p_id?.p_name}</p>
                        <p><strong>Type:</strong> {selectedAdoption.p_id?.p_type}</p>
                        <p><strong>Age:</strong> {selectedAdoption.p_id?.p_age}</p>
                        <p><strong>Gender:</strong> {selectedAdoption.p_id?.p_gender}</p>
                        
                        <h4>Adopter Information</h4>
                        <p><strong>Full Name:</strong> {selectedAdoption.v_id?.v_fname} {selectedAdoption.v_id?.v_mname} {selectedAdoption.v_id?.v_lname}</p>
                        <p><strong>Occupation:</strong> {selectedAdoption.occupation || 'N/A'}</p>
                        <p><strong>Address:</strong> {selectedAdoption.v_id?.v_add}</p>
                        <p><strong>Email:</strong> {selectedAdoption.v_id?.v_emailadd}</p>
                        <p><strong>Contact Number:</strong> {selectedAdoption.v_id?.v_contactnumber}</p>

                        <h4>Household Information</h4>
                        <p><strong>Home Type:</strong> {selectedAdoption.home_type || 'N/A'}</p>
                        <p><strong>Years Resided:</strong> {selectedAdoption.years_resided || 'N/A'}</p>
                        <p><strong>Adults in Household:</strong> {selectedAdoption.adults_in_household || 'N/A'}</p>
                        <p><strong>Children in Household:</strong> {selectedAdoption.children_in_household || 'N/A'}</p>
                        <p><strong>Allergic to Pets:</strong> {selectedAdoption.allergic_to_pets ? 'Yes' : 'No'}</p>
                        <p><strong>Household Description:</strong> {selectedAdoption.household_description || 'N/A'}</p>
                    </Modal.Body>
                </Modal>
            )}
        </>
    );
};

export default PastAdoptions;
