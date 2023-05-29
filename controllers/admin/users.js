import userModel from "../../models/user.js";

export const users_get = async (req, res) => {
  const page = req.query.p || 0;
  const usersPerPage = 10;
  let userss = await userModel.find();
  const usersLength = userss.length;

  let users = await userModel
    .find()
    .skip(page * usersPerPage)
    .limit(usersPerPage);

  res.render("admin/users", { users, usersLength, usersPerPage });
};

export const users_ban_put = async (req, res) => {
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
    });
};
export const users_delete = async (req, res) => {
  await userModel
    .findByIdAndDelete(req.params.id)
    .then(() => {
      res.redirect("/admin/users");
    })
    .catch((err) => {
      console.log(err);
    });
};
