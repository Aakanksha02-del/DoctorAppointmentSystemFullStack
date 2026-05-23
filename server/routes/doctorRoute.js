const express = require("express");
const router = express.Router();

const doctorController = require("../controllers/doctorController");
const { auth, admin } = require("../middleware/auth");

// APPLY DOCTOR
router.post("/applyDoctor", auth, doctorController.applyDoctor);

// GET APPROVED
router.get("/appliedDoctors", auth, doctorController.appliedDoctors);

// FIX: must be real function
router.patch("/isDoctor/:doctorID", auth, admin, doctorController.isDoctor);

router.get( "/allDoctors", auth, doctorController.getAllDoctors);

router.get("/:id", auth, doctorController.getDoctorById);

module.exports = router;





