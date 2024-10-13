const mongoose = require('mongoose');

const ServiceSchema = new mongoose.Schema({
    ns_name: {
        type: String,
        required: true,
    },
    ns_type: {
        type: String,
        required: true,
    },
    ns_address: {
        type: String,
        required: true,
    },
    ns_pin: {
        type: String,
        required: true,
    },
    ns_image: {
        type: String, // Change from Buffer to String to store image URL
        required: true,
    },
});

module.exports = mongoose.model('Service', ServiceSchema);
