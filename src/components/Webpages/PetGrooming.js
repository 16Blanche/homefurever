import React from 'react';
import './Homepage.css';
import Image from 'react-bootstrap/Image';
import dogsandthecity from './assets/dogsandthecity.png' 
import happytailspet from './assets/happytailspet.png' 
import PinkNavigationBar from './PinkNavigationBar';
import { Button } from 'react-bootstrap';
import NavigationBar from './NavigationBar';

const PetGrooming = () => {
  return (
    <>
    <div>
        <NavigationBar/>
        <Button className="pgaddbtn">+ Add Service</Button>
      <div className="content">

        <div className="grooming-option">
        <Image require src={happytailspet} className="grooming-optionimg"></Image>
          <h3>Happy Tails Pet Salon</h3>
          <p>32 C Clemente Jose, Malibay, Pasay, 1300 Kalakhang Maynila</p>

        </div>
        <div className="grooming-option">
          <Image require src={dogsandthecity} className="grooming-optionimg"></Image>
          <h3>Dogs and The City</h3>
          <p>116-117 South Parking SM Mall of Asia, Marina Way, Pasay, 1300</p>

        </div>
      </div>
      </div>
    </>
  );
}

export default PetGrooming;