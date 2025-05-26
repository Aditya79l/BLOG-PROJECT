require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const methodOverride = require("method-override");
const passport = require("passport");
const MongoStore = require("connect-mongo");
const path = require("path");

// Local imports
const passportConfig = require("./config/passport");
const authRoutes = require("./routes/authRoutes");
const postRoutes = require("./routes/postRoutes");
const errorHandler = require("./middlewares/errorHandler");
const commentRoutes = require("./routes/commentRoutes");
const userRoutes = require("./routes/userRoutes");
// Initialize app
const app = express();
const PORT = process.env.PORT || 4000;

// Passport config
passportConfig(passport);

// Middleware
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Sessions
app.use(
  session({
    secret: process.env.SESSION_SECRET || "keyboard cat",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URL,
    }),
  })
);

app.use(methodOverride("_method"));

// Passport
app.use(passport.initialize());
app.use(passport.session());

// Debug user in dev
app.use((req, res, next) => {
  console.log("Current user:", req.user?.username || "Not logged in");
  next();
});

// Routes
app.get("/", (req, res) => {
  res.render("home", { user: req.user, error: "", title: "Home" });
});

const { getUserProfile } = require("./controllers/userController");

app.get("/user/profile", (req, res, next) => {
  if (!req.user) {
    return res.redirect("/auth/login");
  }
  getUserProfile(req, res, next);
});

app.use("/auth", authRoutes);
app.use("/posts", postRoutes);
app.use("/", commentRoutes);
app.use("/user", userRoutes);

// Error handler
app.use(errorHandler);

// Connect DB & start server
mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err);
  });
