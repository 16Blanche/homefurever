import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Users.css'; 

const DataPrivacy = () => {
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate('/profiling');
  };

  const handleSignUpClick = () => {
    navigate('/continue/adoption');
  };

  return (
    <div className="privacy-containerdp">
      <header className="headerdp">
        <h1>Data Privacy Statement</h1>
        <p>Your privacy is important to us. This statement outlines how we collect, use, and protect your information when you sign up for our service.</p>
        <p>Here's a summary of how we handle your information:</p>
      </header>
      <div className="contentdp">
        <div className="left-columndp">
          <h2 className='dph2'>What We Collect:</h2>
          <ul className='dpulli'>
            <li>Basic info like name, email, phone, and address.</li>
            <li>Additional details about your preferences and usage of our app.</li>
          </ul>
          <h2 className='dph2'>How We Use It:</h2>
          <ul className='dpulli'>
            <li>To manage your account and deliver our services.</li>
            <li>To personalize your experience and send relevant updates.</li>
            <li>To analyze trends and improve our app.</li>
          </ul>
          <h2 className='dph2'>Security & Sharing:</h2>
          <ul className='dpulli'>
            <li>We keep your data secure and don't sell it to third parties.</li>
            <li>Trusted partners may access your info to support our services.</li>
          </ul>
        </div>
        <div className="right-columndp">
          <h2 className='dph2'>Your Rights:</h2>
          <ul className='dpulli'>
            <li>You can access, correct, or delete your data anytime.</li>
          </ul>
          <h2 className='dph2'>Contact Us:</h2>
          <ul className='dpulli'>
            <li> For questions or concerns, reach out to us.</li>
          </ul>
        </div>
      </div>
      <div className="footerdp">
        <p>By signing up, you acknowledge our privacy practices.</p>
        <div className="button-containerdp">
          <button className="back-buttondp" onClick={handleBackClick}>Back</button>
          <button className="sign-up-buttondp" onClick={handleSignUpClick}>Sign Up</button>
        </div>
      </div>
    </div>
  );
};

export default DataPrivacy;
