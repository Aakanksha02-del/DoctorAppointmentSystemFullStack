const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    doctor_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
    },

    doctorName: String,

    diagnosis: String,

    description: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  "Report",
  reportSchema
);











