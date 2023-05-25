import express from "express";
const router = express.Router();

router.get("/editProfile", (req, res) => {
  res.render("admin/editProfile");
});

export default router;
