import userModel from "../../models/user.js";
import fileUpload from "express-fileupload";

export const settings_get = async (req, res) => {
  const user = await userModel.findOne({ username: "admin" });
  res.render("admin/settings", { user });
};

export const changeImage_put = async (req, res) => {};

export const settings_put = async (req, res) => {
  const { firstName, lastName, email } = req.body;
  try {
    userModel
      .findOneAndUpdate({ username: "admin" }, { firstName, lastName, email })
      .then(() => {
        return res.json({ msg: "done" });
      })
      .catch((err) => {
        console.error(err);
      });
  } catch (err) {
    console.log(err);
  }
};
export const checkemail_post = async (req, res) => {
  const { email } = req.body;
  try {
    const user = userModel.find({ email });
    if (user) res.json({ errMsg: "found" });
    else res.json({ msg: "Notound" });
  } catch (err) {
    console.log(err);
  }
};
