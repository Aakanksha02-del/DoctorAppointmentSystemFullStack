const mongoose = require('mongoose')

const doctorSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  Qualification: String,
  specialization: String,
  fees: Number,
  isDoctor: {
    type: Boolean,
    default: false
  },
  rating: Number,
  reviews: Array
}, { timestamps: true })

module.exports = mongoose.model("Doctor", doctorSchema)





