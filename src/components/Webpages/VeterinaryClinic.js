import React from 'react';
import './Homepage.css';
import Image from 'react-bootstrap/Image';
import dogsandthecity from './assets/dogsandthecity.png' 
import happytailspet from './assets/happytailspet.png' 
import PinkNavigationBar from './PinkNavigationBar';
import { Button } from 'react-bootstrap';
import Vet1 from './assets/carveldonveterinarycenter.png'
import Vet2 from './assets/cruzveterinaryclinic.png'
import NavigationBar from './NavigationBar';

const VeterinaryClinic = () => {
  return (
    <>
    <div>
        <NavigationBar/>
        <Button className="pgaddbtn">+ Add Service</Button>
      <div className="content">

        <div className="grooming-option">
        <Image require src={Vet1} className="grooming-optionimg"></Image>
          <h3>Carveldon Veterinary Center</h3>
          <p>CPC, 21 Cartimar Ave, Pasay, 1300 Metro Manila</p>

        </div>
        <div className="grooming-option">
          <Image require src={Vet2} className="grooming-optionimg"></Image>
          <h3>Cruz Veterinary Clinic</h3>
          <p>Stall G, Felimarc Pet Center, 2189 A. Luna, Pasay, 1300, Metro Manila</p>

        </div>
      </div>
      </div>
    </>
  );
}

export default VeterinaryClinic;