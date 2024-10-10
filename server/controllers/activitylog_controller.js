const mongoose = require('mongoose');
const ActivityLog = require('../models/activitylog_model');

const logActivity = async (adminId, action, entity, entityId, description) => {
  console.log('logActivity function called'); // <-- Add this log
  try {
    console.log('Logging activity:'); // <-- Add this log
    console.log('Admin ID:', adminId); // <-- Add this log
    console.log('Action:', action); // <-- Add this log
    console.log('Entity:', entity); // <-- Add this log
    console.log('Entity ID:', entityId); // <-- Add this log
    console.log('Description:', description); // <-- Add this log

    const newLog = new ActivityLog({
      adminId,
      action,
      entity,
      entityId,
      description,
    });

    await newLog.save(); // <-- This is where the save happens
    console.log('Activity logged successfully:', newLog); // <-- Add this log
  } catch (error) {
    console.error('Error logging activity:', error);
  }
};


module.exports = logActivity;
