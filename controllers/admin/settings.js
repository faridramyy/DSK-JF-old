import userModel from "../../models/user.js";
import fileUpload from "express-fileupload";

const settings_get = async (req, res) => {
  const user = await userModel.findOne({ username: "admin" });
  res.render("admin/settings", { user });
};

const changeImage_put = async (req, res) => {};

const settings_put = async (req, res) => {
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

const checkemail_post = async (req, res) => {
  const { email } = req.body;
  try {
    const user = userModel.find({ email });
    if (user) res.json({ errMsg: "found" });
    else res.json({ msg: "Notound" });
  } catch (err) {
    console.log(err);
  }
};

export default { settings_get, settings_put, changeImage_put, checkemail_post };
