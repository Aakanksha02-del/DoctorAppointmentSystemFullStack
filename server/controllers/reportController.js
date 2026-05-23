const Report = require("../models/reportModel");
const Doctor = require("../models/doctorModel");

//  CREATE REPORT
const createReport = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ user_id: req.user.id });

    if (!doctor) {
      return res.status(404).send({
        success: false,
        msg: "Doctor not found",
      });
    }

    const report = await Report.create({
      user_id: req.body.user_id,
      doctor_id: doctor._id,
      diagnosis: req.body.diagnosis,
      description: req.body.description,
    });

    res.send({
      success: true,
      report,
    });

  } catch (err) {
    console.log("CREATE REPORT ERROR:", err);
    res.status(500).send({
      success: false,
      msg: err.message,
    });
  }
};

// GET REPORTS 
const getReports = async (req, res) => {
  try {
    let filter = {};

    //  DOCTOR → only own reports
    if (req.user.role === "doctor") {
      const doctor = await Doctor.findOne({ user_id: req.user.id });

      if (!doctor) {
        return res.send({ success: true, reports: [] });
      }

      filter.doctor_id = doctor._id;
    }

    
    if (req.user.role === "user") {
      filter.user_id = req.user.id;
    }

    console.log("USER:", req.user);
    console.log("FILTER:", filter);

    const reports = await Report.find(filter)
      .populate("user_id", "name")
      .populate({
        path: "doctor_id",
        populate: {
          path: "user_id",
          select: "name",
        },
      });

    console.log("REPORT COUNT:", reports.length);

    res.send({
      success: true,
      reports,
    });

  } catch (err) {
    console.log("GET REPORT ERROR:", err);
    res.status(500).send({
      success: false,
      msg: err.message,
    });
  }
};

module.exports = {
  createReport,
  getReports,
};



