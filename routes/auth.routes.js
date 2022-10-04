const router = require("express").Router();
require("../config/index");
const passport = require('passport');
const session = require('express-session');
const { isLoggedIn } = require("../middlewares/auth.middlewares");


router.get('/login', function(req, res, next) {
    res.render('auth/login');
  });


router.get('/auth/google',
  passport.authenticate('google', { scope:
      [ 'email', 'profile' ] }
));

router.get('/auth/google/callback',
    passport.authenticate( 'google', {
        successRedirect: '/profile',
        failureRedirect: '/login'
}));

//Define the Protected Route, by using the "checkAuthenticated" function defined above as middleware
router.get("/profile", isLoggedIn, (req, res) => {
  res.render("profile", {name: req.user.displayName})
});

//Define the Logout
router.post("/logout", (req,res) => {
    req.logOut()
    req.session.destroy();
    res.redirect("/login")
    console.log(`-------> User Logged out`)
})


module.exports = router;