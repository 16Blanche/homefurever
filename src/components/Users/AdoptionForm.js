import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Form } from 'react-bootstrap';
import PinkNavigationBar from './PinkNavigationBar';
import "./Users.css";
import config from '../config';

const AdoptionForm = () => {
    const { id } = useParams(); // Extract pet ID from URL parameters
    const [pet, setPet] = useState(null);
    const [formData, setFormData] = useState({
        home_type: '',
        years_resided: '',
        adults_in_household: '',
        children_in_household: '',
        allergic_to_pets: '',
        household_description: '',
        occupation: ''
    });
    const [errors, setErrors] = useState({});
    const [showError, setShowError] = useState(false);
    const navigate = useNavigate();
    const token = localStorage.getItem('token'); // Assuming token is stored in localStorage

    const [userInfo, setUserInfo] = useState({
        full_name: '',
        address: '',
        email: '',
        contactNumber: ''
    });
    
    useEffect(() => {
        if (!token) {
            console.error('No token found, redirecting to login...');
            navigate('/login'); // Redirect to login page if no token
            return;
        }
    
        // Fetch pet details
        axios.get(`${config.address}/api/pet/${id}`)
            .then(response => {
                // Ensure we're getting the right data from the response
                setPet(response.data.thePet); // Update this to match the API response field
            })
            .catch(err => {
                console.error('Error fetching pet details:', err);
            });
    
        // Fetch user details for logged-in user
        axios.get(`${config.address}/api/user/profile`, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(response => {
                const { firstName, middleName, lastName, address, email, contactNumber } = response.data.user;
    
                // Construct full name without extra spaces
                const full_name = `${firstName} ${middleName ? middleName + ' ' : ''}${lastName}`;
    
                setUserInfo({
                    full_name, // Assign the constructed full name
                    address,
                    email,
                    contactNumber
                });
            })
            .catch(error => {
                console.error('Error fetching user info:', error);
            });
    }, [id, token, navigate]);
    

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
    
        if (validateForm()) {
            const formPayload = {
                ...formData,
                pet_id: id, // Ensure the correct pet_id is passed
                user_id: userInfo.v_id // Include the user_id from the fetched user info
            };
    
            axios.post(`${config.address}/api/adoption/submit`, formPayload, {
                headers: { Authorization: `Bearer ${token}` } 
            })
            .then(response => {
                console.log('Form submitted:', response.data);
                // Reset form data after submission
                setFormData({
                    home_type: '',
                    years_resided: '',
                    adults_in_household: '',
                    children_in_household: '',
                    allergic_to_pets: '',
                    household_description: '',
                    occupation: ''
                });
                navigate('/pet/adoption/success');
            })
            .catch(error => {
                console.error('Error submitting form:', error);
                setShowError(true);
            });
        } else {
            setShowError(true);
        }
    };
    
    const validateForm = () => {
        const newErrors = {};

        if (!formData.home_type) newErrors.home_type = "Please select a home type.";
        if (!formData.years_resided) newErrors.years_resided = "Number of years resided is required.";
        if (!formData.adults_in_household) newErrors.adults_in_household = "Please enter the number of adults in household.";
        if (!formData.children_in_household) newErrors.children_in_household = "Please enter the number of children in household.";
        if (!formData.allergic_to_pets) newErrors.allergic_to_pets = "Please specify if anyone is allergic to pets.";
        if (!formData.household_description) newErrors.household_description = "Please describe your household.";
        if (!formData.occupation) newErrors.occupation = "Occupation is required.";

        setErrors(newErrors);

        // If no errors, return true
        return Object.keys(newErrors).length === 0;
    };

    const formatContactNumber = (number) => {
        const numStr = String(number); // Ensure the input is a string
        if (!numStr.startsWith('63')) return numStr; // Handle unexpected formats
        return `+63 ${numStr.slice(2, 5)} ${numStr.slice(5, 8)} ${numStr.slice(8)}`;
    };
      

    return (
        <div className='box'>
            <div className="pnavbox">
                <PinkNavigationBar />
            </div>
            <div className='form-box1'>
                <div className="form-box2">
                    <h1 className='form-title'>Pet Adoption Form</h1>

                    <Form className='form-content' onSubmit={handleSubmit}>
                    <h2 className="form-subtitle">Pet Information</h2>
                        {pet && (
                            <div className='form-pet-group'>
                                <div className='form-input-group'>
                                    <p><strong>Name:</strong> {pet.p_name}</p>
                                    <p><strong>Type:</strong> {pet.p_type}</p>
                                    <p><strong>Age:</strong> {pet.p_age} year/s old</p>
                                    <p><strong>Gender:</strong> {pet.p_gender}</p>
                                </div>
                            </div>
                        )}
                        <h3 className='form-subtitle'>Adopter Information</h3> 
                        <Form.Group className='form-input-group'>
                            <Form.Label>Full Name:</Form.Label>
                            <Form.Control 
                                className='form-input-box readonly'
                                value={userInfo.full_name || ''} 
                                readOnly 
                            />
                        </Form.Group>
                        <Form.Group className='form-input-group'>
                            <Form.Label>Occupation:</Form.Label>
                            <Form.Control
                                className='form-input-box'
                                name='occupation' 
                                value={formData.occupation} 
                                onChange={handleChange} 
                                isInvalid={errors.occupation}
                            />
                        </Form.Group>
                        <Form.Group className='form-input-group'>
                            <Form.Label>Address:</Form.Label>
                            <Form.Control 
                                className='form-input-box readonly'
                                value={userInfo.address || ''} 
                                readOnly 
                            />
                        </Form.Group>
                        <Form.Group className='form-input-group'>
                            <Form.Label>Email:</Form.Label>
                            <Form.Control 
                                className='form-input-box2 readonly'
                                value={userInfo.email || ''} 
                                readOnly 
                            />
                            <Form.Label>Contact Number:</Form.Label>
                            <Form.Control 
                                className='form-input-box2 readonly'
                                value={formatContactNumber(userInfo.contactNumber || '')} 
                                readOnly 
                            />
                        </Form.Group>


                        <h3 className='form-subtitle2'>Family & Housing</h3>
                        <Form.Group className='form-input-group'>
                            <Form.Label>What type of home do you live in?</Form.Label>
                            <Form.Control 
                                className='form-input-box-select'
                                as="select" 
                                name='home_type' 
                                value={formData.home_type} 
                                onChange={handleChange}
                                isInvalid={errors.home_type}
                            >
                                <option value=''>-Select-</option>
                                <option>Bungalow</option>
                                <option>Condominium</option>
                                <option>Apartment</option>
                                <option>Townhouse</option>
                                <option>Single-Detached</option>
                                <option>Single-Attached</option>
                                <option>Duplex</option>
                                <option>Mansion</option>
                            </Form.Control>
                        </Form.Group>
                        <Form.Group className='form-input-group'>
                            <Form.Label>Number of years resided:</Form.Label>
                            <Form.Control
                                className='form-input-box3' 
                                name='years_resided' 
                                type='number' 
                                value={formData.years_resided} 
                                onChange={handleChange} 
                                isInvalid={errors.years_resided}
                            />
                        </Form.Group>
                        <Form.Group className='form-input-group'>
                            <Form.Label>How many adults live in your household?</Form.Label>
                            <Form.Control 
                                className='form-input-box3'
                                name='adults_in_household' 
                                type='number' 
                                value={formData.adults_in_household} 
                                onChange={handleChange} 
                                isInvalid={errors.adults_in_household}
                            />
                        </Form.Group>
                        <Form.Group className='form-input-group'>
                            <Form.Label>How many children live in your household?</Form.Label>
                            <Form.Control 
                                className='form-input-box3'
                                name='children_in_household' 
                                type='number' 
                                value={formData.children_in_household} 
                                onChange={handleChange} 
                                isInvalid={errors.children_in_household}
                            />
                        </Form.Group>
                        <Form.Group className='form-input-group'>
                            <Form.Label>Is anyone in your household allergic to pets?</Form.Label>
                            <Form.Control 
                                className='form-input-box-select'
                                as="select" 
                                name='allergic_to_pets' 
                                value={formData.allergic_to_pets} 
                                onChange={handleChange}
                                isInvalid={errors.allergic_to_pets}
                            >
                                <option value=''>-Select-</option>
                                <option>Yes</option>
                                <option>No</option>
                            </Form.Control>
                        </Form.Group>
                        <Form.Group className='form-input-group'>
                            <Form.Label>Please describe your household:</Form.Label>
                            <Form.Control 
                                className='form-input-box-select'
                                as="select" 
                                name='household_description' 
                                value={formData.household_description} 
                                onChange={handleChange}
                                isInvalid={errors.household_description}
                            >
                                <option value=''>-Select-</option>
                                <option>Active</option>
                                <option>Noisy</option>
                                <option>Quiet</option>
                                <option>Average</option>
                            </Form.Control>
                        </Form.Group>

                        <Button className='form-submit-button' type='submit'>
                            Submit
                        </Button>
                    </Form>
                </div>
            </div>
        </div>
    );
};

export default AdoptionForm;
