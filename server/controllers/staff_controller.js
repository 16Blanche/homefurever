const Staff = require('../models/staff_model');
const DeletedStaff = require('../models/deletedstaff_model');
const Counter = require('../models/staffCounter');
 
const newStaff = async (req, res) => {
    const { 
        s_fname, s_lname, s_mname, s_add, s_contactnumber,
        s_position, s_gender, s_birthdate, s_email
    } = req.body;

    try {
        // Get the current counter value and increment it
        const counter = await Counter.findByIdAndUpdate(
            { _id: 'staff_id' },
            { $inc: { seq: 1 } },
            { new: true, upsert: true }
        );

        const s_id = counter.seq;

        // Create a new staff instance
        const staff = new Staff({
            s_id, // Use the generated s_id
            s_fname,
            s_lname,
            s_mname,
            s_add,
            s_contactnumber,
            s_position,
            s_gender,
            s_birthdate,
            s_email
        });

        // Save the staff to the database
        const savedStaff = await staff.save();
        res.status(201).json({ savedStaff, status: "Successfully inserted" });
    } catch (err) {
        console.error("Error creating staff:", err);
        res.status(500).json({ message: 'Something went wrong', error: err });
    }
};


const findAllStaff = (req, res) => {
    Staff.find()
        .then((allDaStaff) => {
            res.json({ theStaff: allDaStaff }); // Ensure the key 'theStaff' matches the frontend expectation
        })
        .catch((err) => {
            res.status(500).json({ message: 'Something went wrong', error: err });
        });
};

const findStaffById = (req, res) => {
    Staff.findOne({_id:req.params.sid})
        .then((theStaff) => {
            res.json({theStaff})
        })
        .catch((err) => {
            res.json({ message: 'Something went wrong', error: err })
        });
}
 
const findStaffByIdDelete = async (req, res) => {
    try {
        const staffToDelete = await Staff.findById(req.params.id);

        if (!staffToDelete) {
            return res.status(404).json({ message: 'Staff not found' });
        }

        const deletedStaff = new DeletedStaff({
            s_id: staffToDelete.s_id,
            s_fname: staffToDelete.s_fname,
            s_lname: staffToDelete.s_lname,
            s_mname: staffToDelete.s_mname,
            s_add: staffToDelete.s_add,
            s_contactnumber: staffToDelete.s_contactnumber,
            s_position: staffToDelete.s_position,
            s_gender: staffToDelete.s_gender,
            s_birthdate: staffToDelete.s_birthdate,
            s_email: staffToDelete.s_email,
            deleteReason: req.body.deleteReason || 'Not specified', // Capture the delete reason
        });

        await deletedStaff.save();
        await Staff.findByIdAndDelete(req.params.id);

        res.json({ message: "Staff data has been moved to DeletedStaff and removed from Staff collection." });
    } catch (err) {
        console.error("Error transferring staff to DeletedStaff schema:", err);
        res.status(500).json({ message: 'Something went wrong', error: err });
    }
};


const updateStaff = (req, res) => {
    const { id } = req.params;
    Staff.findOneAndUpdate({ _id: id }, req.body, { new: true, runValidators: true })
        .then((updatedStaff) => {
            res.json({ theUpdateStaff: updatedStaff, status: "Successfully updated the staff." });
        })
        .catch((err) => {
            res.status(500).json({ message: 'Something went wrong', error: err });
        });
};


const resetCounter = async (req, res) => {
    try {
        await Counter.resetCounter('staff_id'); // Adjust 'pet_id' based on your counter _id
        res.status(200).json({ message: 'Staff counter reset successfully.' });
    } catch (err) {
        console.error('Error resetting staff counter:', err);
        res.status(500).json({ error: 'Unable to reset staff counter.' });
    }
};

module.exports = {
    newStaff,
    findAllStaff,
    findStaffByIdDelete,
    updateStaff,
    resetCounter,
    findStaffById
}