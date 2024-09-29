const mongoose = require('mongoose');

const BarangayCounterSchema = new mongoose.Schema({
    _id: { type: String, required: true },
    seq: { type: Number, default: 0 }
});

const BarangayCounter = mongoose.model('BarangayCounter', BarangayCounterSchema);

BarangayCounter.resetCounter = async function (barangayCounterId) {
    try {
        const barangayCounter = await this.findByIdAndUpdate(barangayCounterId, { seq: 0 }, { new: true, upsert: true });
        if (!barangayCounter) {
            throw new Error('Counter not found or unable to reset.');
        }
        return barangayCounter.seq;
    } catch (err) {
        throw new Error(`Error resetting counter: ${err.message}`);
    }
};

module.exports = BarangayCounter;
