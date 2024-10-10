const mongoose = require('mongoose');

const ActivityLogSchema = new mongoose.Schema({
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Admin' // Ensure 'Admin' matches the actual Admin model name
  },
  action: {
    type: String,
    required: true,
    enum: ['ADD', 'UPDATE', 'DELETE'],
    default: 'ADD',
  },
  entity: {
    type: String,
    required: true,
    enum: ['Pet', 'User', 'Event'], // Make sure these are the correct names of your entities
    default: 'Pet',
  },
  entityId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: 'entity', // Dynamically reference the model based on 'entity' value
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

module.exports = mongoose.model('ActivityLog', ActivityLogSchema);
