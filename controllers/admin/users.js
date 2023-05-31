import userModel from "../../models/user.js";

const users_get = async (req, res) => {
  const page = req.query.p || 0;
  const usersPerPage = 10;
  let userss = await userModel.find({ role: { $ne: "admin" } });
  const usersLength = userss.length;

  let users = await userModel
    .find({ role: { $ne: "admin" } })
    .skip(page * usersPerPage)
    .limit(usersPerPage);

  res.render("admin/users", { users, usersLength, usersPerPage });
};

const users_ban_put = async (req, res) => {
  const userID = req.params.id;
  await userModel
    .findById(userID)
    .then((user) => {
      user.isBanned = !user.isBanned; // Toggle the value of isBanned
      user.save();
      res.json({ msg: "done" });
    })
    .catch((err) => {
      res.status(500).json({ err: true });
    });
};

const users_delete = async (req, res) => {
  await userModel
    .findByIdAndDelete(req.params.id)
    .then(() => {
      res.json({ msg: "done" });
    })
    .catch((err) => {
      res.status(500).json({ err: true });
    });
};

export default { users_get, users_ban_put, users_delete };
