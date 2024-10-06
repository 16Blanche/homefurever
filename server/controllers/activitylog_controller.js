const ActivityLog = require('../models/activitylog_model');

const logActivity = async (adminId, action, entity, entityId, description) => {
  try {
    const newLog = new ActivityLog({
      adminId,
      action,
      entity,
      entityId,
      description,
    });

    await newLog.save();
    console.log('Activity logged successfully');
  } catch (error) {
    console.error('Error logging activity:', error);
  }
};

module.exports = logActivity;
