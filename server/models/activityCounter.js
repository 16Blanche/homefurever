const mongoose = require('mongoose');

const ActivityCounterSchema = new mongoose.Schema({
    _id: { type: String, required: true },
    seq: { type: Number, default: 0 }
});

const ActivityCounter = mongoose.model('ActivityCounter', ActivityCounterSchema);

ActivityCounter.resetCounter = async function (activityCounterId) {
    try {
        const activityCounter = await this.findByIdAndUpdate(activityCounterId, { seq: 0 }, { new: true, upsert: true });
        if (!activityCounter) {
            throw new Error('Counter not found or unable to reset.');
        }
        return activityCounter.seq;
    } catch (err) {
        throw new Error(`Error resetting counter: ${err.message}`);
    }
};

module.exports = ActivityCounter;
