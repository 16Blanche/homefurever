import { Link, useNavigate, useParams } from "react-router-dom";
import React from "react";
import Button from 'react-bootstrap/Button';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import Image from 'react-bootstrap/Image';
import TheImage from './assets/mainbg.png'
import './Homepage.css';
import TaskBar from "./TaskBar";
import NavigationBar from "./NavigationBar";

const Events=()=>{
    return (
        <>
            <div className="box">
                <div className="navbox">
                    <NavigationBar />
                </div>
                <div className="box2">
                    <TaskBar />
                    <div className="evbox3">
                    <div className="evbox5">
                                <h2 className="evtitle">Events</h2>
                                <div className="evbutton-group">
                                    <Button className="evneweventbtn" variant="outline-pink">Add Event</Button>
                                    <Button className="evneweventbtn" variant="outline-pink">Delete Event</Button>
                                    <Button className="evneweventbtn" variant="outline-pink">Edit Event</Button>
                                </div>
                            </div>
                        <div className="evbox4">
                            
                            <div className="events-list">
                                <div className="evitem">
                                    <div className="evdate">
                                        <div>June</div>
                                        <div>7</div>
                                        <div>10:00 AM</div>
                                    </div>
                                    <div className="evdetails">
                                        <h3 className="evsubtitle">Free Vaccine</h3>
                                        <p>Join us for a day dedicated to keeping our furry friends healthy and happy! Our Free Vaccines Event offers complimentary vaccinations for pets, ensuring they're protected against common diseases. Bring your pets and give them the gift of wellness.</p>
                                    </div>
                                </div>
                                <div className="evitem">
                                    <div className="evdate">
                                        <div>Feb</div>
                                        <div>1</div>
                                        <div>1:30 PM</div>
                                    </div>
                                    <div className="evdetails">
                                        <h3 className="evsubtitle">Fundraising Event</h3>
                                        <p>Help us make a difference in the lives of animals in need! Our Fundraising Event brings together animal lovers and advocates for a day filled with fun activities, delicious food, and heartwarming stories. Every donation counts, whether big or small, in supporting our mission to provide care, shelter, and love to animals awaiting their forever homes.</p>
                                    </div>
                                </div>
                                <div className="evitem">
                                    <div className="evdate">
                                        <div>Feb</div>
                                        <div>5</div>
                                        <div>8:00 AM</div>
                                    </div>
                                    <div className="evdetails">
                                        <h3 className="evsubtitle">Senior Pet Adoption</h3>
                                        <p>Join us for our Senior Pet Adoption event, where mature pets are celebrated and cherished. These wise companions have so much love to give and are looking for a special someone to share their golden years with. Whether you're a seasoned pet owner or new to the joys of pet companionship, consider giving a senior pet a second chance at happiness.</p>
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

export default Events;