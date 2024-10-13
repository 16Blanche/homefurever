import { Link, useNavigate, useParams } from "react-router-dom";
import axios from 'axios';
import React, { useState, useEffect } from "react";
import PinkNavigationBar from "./PinkNavigationBar";
import "./Users.css";
import imgpholder from "./assets/vaccination.png";
import Image from 'react-bootstrap/Image';
import { Button } from "react-bootstrap";
import Modal from 'react-bootstrap/Modal';
import config from '../config';

const UserEvents = () => {
    const [events, setEvents] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const eventsPerPage = 3;
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);

    useEffect(() => {
        axios.get(`${config.address}/api/events/all`)
            .then((response) => {
                setEvents(response.data.theEvent || []);
                setLoading(false);
            })
            .catch((err) => {
                console.error('Error fetching events:', err);
                setLoading(false);
            });
    }, []);

    const formatDate = (eventDate) => {
        const date = new Date(eventDate);

        const day = date.getDate();
        const dayOfWeek = date.toLocaleString('default', { weekday: 'long' });
        const month = date.toLocaleString('default', { month: 'short' });
        const year = date.getFullYear();
        const time = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        return { day, dayOfWeek, month, year, time };
    };

    const upcomingEvents = events
        .filter(event => {
            const eventDate = new Date(event.e_date);
            const currentDate = new Date();
            eventDate.setHours(0, 0, 0, 0);
            currentDate.setHours(0, 0, 0, 0);
            return eventDate >= currentDate;
        })
        .sort((a, b) => new Date(a.e_date) - new Date(b.e_date));

    const totalPages = Math.ceil(upcomingEvents.length / eventsPerPage) || 1;

    useEffect(() => {
        if (currentPage > totalPages) {
            setCurrentPage(1);
        }
    }, [currentPage, totalPages]);

    const indexOfLastEvent = currentPage * eventsPerPage;
    const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
    const currentEvents = upcomingEvents.slice(indexOfFirstEvent, indexOfLastEvent);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const handleEventClick = (event) => {
        setSelectedEvent(event);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setSelectedEvent(null);
    };

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

                    {loading ? (
                        <p className="loading">Loading events...</p>
                    ) : upcomingEvents.length > 0 ? (
                        <>
                            {currentEvents.map((event) => {
                                const { day, dayOfWeek, month, year, time } = formatDate(event.e_date);
                                return (
                                    <Button onClick={() => handleEventClick(event)} className="ueventscontainer" key={event._id}>
                                        <div className="ueventsline2" />
                                        <Image
                                            className="ueventsimg"
                                            src={
                                                event.e_image && event.e_image.length > 0 
                                                    ? `${config.address}${event.e_image}` 
                                                    : imgpholder
                                            }
                                            alt={event.e_title}
                                        />
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
                                    </Button>
                                );
                            })}

                            {/* Modal for Event Details */}
                            <Modal className="ueventsmodal" show={showModal} onHide={closeModal}>
                                <Modal.Header closeButton>
                                    <Modal.Title>{selectedEvent?.e_title}</Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                    {selectedEvent && (
                                        <div>
                                            <div className="uevents-imagecontainer">
                                                <Image 
                                                    src={selectedEvent.e_image && selectedEvent.e_image.length > 0 // Ensure e_image is not empty
                                                        ? `${config.address}${selectedEvent.e_image}`
                                                        : imgpholder}
                                                    alt="Event Image"
                                                    className="uevents-image" 
                                                />
                                            </div>
                                            <div className="uevents-modetails">
                                                <h1><strong>Date:</strong> {formatDate(selectedEvent.e_date).day} {formatDate(selectedEvent.e_date).month} {formatDate(selectedEvent.e_date).year}</h1>
                                                <h2><strong>Time:</strong> {formatDate(selectedEvent.e_date).time}</h2>
                                                <p>{selectedEvent.e_description}</p>
                                            </div>
                                        </div>
                                    )}
                                </Modal.Body>
                                <Modal.Footer>
                                    <Button variant="secondary" onClick={closeModal}>
                                        Close
                                    </Button>
                                </Modal.Footer>
                            </Modal>

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
                        <p className="no-upcoming-events">There are no upcoming events.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserEvents;
