const express = require("express");
const User = require("../models/User");

const {
  getUserProfile,
  getEditProfileForm,
  updateUserProfile,
  deleteUserAccount,
} = require("../controllers/userController");
const { ensureAuthenticated } = require("../middlewares/auth");
const { use } = require("passport");
const upload = require("../config/multer");
const userRoutes = express.Router();

//Render login page
userRoutes.get("/profile", ensureAuthenticated, getUserProfile);

userRoutes.get("/edit", ensureAuthenticated, getEditProfileForm);
userRoutes.post("/delete", ensureAuthenticated, deleteUserAccount);
userRoutes.post(
  "/edit",
  ensureAuthenticated,
  upload.single("profilePicture"),
  updateUserProfile
);
module.exports = userRoutes;
