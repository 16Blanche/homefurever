    const mongoose = require('mongoose');
    const Counter = require('./counter');

    const PetSchema = new mongoose.Schema({

    p_id: { 
        type: Number, 
        unique: true 
    },

    pet_img: {
        type: Buffer
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
        type: String
    },
    
    p_vaccines: {
        type: Array
    },

    p_status:{
        type: String,
        default: 'none'
    }
    

    
    });

    PetSchema.pre('save', function(next) {
        const doc = this;
        Counter.findByIdAndUpdate(
            { _id: 'petId' }, // Use 'petId' as the identifier in the counter collection
            { $inc: { seq: 1 } }, // Increment the sequence by 1
            { new: true, upsert: true } // Options: return updated counter or create if it doesn't exist
        ).then(function(counter) {
            doc.p_id = counter.seq; // Assign the new sequence number to the p_id field
            next();
        }).catch(function(err) {
            console.error('Error during counter increment:', err);
            throw err;
        });
    });

    
    const Pet = mongoose.model('Pet', PetSchema);
    module.exports = Pet;