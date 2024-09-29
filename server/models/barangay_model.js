const mongoose = require('mongoose');
const Counter = require('./barangayCounter');

const BarangaySchema = new mongoose.Schema({
  b_id: { 
    type: Number, 
    unique: true 
  },

  b_barangay: {
    type: Number,
    validate: {
      validator: function(value) {
        return value >= 1 && value <= 201; // Custom validation function
      },
      message: 'b_barangay must be between 1 and 201'
    },
    required: true // Optional: enforce that this field is required
  },

  b_ownername: {
    type: String
  },

  b_petname: {
    type: String
  },

  b_pettype: {
    type: String
  },

  b_petgender: {
    type: String
  },

  b_petage: {
    type: Number
  },

  b_color: {
    type: String
  },

  b_address: {
    type: String
  },

  createdAt: {
    type: Date,
    default: Date.now // Automatically set the date when the document is created
  }
});

BarangaySchema.pre('save', function(next) {
  const doc = this;
  Counter.findByIdAndUpdate(
    { _id: 'barangayId' }, // Use 'barangayId' as the identifier in the counter collection
    { $inc: { seq: 1 } }, // Increment the sequence by 1
    { new: true, upsert: true } // Options: return updated counter or create if it doesn't exist
  ).then(function(counter) {
    doc.b_id = counter.seq; // Assign the new sequence number to the b_id field
    next();
  }).catch(function(err) {
    console.error('Error during counter increment:', err);
    throw err;
  });
});

const Barangay = mongoose.model('Barangay', BarangaySchema);
module.exports = Barangay;
