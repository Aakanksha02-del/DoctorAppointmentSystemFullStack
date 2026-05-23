const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  try {

    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).send({
        success: false,
        msg: "No token",
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    req.user = {
      id: decoded.id,
      role: decoded.role,
    };

    next();

  } catch (err) {

    console.log("AUTH ERROR:", err);

    res.status(401).send({
      success: false,
      msg: "Invalid token",
    });
  }
};

const admin = (req, res, next) => {

  if (req.user.role !== "admin") {
    return res.status(403).send({
      success: false,
      msg: "Admin only",
    });
  }

  next();
};

const doctor = (req, res, next) => {

  if (req.user.role !== "doctor") {
    return res.status(403).send({
      success: false,
      msg: "Doctor only",
    });
  }

  next();
};

module.exports = {
  auth,
  admin,
  doctor,
};








