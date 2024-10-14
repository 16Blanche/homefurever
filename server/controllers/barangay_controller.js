const Barangay = require('../models/barangay_model');
const Counter = require('../models/barangayCounter');
const {logActivity} = require('./activitylog_controller');

const mongoose = require('mongoose');

/**
 * Check if a given id is a valid MongoDB ObjectId.
 * @param {string} id - The id to validate.
 * @returns {boolean} - True if valid, otherwise false.
 */
const isValidObjectId = (id) => {
    return mongoose.Types.ObjectId.isValid(id); // Use Mongoose's built-in validation
};


const newBarangayInfo = async (req, res) => {
    const { 
        b_barangay, 
        b_ownername, 
        b_petname, 
        b_pettype, 
        b_petgender, 
        b_petage, 
        b_color, 
        b_address 
    } = req.body;

    const adminId = req.user && (req.user._id || req.user.id); // Get admin ID from request
    console.log('Admin ID:', adminId); // Debug log to check if adminId is populated

    try {
        const barangay = new Barangay({
            b_barangay,
            b_ownername,
            b_petname,
            b_pettype,
            b_petgender,
            b_petage,
            b_color,
            b_address
        });

        const savedBarangay = await barangay.save();

        // Modify logMessage to indicate a range even for a single entry
        const logMessage = `Added a barangay record (ID: ${savedBarangay.b_id}).`; // Using savedBarangay._id for clarity
        await logActivity(adminId, 'ADD', 'Barangays', savedBarangay._id, 'N/A', logMessage);

        res.status(201).json({ savedBarangay, status: "successfully inserted" });
    } catch (err) {
        console.error("Error creating barangay info:", err);
        res.status(500).json({ message: 'Something went wrong', error: err.message });
    }
};

const updateBarangayInfo = async (req, res) => {
    const { id } = req.params; // Extract the ID from the request parameters
    const updateData = req.body; // Get the data to update from the request body

    const adminId = req.user && (req.user._id || req.user.id); // Get admin ID from request

    try {
        // Log the ID and update data for debugging
        console.log('Update Request - ID:', id, 'Update Data:', updateData);

        // Find the barangay by ID and update with new data
        const updatedBarangay = await Barangay.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });

        if (!updatedBarangay) {
            return res.status(404).json({ message: 'Barangay not found' });
        }

        // Log the updated barangay data
        console.log('Barangay successfully updated:', updatedBarangay);

        // Log the update activity
        const logMessage = `Updated barangay record (ID: ${updatedBarangay.b_id}).`;
        await logActivity(adminId, 'UPDATE', 'Barangays', updatedBarangay._id, 'N/A', logMessage);

        res.status(200).json({ updatedBarangay, status: 'Successfully updated' });
    } catch (error) {
        console.error('Error updating barangay info:', error);
        res.status(500).json({ message: 'Something went wrong', error });
    }
};
  
const findAllInfo = (req, res) => {
    Barangay.find()
        .then((allDaInfo) => {
            res.json({ theInfo: allDaInfo })
        }) 
        .catch((err) => {
            res.json({ message: 'Something went wrong', error: err })
        });
}

const logExportActivity = async (req, res) => {
    const adminId = req.user && (req.user._id || req.user.id); // Get admin ID from request
    const { isFiltered, filterValue, entityIds } = req.body; // Get export details

    // Prepare the log message
    const logMessage = isFiltered 
        ? `Exported filtered barangay ${filterValue} data.` 
        : `Exported entire barangay data`;

    try {
        await logActivity(adminId, 'EXPORT', 'Barangays', entityIds, 'N/A', logMessage);
        res.status(200).json({ message: 'Export activity logged' });
    } catch (error) {
        console.error('Error logging export activity:', error);
        res.status(500).json({ message: 'Failed to log export activity' });
    }
};



const resetCounter = async (req, res) => {
    try {
        await Counter.resetCounter('b_id'); // Adjust 'pet_id' based on your counter _id
        res.status(200).json({ message: 'Pet counter reset successfully.' });
    } catch (err) {
        console.error('Error resetting pet counter:', err);
        res.status(500).json({ error: 'Unable to reset pet counter.' });
    }
};

module.exports = {
    newBarangayInfo,
    findAllInfo,
    resetCounter,
    updateBarangayInfo,
    logExportActivity
}