const multer = require("multer")
const path = require("path")

// STORAGE
const storage = multer.diskStorage({

  destination: function (req, file, cb) {
    cb(null, "upload/")
  },

  filename: function (req, file, cb) {

    const fileName =
      Date.now() + path.extname(file.originalname)

    cb(null, fileName)

    console.log("FILE:", fileName)
  }
})

// FILE FILTER
const fileFilter = (req, file, cb) => {

  const allowedTypes = [
    "image/png",
    "image/jpeg",
    "image/jpg",
    "image/webp"
  ]

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true)
  } else {

    cb(
      new Error("Only png jpg jpeg webp allowed"),
      false
    )
  }
}

// UPLOAD
const upload = multer({
  storage,
  fileFilter
})

module.exports = upload




