import React from "react"; 
import { useNavigate } from "react-router-dom";
import Button from 'react-bootstrap/Button';
import Image from 'react-bootstrap/Image';
import DogCatImg from './assets/dogcatpinkbg.png';
import Search from './assets/search.png';
import Calendar from './assets/calendar.png';
import Paw from './assets/paw.png';
import StartNavBar from "./StartNavBar";
import './Homepage.css';

const StartingPage = () => {
    const navigate = useNavigate();

    const handleLoginRedirect = () => {
        navigate('/login'); // Navigate to the login page
    };

    return (
        <div className="startbox1">
            <div className="startboxx">
                <div className="startbox2">
                    <StartNavBar/>
                    <div className="sbox2titles">
                        <p className="sbox2titlediv">
                            <span className="starttitle1">Providing</span>
                            <span className="starttitle2"> pets a</span>
                        </p>
                        <p className="sbox2titlediv">
                            <span className="starttitle3">Home,</span>
                            <span className="starttitle2"> and a</span>
                            <span className="starttitle1"> Family</span>
                        </p>
                        <p className="starttitle3 sbox2titlediv">to grow.</p>
                    </div>
                    {/* <div className="startimgbox">
                        <Image src={DogCatImg} className="startimg"></Image>
                    </div> */}
                </div>

                <div className="start-box-container">
                    <div className="start-box">
                        <Image src={Search} className="starticon"></Image>
                        <div className="start-service-title">Nearby Services</div>
                        <div className="start-service-desc">Look for nearby services around Pasay City for your furbaby</div>
                    </div>
                    <div className="start-box">
                        <Image src={Calendar} className="starticon"></Image>
                        <div className="start-service-title">Events</div>
                        <div className="start-service-desc">Be updated on the latest events in Pasay Animal Shelter</div>
                    </div>
                    <div className="start-box">
                        <Image src={Paw} className="starticon"></Image>
                        <div className="start-service-title">Adopt a Pet</div>
                        <div className="start-service-desc">Find your fur-ever pet</div>
                    </div>
                </div>

                {/* New "Why Adopt?" Section */}
                <div className="why-adopt-section">
                    
                    <div className="why-adopt-text-container">
                        <h2 className="why-adopt-title">Why <span className="highlight-adopt">Adopt?</span></h2>
                        <div className="why-adopt-line"/>
                        <div className="why-adopt-div">
                            <p className="why-adopt-text">Adopting a pet means saving a life and gaining a loyal friend.</p>
                        </div>
                        <div className="why-adopt-div">
                            <p className="why-adopt-text">Adopting frees space in shelters, giving more animals love and care.</p>
                        </div>
                        <div className="why-adopt-div">
                            <p className="why-adopt-text">Adopting reduces euthanasia and gives animals a chance at life.</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="copyright">
                (C) 2024 Websisters
            </div>

        </div>
    );
};

export default StartingPage;
