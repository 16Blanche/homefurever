import { Link, useNavigate, useParams } from "react-router-dom";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import Image from 'react-bootstrap/Image';
import TheImage from './assets/mainbg.png'
import TheLogo from './assets/logo.png'
import EventsImg from './assets/events.png'
import AvailableImg from './assets/availablefb.png'
import AdoptedImg from './assets/adoptedfb.png'
import AddUsersImg from './assets/addusers.png'
import './Homepage.css';
import classNames from "classnames";
import TaskBar from "./TaskBar";
import NavigationBar from "./NavigationBar";
import AnimalGraph from "./assets/animalgraph.png";

 

const Homepage=()=>{
    const [summary, setSummary] = useState({ 
        catCount: 0, 
        dogCount: 0,
        adoptedCatCount: 0, 
        adoptedDogCount: 0,
        pendingCount: 0,
        verifiedCount: 0
    });

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [adoptedResponse, availableResponse, pendingResponse, verifiedResponse] = await Promise.all([
                    axios.get('http://localhost:8000/api/dashboard/adopted'),
                    axios.get('http://localhost:8000/api/dashboard/pets'),
                    axios.get('http://localhost:8000/api/dashboard/pending'),
                    axios.get('http://localhost:8000/api/dashboard/verified')
                ]);
                setSummary({
                    adoptedCatCount: adoptedResponse.data.adoptedCatCount,
                    adoptedDogCount: adoptedResponse.data.adoptedDogCount,
                    catCount: availableResponse.data.catCount,
                    dogCount: availableResponse.data.dogCount,
                    pendingCount: pendingResponse.data.pendingCount,
                    verifiedCount: verifiedResponse.data.verifiedCount
                });
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return <p>Loading...</p>;
    }


    return (
        <>
            <div className="box">
                <div className="navbox">
                <NavigationBar/>
                </div>

                <div className="box2">
                    <TaskBar/>
                    <div className="box3">

                        <div className="gradient">
                            <Image require src={TheImage} className="mainbg"></Image>
                        </div>
                        
                        <div className="box4">
                            <div className="greenbox">
                                <h2 className="box4title">Adopted Furbabies</h2>
                                <div className="box4content">
                                    <div className="box4fbtext">
                                        <p className="fbtext">{summary.adoptedDogCount} Dogs</p>
                                        <p className="fbtext">{summary.adoptedCatCount} Cats</p>
                                    </div>
                                    <div className="box4imgbox">
                                    <Image require src={AdoptedImg} className="box4img"></Image>
                                    </div>
                                </div>
                            </div>

                            <div className="pinkbox">
                                <h2 className="box4title">Available Furbabies</h2>
                                <div className="box4content">
                                    <div className="box4fbtext">
                                        <p className="fbtext">{summary.dogCount} Dogs</p>
                                        <p className="fbtext">{summary.catCount} Cats</p>
                                    </div>
                                    <div className="box4imgbox">
                                    <Image require src={AvailableImg} className="availableimg"></Image>
                                    </div>
                                </div>
                            </div>

                            <div className="greenbox">
                                <h2 className="box4title">Events</h2>
                                <div className="box4content">
                                    <div className="box4text">
                                        <p className="frtext">Free Vaccines</p>
                                        <p className="frtext">Fundraising Event</p>
                                        <p className="frtext">Senior Pet Adoption</p>
                                    </div>
                                    <div className="box4imgbox">
                                    <Image require src={EventsImg} className="box4img"></Image>
                                    </div>
                                </div>
                            </div>

                            <div className="pinkbox">
                                <h2 className="box4title">Users</h2>
                                <div className="box4content">                                
                                    <div className="box4fbtext">
                                        <p className="fbtext">{summary.verifiedCount} Registered</p>
                                        <p className="fbtext">{summary.pendingCount} Pending</p>
                                    </div>
                                    <div className="box4imgbox">
                                    <Image require src={AddUsersImg} className="box4img"></Image>
                                    </div>
                                    
                                </div>
                            </div>

                        </div>

                        <div className="brgybox">
                            <div className="brgygraph">
                                <h1 className="graphtitle">Animal Population in Pasay City</h1>
                                <Image require src={AnimalGraph} className="graphimg"></Image>
                            </div>

                        </div>

                    </div>
                        
                </div>

                </div>
                
        </>
      );
    }
export default Homepage;