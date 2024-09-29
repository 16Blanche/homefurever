import React from 'react';
import { useNavigate } from 'react-router-dom';
import "./Users.css";
import PinkNavigationBar from './PinkNavigationBar';
import { Button } from 'react-bootstrap';

const Adopt = () => {
  const navigate = useNavigate();

  const handleMyAdoptions = () => {
    navigate("/adoption/tracker");
  };

  const handleBackToBrowsing = () => {
    navigate("/browse/pets");
  };

  return (
    <div className='box'>
      <div className="pnavbox">
        <PinkNavigationBar />
      </div>
      <div className="adoptbox1">
        <div className='adoptbox2'>
          <div className='adoptbox3'>
            <div className='adoptline' />
            <h1>Application Submitted</h1>
          </div>
          <div className='adoptbox4'>
            <p>The adoption will be processed by the shelter. Please check your adoption tracker regularly for an update from the shelter.</p>
          </div>

          <Button onClick={handleMyAdoptions} className="adoptbtn">My Adoptions</Button>
          <Button onClick={handleBackToBrowsing} className="adoptbtn2">Back to Browsing</Button>
          <h1 className='adoptty'>Thank you for trusting E-Pet Adopt!</h1>
        </div>
      </div>
    </div>
  );
};

export default Adopt;
