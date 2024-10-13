const mongoose = require('mongoose');
const UserCounter = require('./userCounter');

const UserSchema = new mongoose.Schema({
    pending_id: { 
        type: Number, 
        unique: true 
    },
    p_img: {
        type: String // Change from Buffer to String to store image URL
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
        type: String
    },
    p_role: {
        type: String,
        default: 'pending'
    }
});

UserSchema.pre('save', function(next) {
    const doc = this;
    UserCounter.findByIdAndUpdate(
        'userId', 
        { $inc: { seq: 1 } }, 
        { new: true, upsert: true }
    ).then(function(counter) {
        doc.pending_id = counter.seq;
        next();
    }).catch(function(err) {
        console.error('Error during counter increment:', err);
        next(err);
    });
});

const User = mongoose.model('User', UserSchema);
module.exports = User;
