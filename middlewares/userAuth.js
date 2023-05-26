import jwt from "jsonwebtoken";

export const adminAuth = (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(token, process.env.jwtSecretPhrase, (err, decodedToken) => {
      if (decodedToken.user.role == "admin") next();
      else res.redirect("/login");
    });
  } else {
    res.redirect("/login");
  }
};
