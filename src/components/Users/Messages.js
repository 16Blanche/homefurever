import React from 'react';
import { Link } from 'react-router-dom';
import './Users.css';
import Image from 'react-bootstrap/Image';
import Button from 'react-bootstrap/Button';
import UserPh from './assets/userph.jpg';
import Attachment from './assets/attachment.png';
import PinkNavigationBar from './PinkNavigationBar';


const Messages = () => {
  return (
    <div className='box'>
      <div className='navbar2'>
        <PinkNavigationBar/>
      </div>
      <div className="mesxbox3">
                        <div className="meschat-container">
                            <div className="meschat-sidebar">
                                <div className="meschat-header">Messages</div>
                                <div className="meschat-search">
                                    <input type="text" placeholder="Search for people" />
                                </div>
                                <div className="meschat-list">
                                    <div className="mesactive-chat-item">
                                        <Image src={UserPh} roundedCircle className="meschat-item-img" />
                                        <div className="meschat-item-content">
                                            <div className="meschat-item-name">Pasay Animal Shelter</div>
                                            <div className="meschat-item-message">You: Okay, thank you!</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="meschat-area">
                                <div className="meschat-area-header">
                                    <Image src={UserPh} roundedCircle className="meschat-area-img" />
                                    <div className="meschat-area-name">Pasay Animal Shelter</div>
                                </div>
                                <div className="mescline"/>
                                <div className="meschat-messages">

                                    <div className="messender">
                                        <div className="meschat-message">
                                            <Image src={UserPh} roundedCircle className="mesmessage-img" />
                                            <div className="mesmessage-text">We have received your application form. We will review it and then schedule a time for you to meet the pet you are interested in.</div>
                                        </div>

                                    </div>

                                    <div className="mesrecepient">
                                        <div className="mesrchat-message">
                                            <div className="mesrmessage-text">Okay, thank you!</div>
                                            <Image src={UserPh} roundedCircle className="message-img" />
                                        </div>

                                    </div>
                                </div>


                                <div className="meschat-input">
                                    <Image src={Attachment} className="mescattachment" />

                                        <input type="text" placeholder="Type your message" className="meschatinp" />
                                    <div>
                                    <Button className="mescsend-button">Send</Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
    </div>
  );
};

export default Messages;
