const router = require("express").Router();
const { isLoggedIn } = require("../middlewares/auth.middlewares");
const passport = require("passport");
const { UserMovieData } = require("../models/UserMovieData.module");

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
  const reviewCount = await UserMovieData.where({ reviewed: true }).countDocuments();
  const watchlistCount = await UserMovieData.where({ watchList: true }).countDocuments();
  const likedCount = await UserMovieData.where({ liked: true }).countDocuments();
  res.render("auth/profile", { user: req.user, reviewCount, watchlistCount, likedCount });
});

//Define the Logout
router.post("/logout", (req, res, next) => {
  req.logOut((err) => {
    if (err) {
      return next(err);
    }
    req.session.destroy();
    res.redirect("/");
    console.log(`-------> User Logged out`);
  });
});

module.exports = router;
