import userModel from "../../models/user.js";

const users_get = async (req, res) => {
  const page = req.query.p || 0;
  const usersPerPage = 10;
  let usersLength = await userModel.count();

  let users = await userModel
    .find()
    .skip(page * usersPerPage)
    .limit(usersPerPage);

  res.render("admin/users", {
    user: await userModel.findById(req.params.id),
    users,
    usersLength,
    usersPerPage,
  });
};

const banUser_put = async (req, res) => {
  const userID = req.params.id;
  await userModel
    .findById(userID)
    .then((user) => {
      user.isBanned = !user.isBanned; // Toggle the value of isBanned
      user.save();
      res.json({ msg: "done" });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ err: true });
    });
};

const deleteUser_delete = async (req, res) => {
  await userModel
    .findByIdAndDelete(req.params.id)
    .then(() => {
      res.json({ msg: "done" });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ err: true });
    });
};

export default { users_get, banUser_put, deleteUser_delete };
