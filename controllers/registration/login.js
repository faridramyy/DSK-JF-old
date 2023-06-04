import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import userModel from "../../models/user.js";

const login_get = (req, res) => {
  const notAllowed = req.query.notAllowed || false;
  res.render("registration/login", { notAllowed });
};

const login_post = async (req, res) => {
  const { username, Password } = req.body;

  try {
    const founduser = await userModel.findOne({ username });

    if (!founduser)
      return res.status(401).json({ errMsg: "Username not found" });

    if (!(await bcrypt.compare(Password, founduser.password)))
      return res.status(401).json({ errMsg: "Wrong password" });

    const token = jwt.sign({ user: founduser }, process.env.jwtSecretPhrase, {
      expiresIn: 3 * 24 * 60 * 60, //3 days
    });

    res.cookie("jwt", token, {
      httpOnly: true,
      maxAge: 3 * 24 * 60 * 60 * 1000, //3 days
    });

    res.status(200).json({ user: founduser });
  } catch (err) {
    console.log(err);
    res.status(500).json({ err: true });
  }
};

export default { login_get, login_post };
