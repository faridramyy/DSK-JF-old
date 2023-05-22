import UserModel from "../models/user.js";

export async function isAuthenticated(req, res, next) {
  if (req.session.user !== "admin" && req.session.user) {
    if (await UserModel.findOne({ })) {
    }
  } else res.redirect("/login");
}
