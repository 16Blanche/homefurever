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

const getAllActivityLogs = async (req, res) => {
  try {
    const logs = await ActivityLog.find()
      .populate({
        path: 'adminId',
        select: 'a_id a_username',
      })
      // .populate({
      //   path: 'entityId',
      //   select: 'p_id p_name p_type p_gender p_status',
      // })
      .exec();

    console.log('Sending Logs from Backend:', logs); // Log data being sent from the backend
    res.status(200).json(logs); // Send logs as JSON
  } catch (error) {
    console.error('Error retrieving activity logs:', error);
    res.status(500).json({ error: 'Error retrieving activity logs' });
  }
};





module.exports = {
  logActivity,
  getAllActivityLogs
};
