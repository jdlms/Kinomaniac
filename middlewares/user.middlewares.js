userStatusCheck = function(req, res, next) {
 req.userStatus = (req.isAuthenticated() == false ? "vistor" : "user" );
 next()
}
module.exports = { userStatusCheck };
