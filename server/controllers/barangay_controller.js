const Barangay = require('../models/barangay_model');
const Counter = require('../models/barangayCounter');

const newBarangayInfo = async (req, res) => {
    const { 
        b_barangay, b_ownername, b_petname, b_pettype, b_petgender, b_petage, b_color, b_address
    } = req.body;

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
        res.status(201).json({ savedBarangay, status: "successfully inserted" });
    } catch (err) {
        console.error("Error creating pet:", err);
        res.status(500).json({ message: 'Something went wrong', error: err });
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
    resetCounter
}