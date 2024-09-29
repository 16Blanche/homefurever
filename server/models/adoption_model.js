const mongoose = require('mongoose');

const AdoptionSchema = new mongoose.Schema({
    v_id: { 
        type: mongoose.Schema.Types.ObjectId, ref: 'Verified', 
        required: true 
    },
    p_id: { 
        type: mongoose.Schema.Types.ObjectId, ref: 'Pet', 
        required: true 
    },
    occupation: { 
        type: String 
    },
    home_type: { 
        type: String, 
        required: true 
    },
    years_resided: { 
        type: Number, 
        required: true 
    },
    adults_in_household: { 
        type: Number, 
        required: true 
    },
    children_in_household: { 
        type: Number, 
        required: true 
    },
    allergic_to_pets: { 
        type: String, 
        required: true 
    },
    household_description: { 
        type: String, 
        required: true 
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'declined', 'complete', 'failed'], 
        default: 'pending' 
    },
    visitDate: { 
        type: Date 
    },
    visitTime: { 
        type: String 
    },
    rejection_reason: { 
        type: String 
    },
    failedReason:{
        type:String
    },
    a_submitted_at: { 
        type: Date, 
        default: Date.now 
    },
    feedbackRating: { 
        type: Number,
        min: 1,
        max: 5,
    },
    feedbackText: { 
        type: String, 
    },
});

module.exports = mongoose.model('Adoption', AdoptionSchema);
