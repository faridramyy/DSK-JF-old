// middleware to test if authenticated
export function adminIsAuthenticated(req, res, next) {
  if (req.session.user === "admin") next();
  else res.redirect("/login");
}
