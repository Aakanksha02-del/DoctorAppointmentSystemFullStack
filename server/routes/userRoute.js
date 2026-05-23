const express = require("express")
const router = express.Router()

const userController = require("../controllers/userController")
const { auth } = require("../middleware/auth")
const upload = require("../middleware/multer")

//  REGISTER 
router.post("/register", upload.single("myFile"), userController.register)

// LOGIN 
router.post("/login", userController.login)

//  USER INFO 
router.get("/getUserInfo", auth, userController.getUserInfo)

//  USERS 
router.get("/getAllUsers", userController.getAllUsers)

//  DOCTORS
router.get("/getAllDoctors", userController.getAllDoctors)

module.exports = router





