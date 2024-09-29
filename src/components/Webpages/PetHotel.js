import React from 'react';
import './Homepage.css';
import Image from 'react-bootstrap/Image';
import dogsandthecity from './assets/dogsandthecity.png' 
import happytailspet from './assets/happytailspet.png' 
import PinkNavigationBar from './PinkNavigationBar';
import { Button } from 'react-bootstrap';
import Hotel1 from './assets/dogfriendhotelandspa.png';
import Hotel2 from './assets/thepupclub.png';
import NavigationBar from './NavigationBar';
const PetHotel = () => {
  return (
    <>
    <div className='box'>
      <div className='navbox'>
        <NavigationBar/>
        </div>
        <Button className="pgaddbtn">+ Add Service</Button>
      <div className="content">

        <div className="grooming-option">
        <Image require src={Hotel1} className="grooming-optionimg"></Image>
          <h3>Dog Friend Hotel & SPA</h3>
          <p>Unit K & C Felimarc Center Taft Avenue (nearby Cartimar), 
          Pasay City, Philippines</p>

        </div>
        <div className="grooming-option">
          <Image require src={Hotel2} className="grooming-optionimg"></Image>
          <h3>The Pup Club </h3>
          <p>131 Armstrong Ave corner Von Braun, Parañaque, 
          Philippines</p>

        </div>
      </div>
      </div>
    </>
  );
}

export default PetHotel;