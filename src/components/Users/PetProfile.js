import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import "./Users.css";
import PinkNavigationBar from './PinkNavigationBar';
import { Button, Image } from 'react-bootstrap';
import { ChevronLeft, ChevronRight } from 'react-bootstrap-icons';

const convertToBase64 = (buffer) => {
  return btoa(
    new Uint8Array(buffer).reduce((data, byte) => data + String.fromCharCode(byte), '')
  );
};

const PetProfile = () => {
  const { id } = useParams();
  const [pet, setPet] = useState(null);
  const [allPets, setAllPets] = useState([]);
  const [randomPets, setRandomPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {

    setLoading(true);
    setPet(null);
    setRandomPets([]);

    axios.get(`http://localhost:8000/api/pet/${id}`)
      .then(response => {
        setPet(response.data.thePet);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });

    axios.get(`http://localhost:8000/api/pet/all`)
      .then(response => {
        const pets = response.data.thePet;
        setAllPets(pets);
      })
      .catch(err => {
        console.error(err);
      });
  }, [id]); 

  useEffect(() => {
    if (pet && allPets.length > 0) {
      const otherPets = allPets.filter((p) => p._id !== pet._id);
      const shuffledPets = otherPets.sort(() => 0.5 - Math.random());
      setRandomPets(shuffledPets.slice(0, 5));
    }
  }, [pet, allPets]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!pet) {
    return <div>Pet not found</div>;
  }

  const handleAdopt = () => {
    navigate(`/pet/adoption-form/${id}`); 
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % pet.pet_img.length);
  };

  const handlePreviousImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + pet.pet_img.length) % pet.pet_img.length); 
  };

  const handleViewProfile = (petId) => {
    navigate(`/pet/profile/${petId}`); 
  };

  return (
    <div className='box'>
      <div className="pnavbox">
        <PinkNavigationBar />
      </div>
      <div className='ppbox3'>
        <div className="ppbox2">
          <h1 className='pph1'>PET PROFILE</h1>

          {pet.pet_img && pet.pet_img.length > 0 && (
            <div className="pp-image-wrapper">

              <div className='pp-img-container'>
              <div className='pppagebtn'>
                <Button
                  onClick={handlePreviousImage}
                  disabled={currentImageIndex === 0}
                  className="pagination-button-left"
                >
                  <ChevronLeft/>
                </Button>
              </div>
                <Image
                  src={`data:image/jpeg;base64,${convertToBase64(pet.pet_img[currentImageIndex].data)}`}
                  alt={`Pet Image ${currentImageIndex + 1}`}
                  className="pppet-image"
                />
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

            </div>
          )}

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

        {/* Display other pets */}
        <div className='ppbox4'>
          <h1>OTHER PETS</h1>
          <div className="ppbox5">
              {randomPets && randomPets.map((pet) => (
                <Button key={pet._id} className="ppother" onClick={() => handleViewProfile(pet._id)}>
                  <div className="ppotherimgbox">
                    {pet.pet_img && pet.pet_img.length > 0 && (
                      <Image 
                        src={`data:image/jpeg;base64,${convertToBase64(pet.pet_img[0].data)}`} 
                        rounded 
                        className="clickable-image" 
                        loading="lazy"
                      />
                    )}
                  </div>
                  <div className='ppothertext'>
                    <h1>{pet.p_name}</h1>
                    <p>{pet.p_age} years old</p>
                    <p>{pet.p_gender} {pet.p_type}</p>
                  </div>
                </Button>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PetProfile;
