import React, { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import PinkNavigationBar from './PinkNavigationBar';
import './Users.css';
import Image from 'react-bootstrap/Image';
import axios from 'axios';
import config from '../config';

const NearbyServices = () => {
  const navigate = useNavigate();

  const [clinics, setClinics] = useState([]);
  const [activeButton, setActiveButton] = useState('veterinary');
  const [services, setServices] = useState([]);
  const [mapSrc, setMapSrc] = useState("https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15449.2815446538!2d120.99056151035074!3d14.52365753849892!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3397c98aa3066ca5%3A0xe376b7446d803df1!2sPasay%20City%20Animal%20Shelter%2FClinic!5e0!3m2!1sen!2sph!4v1727340365399!5m2!1sen!2sph");

  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get(`${config.address}/api/service/all`);
        const fetchedServices = response.data;
        setServices(fetchedServices);

        handleFilter('veterinary', fetchedServices);
      } catch (error) {
        console.error('Error fetching services:', error);
      }
    };
    fetchServices();
  }, []);

  const handleFilter = (type, servicesList = services) => {
    setActiveButton(type);
    const filteredServices = servicesList.filter(service => service.ns_type === type);
    setClinics(filteredServices); 
  };

  const handleBoxClick = (ns_pin) => {
    setMapSrc(ns_pin);
  };

  const filteredClinics = clinics.filter(clinic =>
    clinic.ns_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    clinic.ns_address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className='nearbybox1'>
      <div className='navbox'>
        <PinkNavigationBar />
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
              <Button
                className='nearbybtns'
                style={{
                  backgroundColor: activeButton === 'veterinary' ? 'white' : '#d2d2d5',
                  color: activeButton === 'veterinary' ? 'black' : 'white'
                }}
                onClick={() => handleFilter('veterinary')}
              >
                Vet Clinics
              </Button>
              <Button
                className='nearbybtns'
                style={{
                  backgroundColor: activeButton === 'neutering' ? 'white' : '#d2d2d5',
                  color: activeButton === 'neutering' ? 'black' : 'white'
                }}
                onClick={() => handleFilter('neutering')}
              >
                Neutering
              </Button>
              <Button
                className='nearbybtns'
                style={{
                  backgroundColor: activeButton === 'hotel' ? 'white' : '#d2d2d5',
                  color: activeButton === 'hotel' ? 'black' : 'white'
                }}
                onClick={() => handleFilter('hotel')}
              >
                Pet Hotels
              </Button>
              <Button
                className='nearbybtns'
                style={{
                  backgroundColor: activeButton === 'grooming' ? 'white' : '#d2d2d5',
                  color: activeButton === 'grooming' ? 'black' : 'white'
                }}
                onClick={() => handleFilter('grooming')}
              >
                Grooming
              </Button>
            </div>

            <div className='availableClinics'>
              {filteredClinics.length > 0 ? (
                <div className='clinicsContainer'>
                  {filteredClinics.map((clinic, index) => (
                    <div className='clinicBox' key={index} onClick={() => handleBoxClick(clinic.ns_pin)}>
                      <Image
                        src={clinic.ns_image ? `${config.address}${clinic.ns_image}` : 'fallback-image-url'}
                        alt={clinic.ns_name}
                      />
                      <div className='clinicInfo'>
                        <h5>{clinic.ns_name}</h5>
                        <p>{clinic.ns_address}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{alignSelf:'center', justifySelf:'center'}}>There are no locations available for this category.</p>
              )}
            </div>
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
    </div>
  );
};

export default NearbyServices;
