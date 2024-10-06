import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import "./Users.css";
import PinkNavigationBar from './PinkNavigationBar';
import { Button, Image } from 'react-bootstrap';
import {ChevronLeft, ChevronRight} from 'react-bootstrap-icons';

const convertToBase64 = (buffer) => {
  return btoa(
    new Uint8Array(buffer).reduce((data, byte) => data + String.fromCharCode(byte), '')
  );
};

const PetProfile = () => {
  const { id } = useParams();
  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0); // State to track the currently displayed image index
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

  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % pet.pet_img.length); // Move to the next image, loop back to the start
  };

  const handlePreviousImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + pet.pet_img.length) % pet.pet_img.length); // Move to the previous image, loop back to the end
  };

  return (
    <div className='box'>
      <div className="pnavbox">
        <PinkNavigationBar />
      </div>
      <div className='ppbox3'>
        <div className="ppbox2">
          <h1 className='pph1'>PET PROFILE</h1>

            {/* Display the currently selected image in the pet_img array */}
            {pet.pet_img && pet.pet_img.length > 0 && (
              <div className="pp-image-wrapper">
                <div className='pppagebtn'>
                    <Button
                    onClick={handlePreviousImage}
                    disabled={currentImageIndex === 0}
                    className="pagination-button-left"
                    >
                        <ChevronLeft/>
                    </Button>
                </div>
                <div className='pp-img-container'>
                    <Image
                    src={`data:image/jpeg;base64,${convertToBase64(pet.pet_img[currentImageIndex].data)}`}
                    alt={`Pet Image ${currentImageIndex + 1}`}
                    className="pppet-image"
                    />
                </div>
                <div className='pppagebtn'>
                    <Button
                    onClick={handleNextImage}
                    disabled={currentImageIndex === pet.pet_img.length - 1}
                    className="pagination-button-right"
                    >
                    <ChevronRight/>
                    </Button>
                </div>
              </div>
            )}

            {/* Display the current image number and total count */}
            {/* {pet.pet_img && pet.pet_img.length > 1 && (
              <div className="image-counter">
                <span>{`Image ${currentImageIndex + 1} of ${pet.pet_img.length}`}</span>
              </div>
            )} */}


          <div className="additional-info">
            <div className='addinfo-desc'>
                <h4 className='pph4'>Description:</h4>
                <p>{pet.p_description}</p>
            </div>
            <div className='addinfo-pet'>
                <div className='addinfo-text'>
                    <h4 className='pph4'>Name</h4><h4 className='pph4'>:</h4> <p className='ppp'>{pet.p_name}</p>
                    <h4 className='pph4'>Age</h4><h4 className='pph4'>:</h4> <p className='ppp'>{pet.p_age}</p>
                    <h4 className='pph4'>Gender</h4><h4 className='pph4'>:</h4> <p className='ppp'>{pet.p_gender}</p>
                </div>
                <div className='addinfo-text2'>
                    <h4 className='pph4'>Pet Type</h4><h4 className='pph4'>:</h4> <p className='ppp'>{pet.p_type}</p>
                    <h4 className='pph4'>Breed</h4><h4 className='pph4'>:</h4> <p className='ppp'>{pet.p_breed}</p>
                </div>
            </div>

          </div>

          <Button className='adopt-button' onClick={handleAdopt}>Adopt</Button>
        </div>
        <div className='ppbox4'>

        </div>
      </div>
    </div>
  );
};

export default PetProfile;
