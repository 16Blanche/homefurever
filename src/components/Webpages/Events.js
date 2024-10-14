import React, { useState, useEffect, useContext } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import axios from 'axios';
import NavigationBar from './NavigationBar';
import TaskBar from './TaskBar';
import './Homepage.css';
import { PencilSquare, Trash } from 'react-bootstrap-icons';
import { Image } from 'react-bootstrap';
import config from '../config';
import AuthContext from '../../context/AuthContext';

const Events = () => {
    const [events, setEvents] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [showDateModal, setShowDateModal] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [newEvent, setNewEvent] = useState({ title: '', description: '', date: '', image: null });
    const [selectedDate, setSelectedDate] = useState('');
    const [dateEvents, setDateEvents] = useState([]);
    const [isViewOnly, setIsViewOnly] = useState(false);
    const [hoveredEvent, setHoveredEvent] = useState(null);
    const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 }); 
    const [tooltipWidth, setTooltipWidth] = useState(0);
    const { user, token } = useContext(AuthContext);
    const [currentFilterValue, setCurrentFilterValue] = useState(''); // New state for current filter value


    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            const response = await fetch(`${config.address}/api/events/all`);
            const data = await response.json();
            console.log('Fetched events:', data); // Log the fetched events
            setEvents(data.theEvent.map(event => ({
                title: event.e_title,
                start: event.e_date,
                location: event.e_location,
                extendedProps: { 
                    description: event.e_description, 
                    image: event.e_image // Ensure this contains the correct image path
                },
                id: event._id
            })));
        } catch (error) {
            console.error('Error fetching events:', error);
        }
    };
    
    

    const fetchEventsByDate = async (date) => {
        try {
            const response = await axios.get(`${config.address}/api/events/date/${date}`);
            setDateEvents(response.data.events.map(event => ({
                ...event,
                id: event._id
            })));
        } catch (error) {
            console.error('Error fetching events by date:', error);
        }
    };

    const handleDateClick = (info) => {
        const today = new Date().setHours(0, 0, 0, 0); 
        const selectedDate = new Date(info.dateStr).setHours(0, 0, 0, 0);
    
        setSelectedDate(info.dateStr);
        fetchEventsByDate(info.dateStr);
    
        const formattedDate = new Date(info.dateStr).toISOString().slice(0, 16);
    
        if (selectedDate < today) {
            setIsViewOnly(true);
        } else {
            setIsViewOnly(false);
            setNewEvent({
                title: '',
                description: '',
                date: formattedDate
            });
        }
    
        setShowDateModal(true);
    };

    const validateEvent = () => {
        return newEvent.title && newEvent.description && newEvent.date; // Simplified validation
    };

    const handleSaveEvent = async () => { 
        if (!validateEvent()) {
            alert("All fields must be filled out.");
            return;
        }
    
        const method = selectedEvent ? 'PUT' : 'POST';
        const url = selectedEvent
            ? `${config.address}/api/events/update/${selectedEvent.id}`
            : `${config.address}/api/events/new`;
    
        const formData = new FormData();
        formData.append("e_title", newEvent.title);
        formData.append("e_location", newEvent.location);
        formData.append("e_description", newEvent.description);
        formData.append("e_date", newEvent.date);
        
        // Handle image based on whether it's a new upload or not
        if (newEvent.image instanceof File) {
            formData.append("e_image", newEvent.image); // If it's a new file, append it
        } else if (selectedEvent) {
            // If editing an existing event and no new image is provided, retain the existing image
            formData.append("e_image", selectedEvent.e_image); 
        }
    
        try {
            const token = localStorage.getItem('token'); // Retrieve the token
    
            const response = await axios({
                method,
                url,
                data: formData,
                headers: {
                    'Authorization': `Bearer ${token}`, // Include authorization token
                    'Accept': 'application/json',
                    // Content-Type for FormData is automatically set by Axios
                }
            });
    
            // Expect JSON response if successful
            const savedEvent = response.data.theUpdateEvent || response.data.savedEvent; // Adjust based on your backend response
    
            // Update the state with the new or updated event
            if (selectedEvent) {
                // Update existing event in the state
                const updatedEvents = events.map(event =>
                    event._id === selectedEvent.id ? savedEvent : event
                );
                setEvents(updatedEvents);
            } else {
                // Add new event to the state
                setEvents([...events, savedEvent]);
            }
    
            setShowModal(false);
            setNewEvent({ title: '', description: '', date: '', image: null });
            setSelectedEvent(null);
            fetchEvents(); // Optionally fetch the updated list
            fetchEventsByDate(selectedDate); // If you need to refresh events by date
        } catch (error) {
            console.error('Error saving event:', error);
            alert('An unexpected error occurred. Please try again later.');
        }
    };
    
    

const handleEditEvent = (event) => {
    setSelectedEvent(event);
    setNewEvent({
        title: event.e_title,
        description: event.e_description,
        date: event.e_date,
        location: event.e_location
    });
    setShowModal(true);
};

    const handleDeleteEvent = (event) => {
        setSelectedEvent(event);
        setShowConfirmModal(true);
    };

    const confirmDeleteEvent = async () => {
        if (!selectedEvent) return;
    
        try {
            const token = localStorage.getItem('token'); // Retrieve the token
    
            await axios.delete(`${config.address}/api/events/delete/${selectedEvent.id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`, // Include authorization token
                    'Accept': 'application/json'
                }
            });
            
            setShowConfirmModal(false);
            setSelectedEvent(null);
            fetchEvents();
            fetchEventsByDate(selectedDate);
        } catch (error) {
            console.error('Error deleting event:', error);
            alert('An unexpected error occurred while deleting the event. Please try again later.');
        }
    };
    

    const handleMouseEnter = (info) => { 
        const eventRect = info.el.getBoundingClientRect(); 
        setTooltipPosition({
            top: eventRect.bottom + window.scrollY,
            left: eventRect.left + window.scrollX
        });
        setTooltipWidth(eventRect.width);
        setHoveredEvent({
            title: info.event.title,
            start: info.event.start,
            location: info.event.extendedProps.location,
            description: info.event.extendedProps.description,
        });
    };

    const handleMouseLeave = () => {
        setHoveredEvent(null);
    };

    return (
        <div className="eventsbox">
            <div className="navbox">
                <NavigationBar />
            </div>
            <div className="evbox2">
                <TaskBar />
                <div className="evbox3">
                    <h2 className="evtitle">EVENTS</h2>
                    <FullCalendar
                        plugins={[dayGridPlugin, interactionPlugin]}
                        initialView="dayGridMonth"
                        events={events}
                        dateClick={handleDateClick}
                        eventMouseEnter={handleMouseEnter}
                        eventMouseLeave={handleMouseLeave}
                        height="90%"
                    />
                </div>
            </div>

            {hoveredEvent && (
                <div 
                    className="evtooltip" 
                    style={{
                        width: tooltipWidth, 
                        top: tooltipPosition.top, 
                        left: tooltipPosition.left,
                    }}
                >
                    <strong>{hoveredEvent.title}</strong><br />
                    <p className='evhoverp'>{new Date(hoveredEvent.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                    <p>{hoveredEvent.location ? hoveredEvent.location : 'Location not available'}</p>
                </div>
            )}

            {/* Selected Date Modal */}
            <Modal show={showDateModal} onHide={() => setShowDateModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Events on {selectedDate}</Modal.Title>
                </Modal.Header>
                <Modal.Body className='evmodalbody'>
                    {dateEvents.length > 0 ? (
                        <ul>
                            {dateEvents.map(event => (
                                <li key={event.id}>
                                    <div className='evview'>
                                        <div className='evtitlebtn'>
                                            <div className='evtitlegrp'>
                                                <h2>{event.e_title} </h2>
                                            </div>
                                            <div className="evbutton-group">
                                                <Button variant="secondary" size="sm" onClick={() => handleEditEvent(event)}><PencilSquare/></Button>
                                                <Button variant="danger" size="sm" onClick={() => handleDeleteEvent(event)}><Trash/></Button>
                                            </div>
                                        </div>
                                        
                                        {/* Display the image */}
                                        {event.e_image && (
                                            <Image 
                                                src={`${config.address}${event.e_image}`} // Construct the full image URL
                                                alt={event.e_title} 
                                                fluid 
                                                className='evimg'
                                            />
                                        )}
                                        <p><strong>Location: </strong>{event.e_location}</p>
                                        <p><strong>Time: </strong>{new Date(event.e_date).toLocaleTimeString()}</p>
                                        <p>{event.e_description}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No events scheduled for this date.</p>
                    )}
                </Modal.Body>

                <Modal.Footer className="evmodalfooter">
                    {!isViewOnly && (
                        <Button variant="secondary" onClick={() => setShowModal(true)}>
                            Add Event
                        </Button>
                    )}
                </Modal.Footer>
            </Modal>

            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Add Event</Modal.Title>
                </Modal.Header>
                <Modal.Body className="evaddmodalbody">
                    <Form>
                        <Form.Group controlId="formEventTitle">
                            <Form.Label>Title</Form.Label>
                            <Form.Control
                                type="text"
                                value={newEvent.title}
                                onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group controlId="formEventLocation">
                            <Form.Label>Location</Form.Label>
                            <Form.Control
                                type="text"
                                value={newEvent.location}
                                onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group controlId="formEventDescription">
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                as="textarea"
                                value={newEvent.description}
                                onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group controlId="formEventDate">
                            <Form.Label>Date</Form.Label>
                            <Form.Control
                                type="datetime-local"
                                value={newEvent.date}
                                onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                                min={new Date().toISOString().slice(0, 16)}
                            />
                        </Form.Group>
                        <Form.Group controlId="formEventImage">
                            <Form.Label>Image</Form.Label>
                            <Form.Control
                                type="file"
                                onChange={(e) => setNewEvent({ ...newEvent, image: e.target.files[0] })}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer className="evmodalfooter">
                    <Button variant="primary" onClick={handleSaveEvent}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal show={showConfirmModal} onHide={() => setShowConfirmModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Deletion</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Are you sure you want to delete this event?</p>
                </Modal.Body>
                <Modal.Footer className="evmodalfooter">
                    <Button variant="secondary" onClick={() => setShowConfirmModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={confirmDeleteEvent}>
                        Delete
                    </Button>
                </Modal.Footer>
            </Modal>

            
        </div>
    );
};

export default Events;
