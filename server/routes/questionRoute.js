const express = require("express");
const router = express.Router();

const {
  askQuestion,
  getDoctorQuestions,
  answerQuestion,
  getUserQuestions,
} = require("../controllers/questionController");


// ASK QUESTION (USER) 
router.post("/ask", askQuestion);


//  DOCTOR GET QUESTIONS 
router.get("/doctor/:doctorId", getDoctorQuestions);


//USER GET QUESTIONS 
router.get("/user/:userId", getUserQuestions);


// ANSWER QUESTION (DOCTOR) 
router.put("/answer/:id", answerQuestion);


module.exports = router;




