const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({

e_title: {
    type: String
},

e_description: {
    type: String
},

e_date: {
    type: String
}
 
});

const Event = mongoose.model('Event', EventSchema);
module.exports = Event;