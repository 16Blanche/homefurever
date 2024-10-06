// models/ActivityLog.js
const mongoose = require('mongoose');

const ActivityLogSchema = new mongoose.Schema({
  adminId: {
    type: mongoose.Schema.Types.ObjectId, // Reference to the admin's user ID
    required: true,
    ref: 'Admin'
  },
  action: {
    type: String,
    required: true,
    enum: ['ADD', 'UPDATE', 'DELETE'], // Define action types
    default: 'ADD',
  },
  entity: {
    type: String,
    required: true,
    enum: ['Pet', 'User', 'Event'], // Define entity types that admins can act on
    default: 'Pet',
  },
  entityId: {
    type: mongoose.Schema.Types.ObjectId, // ID of the entity (e.g., pet or user) that was acted upon
    required: true,
    refPath: 'entity',
  },
  description: {
    type: String, // Description of the activity (e.g., "Added pet ID: 1 to the pet list")
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now, // Log the timestamp of the activity
  },
});

module.exports = mongoose.model('ActivityLog', ActivityLogSchema);
