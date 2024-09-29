import React from 'react';
import { useNavigate } from 'react-router-dom';
import Welcomehp from './assets/mainbg.png'; 
import './Users.css'; 
import PinkNavigationBar from './PinkNavigationBar';

const ContinueAdoption = () => {
  const navigate = useNavigate();

  const handleContinueClick = () => {
    navigate('/recommended'); 
  };

  const handleBackHomeClick = () => {
    navigate('/browse/pets'); 
  };

  return (
    <div className='box'>
      <div className='pnavbox'>
        <PinkNavigationBar/>
      </div>
      <div className="continue-container">
        <headerca className="headerca">
          <h1 >Hi, Anne!</h1>
          <p>You have successfully created an account.</p>
        </headerca>
        <div className="bannerca">
          <img require src={Welcomehp} alt="Welcome to E-Pet Adopt" className="cabanner-image" />
        </div>
        <div className="button-containerca">
          <button className="continue-buttonca" onClick={handleContinueClick}>Continue Adoption</button>
          <button className="back-buttonca" onClick={handleBackHomeClick}>Back to Home</button>
        </div>
      </div>
    </div>
  );
};

export default ContinueAdoption;
