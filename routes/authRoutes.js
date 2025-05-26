const express = require("express");
const User = require("../models/User");
const {
  getLogin,
  getRegister,
  register,
  login,
  logout,
} = require("../controllers/authController");
const authRoutes = express.Router();

authRoutes.get("/login", getLogin);

authRoutes.post("/login", login);

authRoutes.get("/register", getRegister);

authRoutes.post("/register", register);

authRoutes.get("/logout", logout);

module.exports = authRoutes;
