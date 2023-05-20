import UserModel from "../models/user.js";
import bcrypt from "bcrypt";

const login_get = (req, res) => {
  res.render("login");
};

const login_post = async (req, res) => {
  const { username, Password } = req.body;

  if (username === "admin" && Password === "admin") {
    req.session.regenerate(function (err) {
      if (err) next(err);
      req.session.user = req.body.username;
      req.session.save(function (err) {
        if (err) return next(err);
        res.redirect("/admin");
      });
    });
  } else {
    try {
      const found = await UserModel.findOne({ username });
      if (found) {
        if (await bcrypt.compare(Password, found.password)) {
          req.session.regenerate(function (err) {
            if (err) next(err);
            req.session.user = req.body.username;
            req.session.save(function (err) {
              if (err) return next(err);
              res.redirect("/home");
            });
          });
        } else res.send({ err: "Wrong password" });
      } else {
        res.send({ err: "Username not found" });
      }
    } catch (err) {
      res.send({ err: "Database error" });
      console.log(err);
    }
  }
};

export { login_get, login_post };
