import UserModel from "../models/user.js";
import bcrypt from "bcrypt";

const signup_get = (req, res) => {
  res.render("signup");
};

const signup_post = async (req, res) => {
  const {
    firstName,
    lastName,
    username,
    email,
    password,
    role = "student",
  } = req.body;
  try {
    if (await UserModel.findOne({ email })) {
      res.send({ err: "Email is Taken" });
    } else if (await UserModel.findOne({ username })) {
      res.send({ err: "Username is Taken" });
    } else {
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(password, salt);

      const newUser = new UserModel({
        role,
        firstName,
        lastName,
        username,
        email,
        password: hashedPassword,
        gpa: 0,
      });
      newUser.save();

      req.session.regenerate(function (err) {
        if (err) next(err);
        req.session.user = req.body.username;
        req.session.save(function (err) {
          if (err) return next(err);
          res.redirect("/home");
        });
      });
    }
  } catch (err) {
    res.send({ err: "Database error" });
    console.log(err);
  }
};

export { signup_get, signup_post };
