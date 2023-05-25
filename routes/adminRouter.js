import express from "express";
const router = express.Router();

router.get("/editProfile", (req, res) => {
  res.render("admin/editProfile");
});
router.get("/security", (req, res) => {
  res.render("admin/security");
});

export default router;
