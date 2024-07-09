 function authMiddleware(req, res, next) {
    if (req.session.user) {
      next();
    } else {
      res.redirect('/login'); // Redirect to login page if not logged in
    }
  }
 
  module.exports = authMiddleware;