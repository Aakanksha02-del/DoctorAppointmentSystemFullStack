const Doctor = require("../models/doctorModel");
const User = require("../models/userModel");

const applyDoctor = async (req, res) => {
  const exists = await Doctor.findOne({ user_id: req.user.id });

  if (exists) return res.send({ msg: "Already applied" });

  const doctor = await Doctor.create({
    user_id: req.user.id,
    ...req.body,
    isDoctor: false,
  });

  res.send({ success: true, doctor });
};

const appliedDoctors = async (req, res) => {
  const doctors = await Doctor.find({ isDoctor: true }).populate("user_id");
  res.send({ success: true, doctors });
};

const isDoctor = async (req, res) => {
  const doctor = await Doctor.findByIdAndUpdate(req.params.doctorID, {
    isDoctor: true,
  });

  await User.findByIdAndUpdate(doctor.user_id, { role: "doctor" });

  res.send({ success: true });
};

//  GET ALL DOCTORS

const getAllDoctors = async (req, res) => {

  try {

    const doctors = await Doctor.find({ isDoctor: true })
      .populate("user_id", "name img_path");

    res.json({
      success: true,
      doctors,
    });

  } catch (err) {

    console.log(err);

    res.json({
      success: false,
      msg: "Error fetching doctors",
    });
  }
};

const getDoctorById = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id).populate("user_id");

    if (!doctor) {
      return res.status(404).json({ msg: "Doctor not found" });
    }

    res.json(doctor);
  } catch (err) {
    res.status(500).json(err);
  }
};


module.exports = {
  applyDoctor,
  appliedDoctors,
  isDoctor,
  getAllDoctors,
  getDoctorById
};








