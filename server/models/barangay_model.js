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
        return value >= 1 && value <= 201;
      },
      message: 'b_barangay must be between 1 and 201'
    },
    required: true
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

  b_vreason: {
    type: String
  },

  createdAt: {
    type: Date,
    default: Date.now 
  }
});

BarangaySchema.pre('save', function(next) {
  const doc = this;
  Counter.findByIdAndUpdate(
    { _id: 'barangayId' }, 
    { $inc: { seq: 1 } },
    { new: true, upsert: true } 
  ).then(function(counter) {
    doc.b_id = counter.seq; 
    next();
  }).catch(function(err) {
    console.error('Error during counter increment:', err);
    throw err;
  });
});

const Barangay = mongoose.model('Barangay', BarangaySchema);
module.exports = Barangay;
