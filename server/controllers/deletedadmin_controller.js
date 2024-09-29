const DeletedAdmin = require('../models/deletedadmin_model'); // Ensure this path is correct
const Admin = require('../models/admin_model');

const newDeletedAdmin = async (req, res) => {
    try {
        const adminId = req.params.id;

        console.log('Received request to delete admin with ID:', adminId);

        const deletedAdmin = await Admin.findById(adminId);
        if (!deletedAdmin) {
            return res.status(404).json({ message: 'Admin not found' });
        }

        console.log('Deleted Admin:', deletedAdmin);

        // Create a new document in the DeletedAdmin collection
        const newDeletedAdmin = new DeletedAdmin({
            da_id: deletedAdmin.a_id,
            da_lname: deletedAdmin.a_lname,
            da_fname: deletedAdmin.a_fname,
            da_email: deletedAdmin.a_email,
            da_username: deletedAdmin.a_username,
            da_password: deletedAdmin.a_password, // Ensure this is handled securely
        });

        await newDeletedAdmin.save();
        await Admin.findByIdAndDelete(adminId);

        console.log('DeletedAdmin saved successfully:', newDeletedAdmin);
        res.json({ message: 'Admin deleted and data transferred successfully', newDeletedAdmin });
    } catch (err) {
        console.error('Error handling deletion:', err);
        res.status(500).json({ message: 'Error deleting admin', error: err });
    }
};

const findAllAdmins = (req, res) => {
    DeletedAdmin.find()
        .then((allDeletedAdmins) => {
            res.json({ admins: allDeletedAdmins });
        })
        .catch((err) => {
            res.status(500).json({ message: 'Something went wrong', error: err });
        });
};

const findAdminByUname = (req, res) => {
    DeletedAdmin.findOne({ da_username: req.params.ausername }) // Use the correct field
        .then((theAdmin) => {
            res.json({ theAdmin });
        })
        .catch((err) => {
            res.status(500).json({ message: 'Something went wrong', error: err });
        });
};

module.exports = {
    newDeletedAdmin,
    findAllAdmins,
    findAdminByUname
};
