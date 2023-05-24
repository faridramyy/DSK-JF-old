import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import UserModel from "../../models/user.js";

export const login_get = (req, res) => {
  res.render("registration/login");
};

export const login_post = async (req, res) => {
  const { username, Password } = req.body;
  try {
    const founduser = await UserModel.findOne({ username });
    if (founduser) {
      if (await bcrypt.compare(Password, founduser.password)) {
        const userId = founduser._id;
        const token = jwt.sign({ userId }, process.env.jwtSecretPhrase, {
          expiresIn: 3 * 24 * 60 * 60, //3 days
        });
        res.cookie("jwt", token, {
          httpOnly: true,
          maxAge: 3 * 24 * 60 * 60 * 1000, //3 days
        });
        return res.status(200).json({ user: userId });
      } else return res.status(401).json({ errMsg: "Wrong password" });
    } else return res.status(401).json({ errMsg: "Username not found" });
  } catch (err) {
    console.log(err);
  }
};
