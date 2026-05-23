const Question = require("../models/questionModel");


//  ASK QUESTION 
const askQuestion = async (req, res) => {
  try {
    const { user, doctor, question } = req.body;

    const newQuestion = new Question({
      user,
      doctor,
      question,
      status: "pending",
    });

    await newQuestion.save();

    res.json({
      success: true,
      msg: "Question submitted",
      question: newQuestion,
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      msg: "Server error",
    });
  }
};


// GET DOCTOR QUESTIONS 
const getDoctorQuestions = async (req, res) => {
  try {
    const { doctorId } = req.params;

    const questions = await Question.find({
      doctor: doctorId,
    })
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      questions,
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      msg: "Server error",
    });
  }
};


//  GET USER QUESTIONS 
const getUserQuestions = async (req, res) => {
  try {
    const { userId } = req.params;

    const questions = await Question.find({
      user: userId,
    })
      .populate("doctor", "name")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      questions,
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      msg: "Server error",
    });
  }
};


//ANSWER QUESTION 
const answerQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const { answer } = req.body;

    const updated = await Question.findByIdAndUpdate(
      id,
      {
        answer,
        status: "answered",
      },
      { new: true }
    );

    res.json({
      success: true,
      msg: "Answer submitted",
      question: updated,
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      msg: "Server error",
    });
  }
};

module.exports = {
  askQuestion,
  getDoctorQuestions,
  getUserQuestions,
  answerQuestion,
};




