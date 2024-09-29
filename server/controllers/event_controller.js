const Event = require('../models/events_model');

const newEvent = async (req, res) => {
    const { 
        e_title, e_description, e_date
    } = req.body;

    try {

        // Create a new event instance
        const event = new Event({
            e_title,
            e_description,
            e_date
        });

        // Save the event to the database
        const savedEvent = await event.save();
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

const findEventByIdDelete = (req, res) => {
    Event.findByIdAndDelete({_id:req.params.id})
         .then((deletedEvent) => {
             res.json({ deletedEvent, message: "Event deleted." })
         })
         .catch((err) => {
             res.json({ message: 'Something went wrong', error: err })
         });
 }

const updateEvent = (req, res) => {
    Event.findByIdAndUpdate(req.params.id, req.body, { 
        new: true, 
        runValidators: true 
    })
    .then((updatedEvent) => {
        res.json({ theUpdateEvent: updatedEvent, status: "Successfully updated the event." });
    })
    .catch((err) => {
        res.json({ message: 'Something went wrong', error: err });
    });
};


module.exports = {
    newEvent,
    findAllEvents,
    findEventsByDate,
    findEventByIdDelete,
    updateEvent
}