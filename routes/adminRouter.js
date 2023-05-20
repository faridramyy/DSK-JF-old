import express from "express";
const router = express.Router();

router.get("/", (req, res) => {
  res.render("admin/admin");
});

router.get("/users", (req, res) => {
  res.render("admin/users");
});

router.get("/courses", (req, res) => {
  res.render("admin/courses");
});

router.get("/addCourses", (req, res) => {
  res.render("admin/addCourses");
});

export default router;
