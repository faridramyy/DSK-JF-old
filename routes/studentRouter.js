import express from "express";
import UserModel from "../models/user.js";
import courseModel from "../models/course.js";
const router = express.Router();

const findUser = async (id) => {
  return await UserModel.findById(id);
};

router.get("student/gotbanned", (req, res) => {
  res.render("student/gotBanned", { user: findUser(req.params.id) });
});

router.get("/courses", async (req, res) => {
  // const page = req.query.p || 0;
  // const usersPerPage = 3;
  let courses = await courseModel.find();
  // .skip(page * usersPerPage)
  // .limit(usersPerPage);
  res.render("student/courses", { courses });
});

router.get("/:id", (req, res) => {
  res.render("student/home");
});

export default router;
