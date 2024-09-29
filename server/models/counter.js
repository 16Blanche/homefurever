const mongoose = require('mongoose');

const CounterSchema = new mongoose.Schema({
    _id: { type: String, required: true },
    seq: { type: Number, default: 0 }
});

const Counter = mongoose.model('Counter', CounterSchema);

Counter.resetCounter = async function (counterId) {
    try {
        const counter = await this.findByIdAndUpdate(counterId, { seq: 0 }, { new: true, upsert: true });
        if (!counter) {
            throw new Error('Counter not found or unable to reset.');
        }
        return counter.seq;
    } catch (err) {
        throw new Error(`Error resetting counter: ${err.message}`);
    }
};

module.exports = Counter;
