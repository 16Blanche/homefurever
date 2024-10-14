import React, { useState, useEffect, useContext } from 'react';
import { Button, Modal } from 'react-bootstrap';
import NavigationBar from './NavigationBar';
import axios from 'axios';
import Image from 'react-bootstrap/Image';
import { PencilSquare, Trash } from 'react-bootstrap-icons';
import './Homepage.css';
import AuthContext from '../../context/AuthContext';
import config from '../config';

const NearbyServices = () => {
    const [services, setServices] = useState([]);
    const [activeButton, setActiveButton] = useState('veterinary');
    const [clinics, setClinics] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [service, setService] = useState([]);
    const [currentService, setCurrentService] = useState({});
    const [mapSrc, setMapSrc] = useState('https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d15449.113445468536!2d120.98809709258094!3d14.526063825874626!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3397c98aa3066ca5%3A0xe376b7446d803df1!2sPasay%20City%20Animal%20Shelter%2FClinic!5e0!3m2!1sen!2sph!4v1727937997645!5m2!1sen!2sph');


    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [pin, setPin] = useState('');
    const [image, setImage] = useState(null);
    const [type, setType] = useState('');    

    const [errors, setErrors] = useState({});

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [serviceToDelete, setServiceToDelete] = useState(null);

    const [searchQuery, setSearchQuery] = useState('');

    const { user, token } = useContext(AuthContext);

    const validate = () => {
        const newErrors = {};
        if (!name) newErrors.name = "Service name is required.";
        if (name && name.length > 25) newErrors.name = "Service name cannot exceed 25 characters.";
        if (!address) newErrors.address = "Street Address is required.";
        if (address && address.length > 55) newErrors.address = "Street Address cannot exceed 55 characters.";
        if (!pin) newErrors.pin = "Google Maps link is required.";
        if (!(image instanceof File)) newErrors.image = "Image file is required.";
        if (!type) newErrors.type = "Service type is required.";
        return newErrors;
    };
    
    const validateEdit = () => {
        const editErrors = {};
        if (!name) editErrors.name = "Service name is required.";
        if (name && name.length > 25) editErrors.name = "Service name cannot exceed 25 characters.";
        if (!address) editErrors.address = "Street Address is required.";
        if (address && address.length > 55) editErrors.address = "Street Address cannot exceed 55 characters.";
        if (!pin) editErrors.pin = "Google Maps link is required.";
        if (!type) editErrors.type = "Service type is required.";
        if (!image && !currentService.ns_image) {
            editErrors.image = "Image file is required.";
        }
        return editErrors;
    };    

    const handleAddService = async () => {
        const newErrors = validate();
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }
    
        const formData = new FormData();
        formData.append('ns_name', name);
        formData.append('ns_address', address);
        formData.append('ns_image', image); // Assuming image will be in file format
        formData.append('ns_type', type);
        formData.append('ns_pin', pin);
    
        try {
            const token = localStorage.getItem('token'); // Retrieve the token
            console.log('Token:', token); // Check if the token is retrieved correctly
    
            const response = await axios.post(`${config.address}/api/service/new`, formData, {
                headers: {
                    'Authorization': `Bearer ${token}`, // Include authorization token
                    'Accept': 'application/json',
                },
            });
    
            setServices([...services, response.data.savedService]);
            resetForm();
            setShowModal(false);
            window.location.reload();
        } catch (error) {
            console.error('Error adding service:', error);
            alert('Failed to add service. Please try again later.'); // User-friendly error message
        }
    };
    
    

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const response = await axios.get(`${config.address}/api/service/all`);
                setServices(response.data);

                const veterinaryClinics = response.data.filter(service => service.ns_type === 'veterinary');
                setClinics(veterinaryClinics);
            } catch (error) {
                console.error('Error fetching services:', error);
            }
        };
        fetchServices();
    }, []);

    const handleEditService = async () => {
        const editErrors = validateEdit();
        if (Object.keys(editErrors).length > 0) {
            setErrors(editErrors);
            return;
        }
    
        const formData = new FormData();
        formData.append('ns_name', name);
        formData.append('ns_address', address);
        formData.append('ns_pin', pin);
        formData.append('ns_type', type);
    
        // Check if image is a File object and append accordingly
        if (image instanceof File) {
            formData.append('ns_image', image);
        } else {
            formData.append('ns_image', currentService.ns_image); 
        }
    
        try {
            const token = localStorage.getItem('token'); // Retrieve the token
    
            const response = await axios.put(`${config.address}/api/service/update/${currentService._id}`, formData, {
                headers: {
                    'Authorization': `Bearer ${token}`, // Include authorization token
                    'Accept': 'application/json',
                    // Note: Content-Type for FormData should not be set manually; it is handled automatically by Axios
                },
            });
    
            const updatedServices = services.map(service => 
                service._id === currentService._id ? response.data.updatedService : service
            );
            setServices(updatedServices);
            window.alert("Information successfully edited.");
            setShowEditModal(false);
            resetForm();
            window.location.reload();
        } catch (error) {
            console.error('Error editing service:', error);
            alert('Failed to edit service. Please try again later.'); // User-friendly error message
        }
    };
    
    
    const handleConfirmDelete = async (serviceId) => {
        try {
            const token = localStorage.getItem('token'); // Retrieve the token
    
            await axios.delete(`${config.address}/api/service/delete/${serviceId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`, // Include authorization token
                    'Accept': 'application/json',
                },
            });
    
            const updatedServices = services.filter(service => service._id !== serviceId);
            setServices(updatedServices);
            setShowDeleteModal(false);
            window.location.reload();
        } catch (error) {
            console.error('Error deleting service:', error);
            alert('Failed to delete service. Please try again later.'); // User-friendly error message
        }
    };
       

    const handleDelete = (serviceId) => {
        setServiceToDelete(serviceId);
        setShowDeleteModal(true);
    };
    

    const resetForm = () => {
        setName('');
        setAddress('');
        setPin('');
        setImage(null);
        setType('');
        setErrors({});
    };

    const handleFilter = (type) => {
        setActiveButton(type);
        const filteredServices = services.filter(service => service.ns_type === type);
        setClinics(filteredServices); 
    };

    const handleBoxClick = (ns_pin) => {
        setMapSrc(ns_pin);
    };
    
    
    const handleEditClick = (service) => {
        console.log('Editing service:', service);
        setCurrentService(service);
        setName(service.ns_name);
        setAddress(service.ns_address);
        setPin(service.ns_pin);
        setType(service.ns_type);
        setImage(service.ns_image);
        setShowEditModal(true);
    };   

    const filteredClinics = clinics.filter(clinic =>
        clinic.ns_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        clinic.ns_address.toLowerCase().includes(searchQuery.toLowerCase())
      );
    
    return (
        <div className='nearbox1'>
            <div className='navbox'>
                <NavigationBar />
            </div>
            <div className='nearbybox2'>
            <div className='nearbybox6'>
                <div className='nearbybox3'>
                    <h2>Nearby</h2>
                    <h3>Services</h3>
                    <h4>IN PASAY CITY</h4>
                
                    <div className="nearby-search-container">
              <input
                type="text"
                placeholder="Search clinics or address..."
                className="nearby-search-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
                    <div className='nearbybox4'>
                        <Button className='nearbybtns' style={{ backgroundColor: activeButton === 'veterinary' ? 'white' : '#d2d2d5', color: activeButton === 'veterinary' ? 'black' : 'white' }} onClick={() => handleFilter('veterinary')}>Vet Clinics</Button>
                        <Button className='nearbybtns' style={{ backgroundColor: activeButton === 'neutering' ? 'white' : '#d2d2d5', color: activeButton === 'neutering' ? 'black' : 'white' }} onClick={() => handleFilter('neutering')} >Neutering</Button>
                        <Button className='nearbybtns' style={{ backgroundColor: activeButton === 'hotel' ? 'white' : '#d2d2d5', color: activeButton === 'hotel' ? 'black' : 'white' }} onClick={() => handleFilter('hotel')} >Pet Hotels</Button>
                        <Button className='nearbybtns' style={{ backgroundColor: activeButton === 'grooming' ? 'white' : '#d2d2d5', color: activeButton === 'grooming' ? 'black' : 'white' }} onClick={() => handleFilter('grooming')}>Grooming</Button>
                    </div>
                        {/* Display Filtered Clinics */}
                        <div className='nearavailableClinics'>
                            {filteredClinics.length > 0 ? (
                                <div className='nearclinicsContainer'>
                                    {filteredClinics.map((clinic, index) => (
                                        <div className='nearclinicBox' key={index} onClick={() => handleBoxClick(clinic.ns_pin)}>
                                            <Image
                                                src={`${config.address}${clinic.ns_image}`} // Display the image from the URL
                                                alt={clinic.ns_name}
                                            />
                                            <div className='nearclinicInfo'>
                                                <h5>{clinic.ns_name}</h5>
                                                <p>{clinic.ns_address}</p>
                                            </div>
                                            <div className="nearclinic-buttons">
                                                <Button className="nearbyedit" onClick={() => handleEditClick(clinic)}><PencilSquare /></Button>
                                                <Button className="nearbydelete" onClick={() => handleDelete(clinic._id)}><Trash /></Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p style={{ alignSelf: 'center', justifySelf: 'center' }}>There are no locations available for this category.</p>
                            )}
                        </div>

                    <Button className="nearbyaddbtn" onClick={() => setShowModal(true)}>Add a Service</Button>
                </div>
            </div>
            <div className='nearbybox5'>
                <div className='nearbymapbox'>
                <iframe
                    width="100%"
                    height="750"
                    style={{ border: 0 }}
                    loading="lazy"
                    allowFullScreen
                    src={mapSrc}
                ></iframe>
                </div>
            </div>
            </div>

            {/* ADD SERVICE */}
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
                    
                    <p>Address:</p>
                    <input
                        type='text'
                        placeholder='Street Address'
                        value={address}
                        onChange={(e) => {
                            setAddress(e.target.value);
                            setErrors((prev) => ({ ...prev, address: '' }));
                        }}
                        style={{ borderColor: errors.address ? 'red' : '' }}
                    />
                    {errors.address && <p className='error'>{errors.address}</p>}

                    <p>Location Pin:</p>
                    <input
                        type='text'
                        placeholder='Google Maps Link'
                        value={pin}
                        onChange={(e) => {
                            setPin(e.target.value);
                            setErrors((prev) => ({ ...prev, pin: '' }));
                        }}
                        style={{ borderColor: errors.pin ? 'red' : '' }}
                    />
                    {errors.pin && <p className='error'>{errors.pin}</p>}

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

            {/* Edit Service */}
            <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Edit Service</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <form>
                            <div>
                            {currentService.ns_image && currentService.ns_image.data && (
                                <div>
                                    <label>Current Image:</label>
                                    <Image 
                                            src={`${config.address}${currentService.ns_image}`} // Display the image from the URL
                                            alt={currentService.ns_name} 
                                            rounded 
                                            style={{ width: '100%', height: 'auto', marginBottom: '10px' }} 
                                        />
                                </div>
                            )}
                                <label>Service Name:</label>
                                <input type='text' value={name} onChange={(e) => setName(e.target.value)} />
                                {errors.name && <span>{errors.name}</span>}
                            </div>
                            <div>
                                <label>Address:</label>
                                <input type='text' value={address} onChange={(e) => setAddress(e.target.value)} />
                                {errors.address && <span>{errors.address}</span>}
                            </div>
                            <div>
                                <label>Google Maps Link:</label>
                                <input type='text' value={pin} onChange={(e) => setPin(e.target.value)} />
                                {errors.pin && <span>{errors.pin}</span>}
                            </div>
                            <div>
                                <label>Service Type:</label>
                                <select value={type} onChange={(e) => setType(e.target.value)}>
                                    <option value=''>Select Type</option>
                                    <option value='veterinary'>Veterinary</option>
                                    <option value='neutering'>Neutering</option>
                                    <option value='hotel'>Hotel</option>
                                    <option value='grooming'>Grooming</option>
                                </select>
                                {errors.type && <span>{errors.type}</span>}
                            </div>
                            <div>
                                <label>New Image:</label>
                                <input
                                    type='file'
                                    accept='image/*'
                                    onChange={(e) => {
                                        if (e.target.files.length > 0) {
                                            setImage(e.target.files[0]);
                                        } else {
                                            setImage(service.ns_image); 
                                        }
                                    }}
                                />
                            </div>
                        </form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant='secondary' onClick={() => setShowEditModal(false)}>
                            Close
                        </Button>
                        <Button variant='primary' onClick={handleEditService}>
                            Save Changes
                        </Button>
                    </Modal.Footer>
                </Modal>

                {/* DELETE MODAL */}
                <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Confirm Deletion</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        Are you sure you want to delete this service? This action cannot be undone.
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
                            Cancel
                        </Button>
                        <Button variant="danger" onClick={() => handleConfirmDelete(serviceToDelete)}>
                            Confirm
                        </Button>
                    </Modal.Footer>
                </Modal>

        </div>
    );
};

export default NearbyServices;
