import userModel from "../../models/user.js";

const settings_get = async (req, res) => {
  const user = await userModel.findOne({ username: "admin" });
  res.render("admin/settings", { user });
};

const changeImage_put = async (req, res) => {};

const settings_put = async (req, res) => {
  const { firstName, lastName, email, phoneNumber, birthdayDate } = req.body;
  try {
    const foundUser = await userModel.findOne({ email });
    if (foundUser) {
      if (foundUser.role !== "admin") {
        return res.json({ errMsg: "Email is taken" });
      }
    }

    userModel
      .findOneAndUpdate(
        { username: "admin" },
        { firstName, lastName, email, phoneNumber, birthdayDate }
      )
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
  const { email, owner } = req.body;
  try {
    const user = await userModel.findOne({ email });
    if (user) var userId = user._id.toString();
    if (user && userId !== owner) res.json({ errMsg: "found" });
    else res.json({ msg: "Notound" });
  } catch (err) {
    console.log(err);
  }
};

export default { settings_get, settings_put, changeImage_put, checkemail_post };
