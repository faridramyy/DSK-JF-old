//Packages
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
//Shcema
import UserModel from "../../models/user.js";
// --------------------------------------------\\

const login_get = (req, res) => {
  const notAllowed = req.query.notAllowed || false;
  res.render("registration/login", { notAllowed });
};

const login_post = async (req, res) => {
  const { username, Password } = req.body;

  try {
    const founduser = await UserModel.findOne({ username });

    if (founduser) {
      if (await bcrypt.compare(Password, founduser.password)) {
        const token = jwt.sign(
          { user: founduser },
          process.env.jwtSecretPhrase,
          {
            expiresIn: 3 * 24 * 60 * 60, //3 days
          }
        );

        res.cookie("jwt", token, {
          httpOnly: true,
          maxAge: 3 * 24 * 60 * 60 * 1000, //3 days
        });

        return res.status(200).json({ user: founduser });
      } else return res.status(401).json({ errMsg: "Wrong password" });
    } else return res.status(401).json({ errMsg: "Username not found" });
  } catch (err) {
    res.status(500).json({ err: true });
  }
};

export default { login_get, login_post };
