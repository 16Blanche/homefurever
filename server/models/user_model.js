const mongoose = require('mongoose');
const UserCounter = require('./userCounter');
const userEvent = require('@testing-library/user-event');



const UserSchema = new mongoose.Schema({
    pending_id: { 
        type: Number, 
        unique: true 
    },
    p_img: {
        type: Buffer
    },
    p_username: {
        type: String
    },
    p_emailadd: {
        type: String
    },
    p_fname: {
        type: String
    },
    p_lname: {
        type: String
    },
    p_mname: {
        type: String
    },
    p_password: {
        type: String
    },
    p_repassword: {
        type: String
    },
    p_add: {
        type: String
    },
    p_contactnumber: {
        type: Number
    },
    p_gender: {
        type: String
    },
    p_birthdate: {
        type: String
    },
    p_validID: {
        type: Buffer
    },
    p_role:{
        type: String,
        default: 'pending'
    }
});

UserSchema.pre('save', function(next) {
    const doc = this;
    UserCounter.findByIdAndUpdate(
        'userId', // Use 'userId' as the identifier in the counter collection
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

const User = mongoose.model('User', UserSchema);
module.exports = User;
