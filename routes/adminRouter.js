import express from "express";
const router = express.Router();

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
router.get("/security", (req, res) => {
  res.render("admin/security");
});
router.get("/notifications", (req, res) => {
  res.render("admin/notifications");
});

export default router;
