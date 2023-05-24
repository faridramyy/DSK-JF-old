import jwt from "jsonwebtoken";

export const userAuth = (req, res, next) => {
  const token = req.cookie.jwt;

  if (token) {
    jwt.verify(token, process.env.jwtSecretPhrase, (err, decodeToken) => {
      if (err)
        //el token di atl3b fiha
        res.redirect("/login");
        else
        next();
    });
  } else {
    res.redirect("/login");
  }
};
