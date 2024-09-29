import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import axios from 'axios';
import NavigationBar from './NavigationBar';
import TaskBar from './TaskBar';
import './Homepage.css';

const Events = () => {
    const [events, setEvents] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [showDateModal, setShowDateModal] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [newEvent, setNewEvent] = useState({ title: '', description: '', date: '' });
    const [selectedDate, setSelectedDate] = useState('');
    const [dateEvents, setDateEvents] = useState([]);
    const [isViewOnly, setIsViewOnly] = useState(false); // New state for view-only mode

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            const response = await fetch('http://localhost:8000/api/events/all');
            const data = await response.json();
            setEvents(data.theEvent.map(event => ({
                title: event.e_title,
                start: event.e_date,
                extendedProps: { description: event.e_description },
                id: event._id
            })));
        } catch (error) {
            console.error('Error fetching events:', error);
        }
    };

    const fetchEventsByDate = async (date) => {
        try {
            const response = await axios.get(`http://localhost:8000/api/events/date/${date}`);
            setDateEvents(response.data.events.map(event => ({
                ...event,
                id: event._id
            })));
        } catch (error) {
            console.error('Error fetching events by date:', error);
        }
    };

    const handleDateClick = (info) => {
        const today = new Date().setHours(0, 0, 0, 0); // Set time to midnight for comparison
        const selectedDate = new Date(info.dateStr).setHours(0, 0, 0, 0); // Set selected date to midnight

        setSelectedDate(info.dateStr);
        fetchEventsByDate(info.dateStr);

        if (selectedDate < today) {
            setIsViewOnly(true); // Set view-only mode
        } else {
            setIsViewOnly(false); // Normal mode
            setNewEvent({
                title: '',
                description: '',
                date: info.dateStr // Set default date in proper format
            });
        }

        setShowDateModal(true); // Show the modal
    };

    const validateEvent = () => {
        if (!newEvent.title || !newEvent.description || !newEvent.date) {
            return false; // At least one field is empty
        }
        return true; // All fields are filled
    };

    const handleSaveEvent = async () => {
        if (!validateEvent()) {
            alert("All fields must be filled out."); // Alert user if validation fails
            return; // Exit function if validation fails
        }

        const method = selectedEvent ? 'PUT' : 'POST';
        const url = selectedEvent
            ? `http://localhost:8000/api/events/update/${selectedEvent.id}`
            : 'http://localhost:8000/api/events/new';

        try {
            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    e_title: newEvent.title,
                    e_description: newEvent.description,
                    e_date: newEvent.date
                })
            });

            if (response.ok) {
                setShowModal(false);
                setNewEvent({ title: '', description: '', date: '' });
                setSelectedEvent(null);
                fetchEvents();
                fetchEventsByDate(selectedDate);
            }
        } catch (error) {
            console.error('Error saving event:', error);
        }
    };

    const handleEditEvent = (event) => {
        setSelectedEvent(event);
        setNewEvent({
            title: event.e_title,
            description: event.e_description,
            date: event.e_date
        });
        setShowModal(true);
    };

    const handleDeleteEvent = (event) => {
        setSelectedEvent(event); // Set the event to be deleted
        setShowConfirmModal(true); // Open the confirmation modal
    };

    const confirmDeleteEvent = async () => {
        if (!selectedEvent) return;

        try {
            await axios.delete(`http://localhost:8000/api/events/delete/${selectedEvent.id}`);
            setShowConfirmModal(false); // Close the confirmation modal
            setSelectedEvent(null); // Reset selectedEvent to null
            fetchEvents();
            fetchEventsByDate(selectedDate);
        } catch (error) {
            console.error('Error deleting event:', error);
        }
    };

    return (
        <div className="box">
            <div className="navbox">
                <NavigationBar />
            </div>
            <div className="evbox2">
                <TaskBar />
                <div className="evbox3">
                    <h2 className="evtitle">Events</h2>
                    <FullCalendar
                        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                        initialView="dayGridMonth"
                        events={events}
                        dateClick={handleDateClick}
                        height="90%"
                    />
                </div>
            </div>

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
                                    <div>
                                        <strong>{event.e_title}</strong> - {new Date(event.e_date).toLocaleTimeString()} <br />
                                        {event.e_description}
                                    </div>
                                    <div className="button-group">
                                        <Button variant="secondary" size="sm" onClick={() => handleEditEvent(event)}>Edit</Button>
                                        <Button variant="danger" size="sm" onClick={() => handleDeleteEvent(event)}>Delete</Button>
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
                <Modal.Body className='evmodalbody'>
                    <Form>
                        <Form.Group controlId="formEventTitle">
                            <Form.Label>Title</Form.Label>
                            <Form.Control
                                type="text"
                                value={newEvent.title}
                                onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
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
                                min={new Date().toISOString().slice(0, 16)} // Set min to current date and time
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
