// middlewares/auth.js

const ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/auth/login");
};

module.exports = { ensureAuthenticated }; // ✅ correct way to export for destructuring import
