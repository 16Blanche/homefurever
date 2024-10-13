import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Heartlogo from './assets/heartlogo.png';
import Welcomehp from './assets/mainbg.png';
import Dog from './assets/dog.png';
import "./Users.css";
import PinkNavigationBar from './PinkNavigationBar';

const HomePageUser = () => {
  const navigate = useNavigate();

  const handleEventsClick = () => {
    console.log('Events card clicked');
    navigate('/events');
  };

  const handleAboutUsClick = () => {
    console.log('About Us card clicked');
    navigate('/aboutus');
  };

  const handleAdoptClick = () => {
    console.log('About Us card clicked');
    navigate('/browse/pets');
  };

  return (
    
    <div className='box'>
      <div className="navbar2">
            {/* <PinkNavigationBar/> */}
            </div>
      <div className="hpcontainer">
        <header className="hpheader">
          <img src={Welcomehp} alt="Welcome to E-Pet Adopt" className="hpheader-image" />
        </header>
        <div className="hpbutton-container">
          <Button className="hpadopt-button" onClick={handleAdoptClick}>Adopt A Pet</Button>
        </div>
        <div className="hpsection">
          <div className="hpsection-card-container">
            <div className="hpsection-cardone" onClick={handleEventsClick} role="button" tabIndex={0} onKeyPress={handleEventsClick}>
              <img src={Heartlogo} alt="Heartlogo" className="hpsection-imageone" />
            </div>
            <p className="hpsection-textone">EVENTS</p>
          </div>
          <img src={Dog} alt="Dog" className="hpmiddle-img" />
          <div className="hpsection-card-container">
            <div className="hpsection-card" onClick={handleAboutUsClick} role="button" tabIndex={0} onKeyPress={handleAboutUsClick}>
              <img src={Welcomehp} alt="HeaderImage" className="hpsection-image" />
            </div>
            <p className="hpsection-text">ABOUT US</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePageUser;
