const mongoose = require('mongoose');

const UserCounterSchema = new mongoose.Schema({
    _id: { type: String, required: true },
    seq: { type: Number, default: 0 }
});

const UserCounter = mongoose.model('UserCounter', UserCounterSchema);

UserCounter.resetCounter = async function (userCounterId) {
    try {
        const userCounter = await this.findByIdAndUpdate(userCounterId, { seq: 0 }, { new: true, upsert: true });
        if (!userCounter) {
            throw new Error('Counter not found or unable to reset.');
        }
        return userCounter.seq;
    } catch (err) {
        throw new Error(`Error resetting counter: ${err.message}`);
    }
};

module.exports = UserCounter;

