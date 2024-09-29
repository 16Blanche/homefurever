const mongoose = require('mongoose');

const AdminCounterSchema = new mongoose.Schema({
    _id: { type: String, required: true },
    seq: { type: Number, default: 0 }
});

const AdminCounter = mongoose.model('AdminCounter', AdminCounterSchema);

AdminCounter.resetCounter = async function (adminCounterId) {
    try {
        const adminCounter = await this.findByIdAndUpdate(adminCounterId, { seq: 0 }, { new: true, upsert: true });
        if (!adminCounter) {
            throw new Error('Counter not found or unable to reset.');
        }
        return adminCounter.seq;
    } catch (err) {
        throw new Error(`Error resetting counter: ${err.message}`);
    }
};

module.exports = AdminCounter;
