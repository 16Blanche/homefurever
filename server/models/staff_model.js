const mongoose = require('mongoose');
const StaffCounter = require('./staffCounter');
const userEvent = require('@testing-library/user-event');

const StaffSchema = new mongoose.Schema({
    s_id: { 
        type: Number, 
        unique: true 
    },
    s_fname: {
        type: String
    },
    s_lname: {
        type: String
    },
    s_mname: {
        type: String
    },
    s_add: {
        type: String
    },
    s_contactnumber: {
        type: Number
    },
    s_position:{
        type: String
    },
    s_gender: {
        type: String
    },
    s_birthdate: {
        type: String
    },
    s_email: {
        type: String
    },
    s_role:{
        type: String,
        default: 'staff'
    }
});

StaffSchema.pre('save', function(next) {
    const doc = this;
    StaffCounter.findByIdAndUpdate(
        'staffId', // Use 'userId' as the identifier in the counter collection
        { $inc: { seq: 1 } }, // Increment the sequence by 1
        { new: true, upsert: true } // Options: return updated counter or create if it doesn't exist
    ).then(function(counter) {
        doc.pending_id = counter.seq; // Assign the new sequence number to the pending_id field
        next();
    }).catch(function(err) {
        console.error('Error during counter increment:', err);
        next(err); // Pass error to next middleware
    });
});

const Staff = mongoose.model('Staff', StaffSchema);
module.exports = Staff;
