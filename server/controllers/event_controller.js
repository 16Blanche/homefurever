const Event = require('../models/events_model');
const {logActivity} = require('./activitylog_controller');

const newEvent = async (req, res) => {
    const { e_title, e_description, e_date, e_location } = req.body;

    // Get the image path
    const e_image = req.file ? `/uploads/images/${req.file.filename}` : null; // Save the image path

    try {
        if (!e_image) {
            return res.status(400).json({ error: 'Image upload failed' });
        }

        // Create a new event instance
        const event = new Event({
            e_title,
            e_location,
            e_description,
            e_date,
            e_image // Save the image path
        });

        // Save the event to the database
        const savedEvent = await event.save();
        
        console.log('Event created successfully:', savedEvent);

        // Log activity for creating the event
        const adminId = req.user && (req.user._id || req.user.id);
        const logMessage = `Created new event.`;
        await logActivity(adminId, 'ADD', 'Events', savedEvent._id, e_title, logMessage);

        res.status(201).json({ savedEvent, status: "successfully inserted" });
    } catch (err) {
        console.error("Error creating event:", err);
        res.status(500).json({ message: 'Something went wrong', error: err });
    }
};




const findAllEvents = (req, res) => {
    Event.find()
        .then((allDaEvent) => {
            res.json({ theEvent: allDaEvent })
        }) 
        .catch((err) => {
            res.json({ message: 'Something went wrong', error: err })
        });
};

const findEventsByDate = async (req, res) => {
    const { date } = req.params;

    try {
        const events = await Event.find({ e_date: { $regex: new RegExp(`^${date}`) } }); // Match events by date
        res.json({ events });
    } catch (err) {
        console.error('Error finding events by date:', err);
        res.status(500).json({ message: 'Something went wrong', error: err });
    }
};

const findEventByIdDelete = async (req, res) => {
    try {
        const deletedEvent = await Event.findByIdAndDelete(req.params.id);
        
        if (!deletedEvent) {
            return res.status(404).json({ message: 'Event not found' });
        }

        console.log('Event deleted successfully:', deletedEvent);

        // Log activity for deleting the event
        const adminId = req.user && (req.user._id || req.user.id);
        const logMessage = `Deleted event.`;
        await logActivity(adminId, 'DELETE', 'Events', deletedEvent._id, deletedEvent.e_title, logMessage);

        res.json({ deletedEvent, message: "Event deleted." });
    } catch (err) {
        console.error("Error deleting event:", err);
        res.status(500).json({ message: 'Something went wrong', error: err });
    }
};


const updateEvent = async (req, res) => {
    try {
        console.log('Request Params:', req.params);
        console.log('Request Body:', req.body);

        // Check if there's an image uploaded
        if (req.file) {
            req.body.e_image = req.file.path; // Assuming you're saving the file path
        }

        const updatedEvent = await Event.findByIdAndUpdate(req.params.id, req.body, { 
            new: true, 
            runValidators: true 
        });

        if (!updatedEvent) {
            return res.status(404).json({ message: 'Event not found' });
        }

        console.log('Event updated successfully:', updatedEvent);
        res.json({ theUpdateEvent: updatedEvent, status: "Successfully updated the event." });
    } catch (err) {
        console.error("Error updating event:", err.message);
        res.status(500).json({ message: 'Something went wrong', error: err.message });
    }
};









module.exports = {
    newEvent,
    findAllEvents,
    findEventsByDate,
    findEventByIdDelete,
    updateEvent
}