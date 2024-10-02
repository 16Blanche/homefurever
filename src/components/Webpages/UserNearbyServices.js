import React, { useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import NavigationBar from './NavigationBar';
import axios from 'axios';

const NearbyServices = () => {
    const [service, setService] = useState([]);
    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [image, setImage] = useState(null);
    const [type, setType] = useState('');    
    const [showModal, setShowModal] = useState(false);
    const [errors, setErrors] = useState({});

    const validate = () => {
        const newErrors = {};
        if (!name) newErrors.name = "Service name is required.";
        if (!address) newErrors.address = "Google Maps link is required.";
        if (!(image instanceof File)) newErrors.image = "Image file is required.";
        if (!type) newErrors.type = "Service type is required.";
        return newErrors;
    };
    

    const handleAddService = async () => {
        const newErrors = validate();
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }
    
        const formData = new FormData();
        formData.append('ns_name', name); // Changed key to ns_name
        formData.append('ns_address', address); // Changed key to ns_address
        formData.append('ns_image', image); // This should remain the same
        formData.append('ns_type', type); // Changed key to ns_type
    
        console.log('FormData:', formData);
    
        try {
            const response = await axios.post('http://localhost:8000/api/service/new', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log('Service added:', response.data);
            setService([...service, response.data.savedService]);
            setName('');
            setAddress('');
            setImage('');
            setType('');
            setShowModal(false);
        } catch (error) {
            console.error('Error adding service:', error);
        }
    };
    function handleBoxClick() {
        // Handle the click event for the whole box
        console.log('Box clicked');
    }
    
    function handleEdit(event) {
        event.stopPropagation(); // Prevent the box click event
        console.log('Edit button clicked');
        // Add your edit logic here
    }
    
    function handleDelete(event) {
        event.stopPropagation(); // Prevent the box click event
        console.log('Delete button clicked');
        // Add your delete logic here
    }
    
    

    return (
        <div className='startbox1'>
            <div className='navbox'>
                <NavigationBar />
            </div>
            <div className='nearbybox2'>
                <h2 className='nstitle'>Nearby Services</h2>
                <Button onClick={() => setShowModal(true)}>Add a Service</Button>
            </div>
            <div class="service-box" onClick={handleBoxClick}>
                <div class="image-container">
                    <img src="path/to/image.jpg" alt="Pet Express" />
                </div>
                <div class="service-info">
                    <h3>Pet Express</h3>
                    <p>Mall of Asia, Pasay City</p>
                </div>
                <div class="action-buttons">
                    <Button class="edit-button" onClick={handleEdit}>✎</Button>
                    <Button class="delete-button" onClick={handleDelete}>🗑️</Button>
                </div>
            </div>




            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Add Veterinary Clinic</Modal.Title>
                </Modal.Header>
                <Modal.Body className='nearbymodal'>
                    <p>Service Name:</p>
                    <input
                        type='text'
                        placeholder='Service Name'
                        value={name}
                        onChange={(e) => {
                            setName(e.target.value);
                            setErrors((prev) => ({ ...prev, name: '' }));
                        }}
                        style={{ borderColor: errors.name ? 'red' : '' }}
                    />
                    {errors.name && <p className='error'>{errors.name}</p>}
                    
                    <p>Service Type:</p>
                    <select
                        value={type}
                        onChange={(e) => {
                            setType(e.target.value);
                            setErrors((prev) => ({ ...prev, type: '' }));
                        }}
                        style={{ borderColor: errors.type ? 'red' : '' }} 
                    >
                        <option value=''>Select Service Type</option>
                        <option value='veterinary'>Veterinary</option>
                        <option value='neutering'>Neutering</option>
                        <option value='hotel'>Hotel</option>
                        <option value='grooming'>Grooming</option>
                    </select>
                    {errors.type && <p className='error'>{errors.type}</p>}
                    
                    <p>Location Pin:</p>
                    <input
                        type='text'
                        placeholder='Google Maps Link'
                        value={address}
                        onChange={(e) => {
                            setAddress(e.target.value);
                            setErrors((prev) => ({ ...prev, address: '' }));
                        }}
                        style={{ borderColor: errors.address ? 'red' : '' }}
                    />
                    {errors.address && <p className='error'>{errors.address}</p>}

                    <p>Image:</p>
                    <input
                        type='file'
                        accept='image/*'
                        onChange={(e) => {
                            if (e.target.files.length > 0) {
                                const file = e.target.files[0];
                                setImage(file); 
                                setErrors((prev) => ({ ...prev, image: '' })); 
                            }
                        }}
                        style={{ borderColor: errors.image ? 'red' : '' }} 
                    />
                    {errors.image && <p className='error'>{errors.image}</p>}

                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={handleAddService}>Add Service</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default NearbyServices;
