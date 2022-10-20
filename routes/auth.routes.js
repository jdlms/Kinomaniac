const router = require("express").Router();
const { isLoggedIn } = require("../middlewares/auth.middlewares");
const passport = require("passport");
const { Movie } = require("../models/Movie.module");

router.get("/login", function (req, res, next) {
  res.render("auth/login");
});

router.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile"],
  })
);
const passportMiddleware = passport.authenticate("google", {
  successRedirect: "/films",
  failureRedirect: "/login",
});
router.get("/auth/google/callback", passportMiddleware);

//Define the Protected Route, by using the "checkAuthenticated" function defined above as middleware
router.get("/profile", isLoggedIn, async (req, res) => {
  const reviewCount = await Movie.where({ reviewed: true }).countDocuments();
  const watchlistCount = await Movie.where({ watchList: true }).countDocuments();
  const likedCount = await Movie.where({ liked: true }).countDocuments();
  res.render("auth/profile", { user: req.user, reviewCount, watchlistCount, likedCount });
});

//Define the Logout
router.post("/logout", (req, res) => {
  req.logOut();
  req.session.destroy();
  res.redirect("/index");
  console.log(`-------> User Logged out`);
});

module.exports = router;
