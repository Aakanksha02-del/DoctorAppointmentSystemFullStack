const express = require("express");
const router = express.Router();

const { createReport, getReports } = require("../controllers/reportController");
const { auth } = require("../middleware/auth");

router.post("/create", auth, createReport);
router.get("/", auth, getReports);

module.exports = router;








