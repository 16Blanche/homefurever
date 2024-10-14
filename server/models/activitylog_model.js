const mongoose = require('mongoose');
const Counter = require('./activityCounter');

const ActivityLogSchema = new mongoose.Schema({
  log_id: {
    type: Number,
    unique: true,
  },
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Admin', // Reference to the Admin model
  },
  action: {
    type: String,
    required: true,
    enum: ['ADD', 'UPDATE', 'DELETE', 'ARCHIVE', 'POST', 'ACCEPT', 'REJECT', 'COMPLETE', 'FAIL', 'EXPORT'],
    default: 'ADD',
  },
  entity: {
    type: String,
    required: true,
    enum: ['Pet', 'User', 'Events', 'Services', 'Adoptions', 'Barangays'],
    default: 'Pet',
  },
  entityId: {
    type: [mongoose.Schema.Types.ObjectId],
    required: true,
    refPath: 'entity',
  },
  entityName: { // <-- Add the new field here
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

// Pre-save hook to increment the counter and assign a unique log_id
ActivityLogSchema.pre('save', async function(next) {
  const doc = this;
  
  try {
    const counter = await Counter.findByIdAndUpdate(
      { _id: 'logId' },
      { $inc: { seq: 1 } }, 
      { new: true, upsert: true }
    );
    
    // Assign the log_id based on the updated counter sequence
    if (counter) {
      doc.log_id = counter.seq;
      next();
    } else {
      throw new Error('Counter document not found or not created');
    }
  } catch (err) {
    console.error('Error during counter increment:', err);
    next(err); // Pass the error to the next middleware
  }
});

module.exports = mongoose.model('ActivityLog', ActivityLogSchema);
