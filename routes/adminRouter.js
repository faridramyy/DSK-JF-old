import express from "express";
import UserModel from "../models/user.js";
const router = express.Router();

router.get("/", (req, res) => {
  res.render("admin/dashboard");
});
router.get("/users", async (req, res) => {
  const users = await UserModel.find();
  console.log(users);
  res.render("admin/users", { users });
});
router.get("/courses", (req, res) => {
  res.render("admin/courses");
});
router.get("/settings", (req, res) => {
  res.render("admin/settings");
});

router.get("/", (req, res) => {
  res.render("admin/dashboard");
});
router.get("/users", (req, res) => {
  res.render("admin/users");
});
router.get("/courses", (req, res) => {
  res.render("admin/courses");
});
router.get("/settings", (req, res) => {
  res.render("admin/settings");
});

export default router;
