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
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';
import config from '../config';
ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const Homepage = () => {
  const [summary, setSummary] = useState({ 
    catCount: 0, 
    dogCount: 0,
    adoptedCatCount: 0, 
    adoptedDogCount: 0,
    pendingCount: 0,
    verifiedCount: 0
  });

  const [loading, setLoading] = useState(true);
  const [barangayData, setBarangayData] = useState({}); 
  const [events, setEvents] = useState([]); 

  useEffect(() => {
    const fetchSummaryData = async () => {
      try {
        const [
          adoptedResponse, 
          availableResponse, 
          pendingResponse, 
          verifiedResponse, 
          barangayResponse, 
          eventsResponse 
        ] = await Promise.all([
          axios.get(`${config.address}/api/dashboard/adopted`),
          axios.get(`${config.address}/api/dashboard/pets`),
          axios.get(`${config.address}/api/dashboard/pending`),
          axios.get(`${config.address}/api/dashboard/verified`),
          axios.get(`${config.address}/api/barangay/all`), 
          axios.get(`${config.address}/api/events/all`) 
        ]);

        const barangayCounts = {};
        barangayResponse.data.theInfo.forEach(row => {
          const barangay = row.b_barangay;
          if (barangayCounts[barangay]) {
            barangayCounts[barangay] += 1;
          } else {
            barangayCounts[barangay] = 1;
          }
        });

        const sortedBarangays = Object.entries(barangayCounts)
          .sort((a, b) => b[1] - a[1]) 
          .slice(0, 20); 

        const topBarangayLabels = sortedBarangays.map(([barangay]) => barangay);
        const topBarangayCounts = sortedBarangays.map(([, count]) => count);

        setBarangayData({ labels: topBarangayLabels, counts: topBarangayCounts });

        setSummary({
          adoptedCatCount: adoptedResponse.data.adoptedCatCount,
          adoptedDogCount: adoptedResponse.data.adoptedDogCount,
          catCount: availableResponse.data.catCount,
          dogCount: availableResponse.data.dogCount,
          pendingCount: pendingResponse.data.pendingCount,
          verifiedCount: verifiedResponse.data.verifiedCount
        });

        const today = new Date();
        const upcomingEvents = eventsResponse.data.theEvent
          .filter(event => {
            const eventDate = new Date(event.e_date); 
            eventDate.setHours(0, 0, 0, 0); 
            return eventDate >= today;
          })
          .sort((a, b) => new Date(a.e_date) - new Date(b.e_date)) 
          .slice(0, 3); 

        setEvents(upcomingEvents);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    // Call the fetch function
    fetchSummaryData();
  }, []);
  

  if (loading) {
    return <p>Loading...</p>;
  }

  const barangayLabels = Object.keys(barangayData);
  const barangayCounts = Object.values(barangayData); 

  const chartData = {
    labels: barangayData.labels, 
    datasets: [
      {
        label: 'Number of Animals per Barangay',
        data: barangayData.counts,
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Number of Animals'
        }
      },
      x: {
        title: {
          display: true,
          text: 'Barangay'
        }
      }
    },
    plugins: {
      legend: {
        display: true,
        position: 'top'
      }
    }
  };



    return (
        <>
            <div className="homebox">
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
                                <h2 className="box4title">Upcoming Events</h2>
                                <div className="box4content">
                                    <div className="box4text">
                                    {events.length > 0 ? (
                                        events.map((event, index) => (
                                        <p className="frtext" key={index}>
                                            {event.e_title}
                                        </p>

                                        ))
                                    ) : (
                                        <p className="frtext">No Upcoming Events</p>
                                    )}
                                        
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
                            <h1 className="graphtitle">HIGHEST BARANGAY ANIMAL RECORD</h1>
                            <div className="graph-container">
                            <Bar data={chartData} options={chartOptions} />
                            </div>
                        </div>
                        </div>

                    </div>
                        
                </div>

                </div>
                
        </>
      );
    }
export default Homepage;