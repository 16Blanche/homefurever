import { Link, useNavigate, useParams } from "react-router-dom";
import axios from 'axios';
import React, { useState, useEffect } from "react";
import PinkNavigationBar from "./PinkNavigationBar";
import "./Users.css";
import imgpholder from "./assets/vaccination.png";
import Image from 'react-bootstrap/Image';

const UserEvents = () => {
    const [events, setEvents] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const eventsPerPage = 3; // Number of events per page
    const [loading, setLoading] = useState(true); // Loading state

    // Fetch all events on component mount
    useEffect(() => {
        axios.get('http://localhost:8000/api/events/all')  // Update the URL if necessary
            .then((response) => {
                setEvents(response.data.theEvent || []);  // Ensure 'theEvent' exists
                setLoading(false);
            })
            .catch((err) => {
                console.error('Error fetching events:', err);
                setLoading(false);
            });
    }, []);

    // Function to format event dates
    const formatDate = (eventDate) => {
        const date = new Date(eventDate);

        // Extract date components
        const day = date.getDate();
        const dayOfWeek = date.toLocaleString('default', { weekday: 'long' });
        const month = date.toLocaleString('default', { month: 'short' });
        const year = date.getFullYear();
        const time = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        return { day, dayOfWeek, month, year, time };
    };

    // Filter out past events and keep only upcoming ones
    const upcomingEvents = events.filter(event => {
        const eventDate = new Date(event.e_date);
        const currentDate = new Date();
        // Normalize dates by setting the time to 00:00:00 to compare only dates
        eventDate.setHours(0, 0, 0, 0);
        currentDate.setHours(0, 0, 0, 0);
        return eventDate >= currentDate; // Events today or in the future
    });

    // Calculate total pages
    const totalPages = Math.ceil(upcomingEvents.length / eventsPerPage) || 1;

    // Ensure currentPage is within valid range
    useEffect(() => {
        if (currentPage > totalPages) {
            setCurrentPage(1);
        }
    }, [currentPage, totalPages]);

    // Get current events for the page
    const indexOfLastEvent = currentPage * eventsPerPage;
    const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
    const currentEvents = upcomingEvents.slice(indexOfFirstEvent, indexOfLastEvent);

    // Function to change page
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div className="box">
            <div className="navbox">
                <PinkNavigationBar />
            </div>

            <div className="ueventsbox">
                <div className="ueventsbox1">
                    <div className="ueventsline" />
                    <div className="ueventsbox2">
                        <h1>UPCOMING EVENTS</h1>
                        <p>at Pasay Animal Shelter</p>
                    </div>
                </div>

                <div className="ueventsbox3">
                    <p className="ueventsupcoming">Upcoming Events</p>

                    {/* Loading Indicator */}
                    {loading ? (
                        <p className="loading">Loading events...</p>
                    ) : upcomingEvents.length > 0 ? (
                        <>
                            {/* Display Current Events */}
                            {currentEvents.map((event) => {
                                const { day, dayOfWeek, month, year, time } = formatDate(event.e_date);
                                return (
                                    <div className="ueventscontainer" key={event._id}>
                                        <div className="ueventsline2" />
                                        <div className="ueventsimgbox">
                                            <Image src={imgpholder} className="ueventsimg" alt="Event" />
                                        </div>
                                        <p className="ueventsday">{day}</p>
                                        <div className="ueventsbox4">
                                            <h2>{dayOfWeek}</h2>
                                            <h4>{month}, {year}</h4>
                                            <p>{time}</p>
                                        </div>
                                        <div className="ueventsbox5">
                                            <h2>{event.e_title}</h2>
                                            <p>{event.e_description}</p>
                                        </div>
                                    </div>
                                );
                            })}

                            {/* Pagination Controls */}
                            {totalPages > 1 && (
                                <div className="pagination-container">
                                    <button 
                                        className="pagination-button" 
                                        onClick={() => paginate(currentPage - 1)} 
                                        disabled={currentPage === 1}
                                    >
                                        &lt; Prev
                                    </button>

                                    {/* Page Numbers */}
                                    {[...Array(totalPages)].map((_, index) => (
                                        <button 
                                            key={index + 1} 
                                            onClick={() => paginate(index + 1)} 
                                            className={`pagination-button ${currentPage === index + 1 ? 'active' : ''}`}
                                        >
                                            {index + 1}
                                        </button>
                                    ))}

                                    <button 
                                        className="pagination-button" 
                                        onClick={() => paginate(currentPage + 1)} 
                                        disabled={currentPage === totalPages}
                                    >
                                        Next &gt;
                                    </button>
                                </div>
                            )}
                        </>
                    ) : (
                        // Message when there are no upcoming events
                        <p className="no-upcoming-events">There are no upcoming events.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserEvents;
