const mongoose = require('mongoose');

const ServiceSchema = new mongoose.Schema({
    ns_name: {
        type: String,
        required: true, // Ensuring this field is required
    },
    ns_type: {
        type: String,
        required: true, // Ensuring this field is required
    },
    ns_address: {
        type: String,
        required: true, // Ensuring this field is required
    },
    ns_image: {
        type: Buffer,
        required: true, // Ensuring this field is required
    },
});

module.exports = mongoose.model('Service', ServiceSchema);
