const mongoose = require('mongoose');

const AdoptionCounterSchema = new mongoose.Schema({
    _id: { type: String, required: true },
    seq: { type: Number, default: 0 }
});

const AdoptionCounter = mongoose.model('AdoptionCounter', AdoptionCounterSchema);

AdoptionCounter.resetCounter = async function (adoptionCounterId) {
    try {
        const adoptionCounter = await this.findByIdAndUpdate(adoptionCounterId, { seq: 0 }, { new: true, upsert: true });
        if (!adoptionCounter) {
            throw new Error('Counter not found or unable to reset.');
        }
        return adoptionCounter.seq;
    } catch (err) {
        throw new Error(`Error resetting counter: ${err.message}`);
    }
};

module.exports = AdoptionCounter;
