const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  contactNumber: { type: String },
  age: { type: Number },
  img_path: { type: String, default: "" },
  gender: { type: String, enum: ["male", "female"] },
  DOB: { type: Date },
  role: {
    type: String,
    enum: ["user", "admin", "doctor"],
    default: "user"
  }
}, { timestamps: true })

module.exports = mongoose.model("User", userSchema)





