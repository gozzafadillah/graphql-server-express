require("dotenv").config();
const jwt = require("jsonwebtoken");
const bcryptjs = require("bcryptjs");
const authModel = require("../models/auth.model");

const jwtSecret = process.env.JWT_SECRET;

const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.sendStatus(401);
  }

  const isAuth = await authModel.findById(token);

  jwt.verify(isAuth.token, jwtSecret, (err, user) => {
    if (err) {
      return res.sendStatus(403);
    }
    req.user = user;
    next();
  });
};

const generateAccessToken = (email) => {
  return jwt.sign(email, jwtSecret, { expiresIn: "1800s" });
};

const verifyToken = (token) => {
  return jwt.verify(token, jwtSecret);
};

module.exports = { authenticateToken, generateAccessToken, verifyToken };
