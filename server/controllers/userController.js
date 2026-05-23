const User = require("../models/userModel");
const Doctor = require("../models/doctorModel");
const jwt = require("jsonwebtoken");

// ================= REGISTER =================
const register = async (req, res) => {
  try {
    const user = await User.create({
      ...req.body,
      role: req.body.role || "user",
      img_path: req.file ? req.file.filename : "",
    });

    res.status(201).send({
      success: true,
      user,
    });
  } catch (err) {
    res.status(500).send({
      success: false,
      msg: err.message,
    });
  }
};

// ================= LOGIN =================
const login = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).send({
        success: false,
        msg: "User not found",
      });
    }

    let doctor = null;

    if (user.role === "doctor") {
      doctor = await Doctor.findOne({ user_id: user._id });
    }

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
        doctor_id: doctor ? doctor._id : null,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.send({
      success: true,
      token,
      user,
    });
  } catch (err) {
    res.status(500).send({
      success: false,
      msg: err.message,
    });
  }
};

// ================= GET USER INFO =================
const getUserInfo = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.send({ success: true, user });
  } catch (err) {
    res.status(500).send({ success: false, msg: err.message });
  }
};

// ================= GET ALL USERS =================
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: "user" });
    res.send({ success: true, users });
  } catch (err) {
    res.status(500).send({ success: false, msg: err.message });
  }
};

// ================= GET ALL DOCTORS =================
const getAllDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find().populate("user_id", "name email");
    res.send({ success: true, doctors });
  } catch (err) {
    res.status(500).send({ success: false, msg: err.message });
  }
};

module.exports = {
  register,
  login,
  getUserInfo,
  getAllUsers,
  getAllDoctors,
};



