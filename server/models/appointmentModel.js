const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({

  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  doctor_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Doctor",
  },

  date: {
    type: String,
    required: true,
  },

  time: {
    type: String,
    required: true,
  },

  status: {
    type: String,
    default: "pending",
  },

  //  PAYMENT STATUS
  payment_status: {
    type: String,
    default: "pending",
  },

  //  CONSULTATION FEES
  fees: {
    type: Number,
    default: 500,
  },

}, { timestamps: true });

module.exports = mongoose.model(
  "Appointment",
  appointmentSchema
);






