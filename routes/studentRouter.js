import express from "express";
import UserModel from "../models/user.js";

const router = express.Router();

const findUser = async (id) => {
  return await UserModel.findById(id);
};

router.get("/gotbanned", (req, res) => {
  res.render("student/gotBanned", { user: findUser(req.params.id) });
});

router.get("/:id", (req, res) => {
  res.render("student/home", { user: findUser(req.params.id) });
});

export default router;
