import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import "./Users.css";
import PinkNavigationBar from './PinkNavigationBar';
import { Button } from 'react-bootstrap';

const convertToBase64 = (buffer) => {
  return btoa(
      new Uint8Array(buffer).reduce((data, byte) => data + String.fromCharCode(byte), '')
  );
};

const PetProfile = () => {
    const { id } = useParams();
    const [pet, setPet] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`http://localhost:8000/api/pet/${id}`)
            .then(response => {
                setPet(response.data.thePet);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, [id]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!pet) {
        return <div>Pet not found</div>;
    }

    const handleAdopt = () => {
        navigate(`/pet/adoption-form/${id}`); // Correct route and ID passed
    };
    
    
    console.log('Pet Data:', pet);

    return (
        <div className='box'>
            <div className="pnavbox">
                <PinkNavigationBar />
            </div>
            <div className='ppbox3'>
            <div className="ppbox2">
                {/* <div className="pet-details"> */}
                    <h1 className='pph1'>PET PROFILE</h1>
                    <div className="pet-images">
                        {pet.pet_img && (
                            <img src={`data:image/jpeg;base64,${convertToBase64(pet.pet_img.data)}`} alt={pet.p_name} className="pppet-image" />
                        )}
                    </div>
                    {/* <h2 className='pph1'>{pet.p_name}</h2> */}
                    <div className="additional-info">
                        <h4 className='pph4'>Name</h4><h4 className='pph4'>:</h4> <h4 className='pph4'>{pet.p_name}</h4>
                        <h4 className='pph4'>Age</h4><h4 className='pph4'>:</h4> <h4 className='pph4'>{pet.p_age}</h4>
                        <h4 className='pph4'>Gender</h4><h4 className='pph4'>:</h4> <h4 className='pph4'>{pet.p_gender}</h4>
                        <h4 className='pph4'>Pet Type</h4><h4 className='pph4'>:</h4> <h4 className='pph4'>{pet.p_type}</h4>
                        <h4 className='pph4'>Breed</h4><h4 className='pph4'>:</h4> <h4 className='pph4'>{pet.p_breed}</h4>
                    </div>

                        <Button className='adopt-button' onClick={handleAdopt}>Adopt</Button>

                {/* </div> */}
            </div>
        </div>
        </div>
    );
};

export default PetProfile;
