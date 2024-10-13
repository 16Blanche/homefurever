const Verified = require('../models/verified_model');
const User = require('../models/user_model');

const deleteUserByIdAndTransferData = (req, res) => {
    User.findByIdAndDelete(req.params.id)
        .then((deletedUser) => {
            if (!deletedUser) {
                return res.status(404).json({ message: 'User not found' });
            }

            // Construct the image URL
            const userImageUrl = deletedUser.p_img;

            // Create a new document in the Verified collection
            const verifiedUser = new Verified({
                v_id: deletedUser.pending_id,
                v_img: userImageUrl,
                v_username: deletedUser.p_username,
                v_emailadd: deletedUser.p_emailadd,
                v_fname: deletedUser.p_fname,
                v_lname: deletedUser.p_lname,
                v_mname: deletedUser.p_mname,
                v_password: deletedUser.p_password,
                v_repassword: deletedUser.p_repassword,
                v_add: deletedUser.p_add,
                v_contactnumber: deletedUser.p_contactnumber,
                v_gender: deletedUser.p_gender,
                v_birthdate: deletedUser.p_birthdate,
                v_validID: deletedUser.p_validID,
                v_role: 'verified'
            });

            console.log('User data to be transferred:', verifiedUser);

            verifiedUser.save()
                .then((transferredUser) => {
                    res.json({ message: 'User deleted and data transferred successfully', deletedUser, transferredUser });
                })
                .catch((err) => {
                    console.error('Error transferring data:', err);
                    res.status(500).json({ message: 'Error transferring data', error: err });
                });
        })
        .catch((err) => {
            console.error('Error deleting user:', err);
            res.status(500).json({ message: 'Error deleting user', error: err });
        });
};


const findAllVerified = (req, res) => {
    Verified.find()
        .then((allTheUser) => {
            res.json({ users: allTheUser });
        }) 
        .catch((err) => {
            res.status(500).json({ message: 'Something went wrong', error: err });
        });
};

const findVerifiedByUname = (req, res) => {
    Verified.findOne({ v_username: req.params.vusername })
        .then((theUser) => {
            res.json({ theUser });
        })
        .catch((err) => {
            res.json({ message: 'Something went wrong', error: err });
        });
}

module.exports = {
    deleteUserByIdAndTransferData,
    findAllVerified,
    findVerifiedByUname
};
