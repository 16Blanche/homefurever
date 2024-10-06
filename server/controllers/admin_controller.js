const Admin = require('../models/admin_model'); // Update the path according to your directory structure
const AdminCounter = require('../models/adminCounter');
const Staff = require('../models/staff_model');

const newAdmin = async (req, res) => {
    try {
        const { firstName, lastName, middleName, address, contact, position, gender, birthdate, email, username, password, s_id } = req.body;

        // Create the admin as before
        const counter = await AdminCounter.findByIdAndUpdate(
            { _id: 'admin_id' },
            { $inc: { seq: 1 } },
            { new: true, upsert: true }
        );

        const a_id = counter.seq;

        const newAdmin = new Admin({
            a_id,
            a_fname: firstName, 
            a_lname: lastName,
            a_mname: middleName,
            a_add: address,
            a_contactnumber: contact,
            a_position: position,
            a_gender: gender,
            a_birthdate: birthdate,
            a_email: email,
            a_username: username,
            a_password: password,
            s_role: 'pending-admin'
        });

        const savedAdmin = await newAdmin.save();

        // Now, update the corresponding Staff's s_role to 'pending-admin'
        if (s_id) {
            const updatedStaff = await Staff.findOneAndUpdate(
                { s_id: s_id },
                { s_role: 'admin' }, // Enforce 'pending-admin' role
                { new: true }
            );

            if (!updatedStaff) {
                return res.status(404).json({ message: 'Staff member not found to update s_role.' });
            }
        }

        res.status(201).json(savedAdmin);
    } catch (error) {
        console.error("Error creating admin:", error);
        res.status(500).json({ message: 'Server Error', error });
    }
};



const findAllAdmins = (req, res) => {
    console.log("Fetching all admins from the database..."); // Log when the function is called

    Admin.find()
        .then((allDaAdmin) => {
            console.log("All admins retrieved from database:", allDaAdmin); // Log the retrieved data
            res.json({ admins: allDaAdmin }); // Send the data back to the frontend
        })
        .catch((err) => {
            console.error("Error finding admins in database:", err.message); // Log error message
            console.error("Full error object:", err); // Log the entire error object for more details
            res.status(500).json({ message: 'Something went wrong', error: err });
        });
};


const findAdminByUname = (req, res) => {
    Admin.findOne({a_username:req.params.ausername})
        .then((theAdmin) => {
            res.json({ theAdmin })
        })
        .catch((err) => {
            res.json({ message: 'Something went wrong', error: err })
        });
}

const findAdminByIdDelete = (req, res) => {
    Admin.findByIdAndDelete({_id:req.params.s_id})
         .then((deletedAdmin) => {
             res.json({ deletedAdmin, message: "Congratulations! Pet has been adopted." })
         })
         .catch((err) => {
             res.json({ message: 'Something went wrong', error: err })
         });
 }

const updateAdminRole = async (req, res) => {
    try {
        const { id } = req.params;
        const { s_role } = req.body;

        const updatedAdmin = await Admin.findByIdAndUpdate(id, { s_role: s_role }, { new: true });

        if (!updatedAdmin) {
            return res.status(404).json({ message: "Admin not found" });
        }

        res.status(200).json(updatedAdmin);
    } catch (error) {
        console.error("Error updating admin role:", error);
        res.status(500).json({ message: "Internal server error", error });
    }
};

const updateAdminCredentials = async (req, res) => {
    const { id } = req.params;
    const { newUsername, newPassword } = req.body;

    try {
        const admin = await Admin.findById(id);

        if (!admin || admin.s_role !== 'pending-admin') {
            return res.status(400).json({ message: 'Invalid request or user not found' });
        }

        // Update the username, password, and role
        admin.a_username = newUsername;
        admin.a_password = newPassword;
        admin.s_role = 'admin'; // Change the role to 'admin' after updating credentials

        await admin.save();

        res.status(200).json({ message: 'Admin credentials updated successfully' });
    } catch (err) {
        console.error('Error updating admin credentials:', err);
        res.status(500).json({ message: 'Server error' });
    }
};


module.exports = {
    newAdmin,
    findAllAdmins,
    findAdminByUname,
    updateAdminRole,
    findAdminByIdDelete,
    updateAdminCredentials
};
