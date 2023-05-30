import express from "express";
import courseModel from "../models/course.js";
const router = express.Router();


router.get("/courses", async (req, res) => {
  // const page = req.query.p || 0;
  // const usersPerPage = 3;
  let courses = await courseModel.find();
  // .skip(page * usersPerPage)
  // .limit(usersPerPage);
  res.render("student/courses", { courses });
});
router.get("/courseInner", (req, res) => {
  res.render("student/courseInner");
});
router.get("/settings", (req, res) => {
  res.render("student/settings");
});
router.get("/security", (req, res) => {
  res.render("student/security");
});
router.get("/notifications", (req, res) => {
  res.render("student/notifications");
});
router.get("/:id", (req, res) => {
  res.render("student/home");
});

export default router;
