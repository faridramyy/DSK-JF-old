import express from "express";
import userModel from "../models/user.js";
const router = express.Router();

router.get("/:id", async (req, res) => {
  res.render("admin/dashboard", {
    user: await userModel.findById(req.params.id),
  });
});

router.get("/:id/users", async (req, res) => {
  res.render("admin/users", {
    user: await userModel.findById(req.params.id),
  });
});

router.get("/:id/courses", async (req, res) => {
  res.render("admin/courses", {
    user: await userModel.findById(req.params.id),
  });
});

router.get("/:id/settings", async (req, res) => {
  res.render("admin/settings", {
    user: await userModel.findById(req.params.id),
  });
});

router.get("/:id/security", async (req, res) => {
  res.render("admin/security", {
    user: await userModel.findById(req.params.id),
  });
});

router.get("/:id/notifications", async (req, res) => {
  res.render("admin/notifications", {
    user: await userModel.findById(req.params.id),
  });
});

export default router;
