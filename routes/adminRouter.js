import express from "express";
import userModel from "../models/user.js";
const router = express.Router();

router.get("/", (req, res) => {
  res.render("admin/dashboard");
});
router.get("/users", async (req, res) => {
  const page = req.query.p || 0;
  const usersPerPage = 3;
  let users = await userModel.find()
    .skip(page * usersPerPage)
    .limit(usersPerPage);
  res.render("admin/users", { users });
});
router.get("/courses", (req, res) => {
  res.render("admin/courses");
});
router.get("/settings", (req, res) => {
  res.render("admin/settings");
});
router.get("/security", (req, res) => {
  res.render("admin/security");
});
router.get("/notifications", (req, res) => {
  res.render("admin/notifications");
});