import React from 'react';
import './Homepage.css';
import Image from 'react-bootstrap/Image';
import dogsandthecity from './assets/dogsandthecity.png' 
import happytailspet from './assets/happytailspet.png' 
import PinkNavigationBar from './PinkNavigationBar';
import { Button } from 'react-bootstrap';
import Neut1 from './assets/petalliesanimalclinic.png'
import Neut2 from './assets/theveterinaryhub.png'
import NavigationBar from './NavigationBar';

const NeuteringClinic = () => {
  return (
    <>
    <div>
        <NavigationBar/>
        <Button className="pgaddbtn">+ Add Service</Button>
      <div className="content">

        <div className="grooming-option">
        <Image require src={Neut1} className="grooming-optionimg"></Image>
          <h3>Pet Allies Animal Clinic</h3>
          <p>Unit 6, Megal Taft Bldg., 2140 Taft Ave.Cor. Taylo St., 55 Zone 7, Pasay, 1300 Metro Manila
          </p>

        </div>
        <div className="grooming-option">
          <Image require src={Neut2 } className="grooming-optionimg"></Image>
          <h3>The Veterinary Hub Pte. Corp</h3>
          <p>Unit W ZoneV, 1300 Taft Ave, Pasay, Metro Manila
          </p>

        </div>
      </div>
      </div>
    </>
  );
}

export default NeuteringClinic;