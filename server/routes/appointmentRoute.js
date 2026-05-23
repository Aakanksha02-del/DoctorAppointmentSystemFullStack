const express = require("express");
const router = express.Router();

const {
  createAppointment,
  getAllAppointments,
  getAppointmentsByUser,
  getAppointmentOfDoctor,
  statusUpdate,
} = require("../controllers/appointmentController");

// IMPORTANT FIX
const { auth, doctor } = require("../middleware/auth");

// ROUTES
router.post("/createAppointment", auth, createAppointment);

router.get("/getAllAppointments", auth, getAllAppointments);

router.get("/getAppointmentsByUser", auth, getAppointmentsByUser);

router.get("/getAppointmentOfDoctor", auth, doctor, getAppointmentOfDoctor);

router.patch("/statusUpdate/:appID", auth, doctor, statusUpdate);

module.exports = router;




