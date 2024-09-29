import React from 'react';
import { Button, InputGroup, FormControl } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import Image from 'react-bootstrap/Image';
import PinkNavigationBar from './PinkNavigationBar';
import Homepage from './Homepage.css';
import NavigationBar from './NavigationBar';

import Map from './assets/map.png';

const NearbyServices = () => {

    const navigate = useNavigate();

    const mapContainerStyle = {
        height: '400px',
        width: '100%'
    };

    const handlePetGrooming = () => {
        navigate('/nearby-services/pet-grooming');
      };
    
      const handlePetHotel = () => {
        navigate('/nearby-services/pet-hotel');
      };
      const handleNeuteringClinic= () => {
        navigate('/nearby-services/neutering-clinic');
      };
      const handleVeterinaryClinic = () => {
        navigate('/nearby-services/veterinary-clinic');
      };

    const center = { lat: 14.5377, lng: 121.0014 }; // Example center coordinates

    return (
        <div className='startbox1'>
            <div className='navbox'>
                <NavigationBar/>
                </div>
                <div className='nearbybox2'>


                    <h2 className='nstitle'>Nearby Services</h2>


                <div className="col-md-12 d-flex justify-content-center">
                <InputGroup style={{ maxWidth: '600px' }}>
                        <FormControl
                            placeholder="Search for nearby services around Pasay City"
                            aria-label="Search for nearby services around Pasay City"
                        />
                        <Button variant="outline-secondary">
                            <i className="bi bi-mic"></i>
                        </Button>
                    </InputGroup>
                    
                </div>
                <div className='nsimgcontainer'>
                <Image require src={Map} className='nsmap'></Image>
                </div>

            <div className="row">
                <div className="nsbuttons">
                    <Button variant="outline-secondary" className="mb-2" style={{ width: '200px' }} onClick={handleVeterinaryClinic}>Veterinary Clinics</Button>
                    <Button variant="outline-secondary" className="mb-2" style={{ width: '200px' }} onClick={handleNeuteringClinic}>Neutering Clinics</Button>
                    <Button variant="outline-secondary" className="mb-2" style={{ width: '200px' }} onClick={handlePetHotel}>Pet Hotels</Button>
                    <Button variant="outline-secondary" className="mb-2" style={{ width: '200px' }} onClick={handlePetGrooming}>Pet Grooming</Button>
                </div>
            </div>
            </div>
        </div>
    );
};

export default NearbyServices;
