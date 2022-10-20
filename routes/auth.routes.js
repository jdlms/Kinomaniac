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


router.post('/logout', function (req, res, next) {
  req.logout(function (err) {
    if (err) { return next(err); }
    req.session.destroy();
    res.redirect('/');
    console.log(`-------> User Logged out`);
  });
});

module.exports = router;
