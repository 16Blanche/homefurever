const mongoose = require('mongoose');

const FeedbackSchema = new mongoose.Schema({
  a_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Adoption',
    required: true,
  },
  p_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Pet',
    required: true,
  },
  v_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: true,
  },
  feedbackText: {
    type: String,
    required: true,
  },
  submittedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Feedback', FeedbackSchema);
