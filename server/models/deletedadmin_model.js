const mongoose = require('mongoose');

const DeletedAdminSchema = new mongoose.Schema({
    da_id: { 
        type: Number, 
        unique: true 
    },
    da_fname: {
        type: String
    },
    da_lname: {
        type: String
    },
    da_email: {
        type: String
    },
    da_username: {
        type: String
    },
    da_password: {
        type: String
    },
    s_role: {
        type: String,
        default: 'deleted-admin'
    }
});

module.exports = mongoose.model('DeletedAdmin', DeletedAdminSchema);
