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
    return mongoose.Types.ObjectId.isValid(id); 
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
        b_address,
        b_vreason
    } = req.body;

    const adminId = req.user && (req.user._id || req.user.id); 
    console.log('Admin ID:', adminId); 

    try {
        const barangay = new Barangay({
            b_barangay,
            b_ownername,
            b_petname,
            b_pettype,
            b_petgender,
            b_petage,
            b_color,
            b_address,
            b_vreason
        });

        const savedBarangay = await barangay.save();

        const logMessage = `Added a barangay record (ID: ${savedBarangay.b_id}).`;
        await logActivity(adminId, 'ADD', 'Barangays', savedBarangay._id, 'N/A', logMessage);

        res.status(201).json({ savedBarangay, status: "successfully inserted" });
    } catch (err) {
        console.error("Error creating barangay info:", err);
        res.status(500).json({ message: 'Something went wrong', error: err.message });
    }
};

const updateBarangayInfo = async (req, res) => {
    const { id } = req.params;
    const updateData = req.body; 

    const adminId = req.user && (req.user._id || req.user.id); 

    try {

        console.log('Update Request - ID:', id, 'Update Data:', updateData);

        const updatedBarangay = await Barangay.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });

        if (!updatedBarangay) {
            return res.status(404).json({ message: 'Barangay not found' });
        }

        console.log('Barangay successfully updated:', updatedBarangay);

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
    const adminId = req.user && (req.user._id || req.user.id);
    const { isFiltered, filterValue, entityIds } = req.body; 

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
        await Counter.resetCounter('b_id'); 
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