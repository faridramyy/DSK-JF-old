//Packages
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
//Shcema
import UserModel from "../../models/user.js";
// --------------------------------------------\\

const signup_get = (req, res) => {
  res.render("registration/signup");
};

const signup_post = async (req, res) => {
  const {
    role,
    firstName,
    lastName,
    username,
    email,
    password,
    gpa,
    createdByAdmin = 0,
  } = req.body;

  try {
    if (await UserModel.findOne({ email }))
      return res.status(409).json({ errMsg: "Email is Taken" });
    //code 409 for conflict
    if (await UserModel.findOne({ username }))
      return res.status(409).json({ errMsg: "Usernmae is Taken" });

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new UserModel({
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
    res.status(500).json({ err: true });
  }
};

export default { signup_get, signup_post };
