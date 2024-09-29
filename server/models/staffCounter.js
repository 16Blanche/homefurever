const mongoose = require('mongoose');

const StaffCounterSchema = new mongoose.Schema({
    _id: { type: String, required: true },
    seq: { type: Number, default: 0 }
});

const StaffCounter = mongoose.model('StaffCounter', StaffCounterSchema);

StaffCounter.resetCounter = async function (staffCounterId) {
    try {
        const staffCounter = await this.findByIdAndUpdate(staffCounterId, { seq: 0 }, { new: true, upsert: true });
        if (!staffCounter) {
            throw new Error('Counter not found or unable to reset.');
        }
        return staffCounter.seq;
    } catch (err) {
        throw new Error(`Error resetting counter: ${err.message}`);
    }
};

module.exports = StaffCounter;
