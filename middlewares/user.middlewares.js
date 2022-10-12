function user(req, res, next) {
  req.user ? next() : next();
}
module.exports = { user };
