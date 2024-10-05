import React from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Homepage from "./Homepage";
import Button from 'react-bootstrap/Button';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import './Homepage.css';
import Image from 'react-bootstrap/Image';
import TaskBar from "./TaskBar";
import NavigationBar from "./NavigationBar";
import UserPh from './assets/userph.jpg';
import Attachment from './assets/attachment.png';

const Chatroom = () => {
    return (
        <>
            <div className="ulbox">
                <div className="navbox">
                    <NavigationBar />
                </div>
                <div className="box2">
                    <TaskBar />
                    <div className="box3">
                        <div className="chat-container">
                            <div className="chat-sidebar">
                                <div className="chat-header">Messages</div>
                                <div className="chat-search">
                                    <input type="text" placeholder="Search for people" />
                                </div>
                                <div className="chat-list">
                                    <div className="active-chat-item">
                                        <Image src={UserPh} roundedCircle className="chat-item-img" />
                                        <div className="chat-item-content">
                                            <div className="chat-item-name">Elicah Janica</div>
                                            <div className="chat-item-message">Elicah Janica: Okay, thank you!</div>
                                        </div>
                                    </div>
                                    <div className="chat-item">
                                        <Image src={UserPh} roundedCircle className="chat-item-img" />
                                        <div className="chat-item-content">
                                            <div className="chat-item-name">Kween Erza</div>
                                            <div className="chat-item-message">Kween Erza: Thank you so much!</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="chat-area">
                                <div className="chat-area-header">
                                    <Image src={UserPh} roundedCircle className="chat-area-img" />
                                    <div className="chat-area-name">Elicah Janica</div>
                                </div>
                                <div className="cline"/>
                                <div className="chat-messages">

                                    <div className="recepient">
                                        <div className="rchat-message">
                                            <Image src={UserPh} roundedCircle className="message-img" />
                                            <div className="rmessage-text">Okay, thank you!</div>
                                        </div>

                                    </div>

                                    <div className="csender">
                                        <div className="chat-message">
                                            <div className="message-text">We have received your application form. We will review it and then schedule a time for you to meet the pet you are interested in.</div>
                                            <Image src={UserPh} roundedCircle className="message-img" />
                                        </div>

                                    </div>
                                </div>


                                <div className="chat-input">
                                    <Image src={Attachment} className="cattachment" />

                                        <input type="text" placeholder="Type your message" className="chatinp" />
                                    <div>
                                    <Button className="csend-button">Send</Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Chatroom;
