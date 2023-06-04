import userModel from "../../models/user.js";

const dashboard_get = async (req, res) => {
  res.render("admin/dashboard", {
    user: await userModel.findById(req.params.id),
  });
};

export default { dashboard_get };
