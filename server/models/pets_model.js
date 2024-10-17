const mongoose = require('mongoose');
const Counter = require('./counter');

const PetSchema = new mongoose.Schema({
    p_id: { 
        type: Number, 
        unique: true 
    },
    pet_img: {
        type: [String]
    },
    p_name: {
        type: String
    },
    p_type: {
        type: String
    },
    p_gender: {
        type: String
    },
    p_age: {
        type: Number
    },
    p_weight: {
        type: Number
    },
    p_breed: {
        type: String
    },
    p_medicalhistory: {
        type: [String],
        default: 'none'
    },
    p_vaccines: {
        type: [String],
        default: 'none'
    },
    p_status: {
        type: String,
        default: 'none'
    },
    p_status: {
        type: String,
        default: 'none'
    },
    p_description: {
        type: String
    }
});

// Pre-save middleware to increment the pet ID counter
PetSchema.pre('save', function(next) {
    const doc = this;
    Counter.findByIdAndUpdate(
        { _id: 'petId' },
        { $inc: { seq: 1 } }, 
        { new: true, upsert: true } 
    ).then(function(counter) {
        doc.p_id = counter.seq;
        next();
    }).catch(function(err) {
        console.error('Error during counter increment:', err);
        throw err;
    });
});

const Pet = mongoose.model('Pet', PetSchema);
module.exports = Pet;
