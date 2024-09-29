const mongoose = require('mongoose');
const Pet = require('../models/pets_model');
const Adopted = require('../models/archivedpets_model');
const Pending = require('../models/user_model');
const Verified = require('../models/verified_model');

const getPetCounts = async (req, res) => {
    try {

        const [catCount, dogCount] = await Promise.all([
            Pet.countDocuments({ p_type: 'Cat' }),
            Pet.countDocuments({ p_type: 'Dog' }),
        ]);
        
        res.json({ catCount, dogCount });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching summary', error });
    }
};

const getAdoptedCounts = async (req, res) => {
    try {

        const [adoptedDogCount, adoptedCatCount] = await Promise.all([
            Adopted.countDocuments({ ap_reason: 'Adopted', ap_type: 'Dog' }),
            Adopted.countDocuments({ ap_reason: 'Adopted', ap_type: 'Cat' })
        ]);
        
        res.json({ adoptedCatCount, adoptedDogCount });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching summary', error });
    }
};

const getPendingCounts = async (req, res) => {
    try {

        const [pendingCount] = await Promise.all([
            Pending.countDocuments({ p_role: 'pending'}),
        ]);
        
        res.json({ pendingCount});
    } catch (error) {
        res.status(500).json({ message: 'Error fetching summary', error });
    }
};

const getVerifiedCounts = async (req, res) => {
    try {

        const [verifiedCount] = await Promise.all([
            Verified.countDocuments({ v_role: 'verified' })
        ]);
        
        res.json({ verifiedCount });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching summary', error });
    }
};

module.exports = {
    getPetCounts,
    getAdoptedCounts,
    getPendingCounts,
    getVerifiedCounts
}