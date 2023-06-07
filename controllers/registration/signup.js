import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import userModel from "../../models/user.js";

const signup_get = (req, res) => res.render("registration/signup");

const signup_post = async (req, res) => {
  const {
    role,
    firstName,
    lastName,
    username,
    email,
    password,
    gpa,
    createdByAdmin = false, // <---
  } = req.body;

  try {

    if (await userModel.findOne({ email }))
      return res.status(409).json({ errMsg: "Email is Taken" });

    if (await userModel.findOne({ username }))
      return res.status(409).json({ errMsg: "Usernmae is Taken" });

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new userModel({
      role,
      firstName,
      lastName,
      username,
      email,
      password: hashedPassword,
      gpa,
    });

    newUser.save();

    if (!createdByAdmin) {
      const token = jwt.sign({ user: newUser }, process.env.jwtSecretPhrase, {
        expiresIn: 3 * 24 * 60 * 60, //3 days
      });

      res.cookie("jwt", token, {
        httpOnly: true,
        maxAge: 3 * 24 * 60 * 60 * 1000, //3 days
      });
    }

    res.status(201).json({ user: newUser }); //code 201 for created success
  } catch (err) {
    console.log(err);
    res.status(500).json({ err: true });
  }
};

export default { signup_get, signup_post };
