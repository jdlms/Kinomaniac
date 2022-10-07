const router = require("express").Router();
const { isLoggedIn } = require("../middlewares/auth.middlewares");
const passport = require('passport');

router.get('/login', function (req, res, next) {
  res.render('auth/login');
});


router.get('/auth/google',
  passport.authenticate('google', {
    scope: ['profile']
  }
  ));
const passportMiddleware = passport.authenticate('google', {
  successRedirect: '/profile',
  failureRedirect: '/login'
});
router.get('/auth/google/callback', passportMiddleware);

//Define the Protected Route, by using the "checkAuthenticated" function defined above as middleware
router.get("/profile", isLoggedIn, (req, res) => {
  console.log(req.user);
  res.render("auth/profile", { name: req.user.displayName, movies: req.user.movies, picture: req.user.photos._json.pictures});
});

//Define the Logout
router.post("/logout", (req, res) => {
  req.logOut()
  req.session.destroy();
  res.redirect("/index")
  console.log(`-------> User Logged out`)
})


module.exports = router;