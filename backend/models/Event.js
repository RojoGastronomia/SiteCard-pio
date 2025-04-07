const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['wedding', 'corporate', 'birthday']
  },
  guestCount: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  selectedItems: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MenuItem'
  }],
  drinks: {
    type: String,
    required: true
  },
  decoration: {
    type: String,
    required: true
  },
  totalPrice: {
    type: Number,
    required: true
  },
  clientName: {
    type: String,
    required: true
  },
  clientEmail: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Event', EventSchema);