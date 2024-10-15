import React from "react";
import Image from 'react-bootstrap/Image';
import PinkNavigationBar from "./PinkNavigationBar";
import "./Users.css";
import Phone from "./assets/Phone.png";
import Catdog from "./assets/Catdog.png";
import Telephone from "./assets/Telephone.png";
import LoggedOutNavbar from "./LoggedOutNavBar";

const LoggedOutAboutUs = () => {
    return (
        <div className="aboutusbox">
            <div className="navbox">
                <LoggedOutNavbar />
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
            </div>
        </div>
    );
};

export default LoggedOutAboutUs;
