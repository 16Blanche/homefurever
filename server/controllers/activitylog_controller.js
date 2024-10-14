const mongoose = require('mongoose');
const ActivityLog = require('../models/activitylog_model');

const logActivity = async (adminId, action, entity, entityId, entityName, description) => {
  console.log('logActivity function called'); 
  try {
    console.log('Logging activity:'); 
    console.log('Admin ID:', adminId);
    console.log('Action:', action);
    console.log('Entity:', entity);
    console.log('Entity ID(s):', entityId); 
    console.log('Entity Name:', entityName);
    console.log('Description:', description);

    const newLog = new ActivityLog({
      adminId,
      action,
      entity,
      entityId: Array.isArray(entityId) ? entityId : [entityId], 
      entityName, 
      description,
    });

    await newLog.save();
    console.log('Activity logged successfully:', newLog); 
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

    console.log('Sending Logs from Backend:', logs); 
    res.status(200).json(logs); 
  } catch (error) {
    console.error('Error retrieving activity logs:', error);
    res.status(500).json({ error: 'Error retrieving activity logs' });
  }
};





module.exports = {
  logActivity,
  getAllActivityLogs
};
