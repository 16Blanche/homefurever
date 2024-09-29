import { Link, useNavigate, useParams } from "react-router-dom";
import React from "react";
import Button from 'react-bootstrap/Button';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import Image from 'react-bootstrap/Image';
import TaskBar from "./TaskBar";
import PinkNavigationBar from "./PinkNavigationBar";
import Homepage from "./Homepage.css";
import Phone from "./assets/Phone.png";
import Fbb from "./assets/Fbb.png";
import Catdog from "./assets/Catdog.png";
import Telephone from "./assets/Telephone.png";
import NavigationBar from "./NavigationBar";

const AdminAboutUs = () => {
    return (
        <div className="aboutusbox">
            <div className="navbox">
                <NavigationBar />
            </div>

                <div className="aboutusbox3">
                    <div className="aboutusbox4">
                        <h1 className="aboutush1">About Us</h1>
                        <div className="aboutusbox5">
                            <p className="aboutustext">E-Pet Adopt is a manifestation of our deep passion for providing pets a loving home and family to grow.</p>
                        </div>

                        <h1 className="aboutush1">Contact Us</h1>
                        <div className="aboutusbox7">
                            <div className="aboutusbox6">
                                <div className="aboutusbox8">
                                    <Image src={Telephone} className="aboutusicons" />
                                    <p className="aboutuscontact"> 804 0185</p>
                                </div>
                                <div className="aboutusbox8">
                                    <Image src={Phone} className="aboutusicons" />
                                    <p className="aboutuscontact"> 0915 530 1934</p>
                                </div>
                            </div>
                            <div className="aboutusbox6">

                            </div>
                        </div>

                    </div>
                    <div className="aboutusbox4">
                    <Image src={Catdog} className="aboutuscatdog" />

                    </div>
 
                    {/* <h1 className="text-center2">About Us</h1>
                    <p className="lead">E-Pet Adopt is a manifestation of our deep passion for providing pets a loving home and family to grow.</p>

                    <div className="my-3 p-3 bg-light rounded">
                        <h4>Developed by: WEBSISTERS</h4>
                        <p>(Amil, Castillo, David, Estipona, Fayo)</p>
                    </div>
        
                    <div className="">
                        <h2 className="my-6">Contact Us</h2>
                        <p className="my-7"><Image src={Phone} width="24" /> 804 0185</p>
                        <p className="my-8"> <Image src={Phone} width="24" /> 0915 530 1934</p>
                        <div className="social-icons">
                        <p className="my-7"><Image src={Fbb} width="24" /> Pasay Animal Shelter</p> 
                        </div>
                    </div>
                    <div className="about-us-image">
                            <Image src={Catdog} fluid className="" />
                        </div> */}

                </div>

        </div>
    );
};

export default AdminAboutUs;
