import jwt from "jsonwebtoken";

export const adminAuth = (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(token, process.env.jwtSecretPhrase, (err, decodedToken) => {
      if (decodedToken.user.role == "admin") next();
      else res.redirect(`/login?notAllowed=${true}`);
    });
  } else res.redirect(`/login?notAllowed=${true}`);
};

export const studentAuth = (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(token, process.env.jwtSecretPhrase, (err, decodedToken) => {
      if (decodedToken.user.role == "student" && !decodedToken.user.isBanned)
        next();
      else if (
        decodedToken.user.role == "student" &&
        decodedToken.user.isBanned
      )
        res.redirect(`/gotbanned/${decodedToken.user._id}`);
      else res.redirect("/login");
    });
  } else res.redirect("/login");
};

export const instructorAuth = (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(token, process.env.jwtSecretPhrase, (err, decodedToken) => {
      if (decodedToken.user.role == "instructor") next();
      else res.redirect(`/login?notAllowed=${true}`);
    });
  } else res.redirect(`/login?notAllowed=${true}`);
};
