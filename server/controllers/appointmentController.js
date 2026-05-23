const Appointment = require("../models/appointmentModel");
const Doctor = require("../models/doctorModel");

//CREATE 
const createAppointment = async (req, res) => {

  try {

    const { doctor_id, date, time } = req.body;

    const appointment = await Appointment.create({

      user_id: req.user.id,

      doctor_id,

      date,

      time,

      status: "pending",

      payment_status: "paid",

      fees: 500,
    });

    res.send({
      success: true,
      appointment,
    });

  } catch (err) {

    console.log(err);

    res.status(500).send({
      success: false,
      msg: err.message,
    });
  }
};

//  ADMIN 
const getAllAppointments = async (req, res) => {

  try {

    const apps = await Appointment.find()

      .populate({
        path: "user_id",
        model: "User",
        select: "name email img_path",
      })

      .populate({
        path: "doctor_id",
        populate: {
          path: "user_id",
          model: "User",
          select: "name img_path",
        },
      });

    res.send({
      success: true,
      apps,
    });

  } catch (err) {

    console.log(err);

    res.status(500).send({
      success: false,
      msg: err.message,
    });
  }
};

//  USER
const getAppointmentsByUser = async (req, res) => {

  try {

    const apps = await Appointment.find({
      user_id: req.user.id,
    })

      .populate({
        path: "user_id",
        model: "User",
        select: "name img_path",
      })

      .populate({
        path: "doctor_id",
        populate: {
          path: "user_id",
          model: "User",
          select: "name img_path",
        },
      });

    res.send({
      success: true,
      apps,
    });

  } catch (err) {

    console.log(err);

    res.status(500).send({
      success: false,
      msg: err.message,
    });
  }
};

// DOCTOR 
const getAppointmentOfDoctor = async (req, res) => {

  try {

    const doctor = await Doctor.findOne({
      user_id: req.user.id,
    });

    if (!doctor) {

      return res.send({
        success: true,
        apps: [],
      });
    }

    const apps = await Appointment.find({
      doctor_id: doctor._id,
    })

      .populate({
        path: "user_id",
        model: "User",
        select: "name email img_path",
      })

      .populate({
        path: "doctor_id",
        populate: {
          path: "user_id",
          model: "User",
          select: "name img_path",
        },
      });

    res.send({
      success: true,
      apps,
    });

  } catch (err) {

    console.log(err);

    res.status(500).send({
      success: false,
      msg: err.message,
    });
  }
};

//  STATUS UPDATE 
const statusUpdate = async (req, res) => {

  try {

    const appointment = await Appointment.findByIdAndUpdate(
      req.params.appID,
      {
        status: req.body.status,
      },
      { new: true }
    );

    res.send({
      success: true,
      appointment,
    });

  } catch (err) {

    console.log(err);

    res.status(500).send({
      success: false,
      msg: err.message,
    });
  }
};

module.exports = {
  createAppointment,
  getAllAppointments,
  getAppointmentsByUser,
  getAppointmentOfDoctor,
  statusUpdate,
};









