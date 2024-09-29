const mongoose = require('mongoose');
const AdminCounter = require('./adminCounter');

const AdminSchema = new mongoose.Schema({
    a_id: { 
        type: Number, 
        unique: true 
    },
    a_fname: {
        type: String
    },
    a_lname: {
        type: String
    },
    a_mname: {
        type: String
    },
    a_add: {
        type: String
    },
    a_contactnumber: {
        type: Number
    },
    a_position:{
        type: String
    },
    a_gender: {
        type: String
    },
    a_birthdate: {
        type: String
    },
    a_email: {
        type: String
    },
    a_username: {
        type: String
    },
    a_password: {
        type: String
    },
    s_role: {
        type: String,
        default: 'admin'
    }
});

AdminSchema.pre('save', function(next) {
    const doc = this;
    AdminCounter.findByIdAndUpdate(
        'adminId', // Use 'userId' as the identifier in the counter collection
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

module.exports = mongoose.model('Admin', AdminSchema);
