import userModel from "../../models/user.js";

const notifications_get = async (req, res) => {
  res.render("admin/notifications", {
    user: await userModel.findById(req.params.id),
  });
};

export default {notifications_get}