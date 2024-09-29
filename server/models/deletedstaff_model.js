const mongoose = require('mongoose');

// Create the DeletedStaff schema
const DeletedStaffSchema = new mongoose.Schema({
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
        default: 'Verified'
    },
    deletedAt: {
        type: Date,
        default: Date.now // Automatically set to current date when document is created
    },
    deleteReason: {
        type: String,
        default: 'Not specified' // Optional field to capture reason for deletion
    }
});

// Create the model
const DeletedStaff = mongoose.model('DeletedStaff', DeletedStaffSchema);

module.exports = DeletedStaff;
