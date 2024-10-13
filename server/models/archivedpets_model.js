const mongoose = require('mongoose');

const ArchivedPetSchema = new mongoose.Schema({
    ap_id: {
        type: Number, 
        unique: true 
    },
    ap_name: {
        type: String
    },
    ap_img: {
        type: [String]
    },
    ap_type: {
        type: String
    },
    ap_gender: {
        type: String
    },
    ap_age: {
        type: Number
    },
    ap_weight: {
        type: Number
    },
    ap_breed: {
        type: String
    },
    ap_medicalhistory: {
        type: String
    },
    ap_vaccines: {
        type: Array
    },
    ap_reason: {
        type: String
    },
});

const ArchivedPet = mongoose.model('ArchivedPet', ArchivedPetSchema);
module.exports = ArchivedPet;
