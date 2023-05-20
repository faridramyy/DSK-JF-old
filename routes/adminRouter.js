import express from "express";
const router = express.Router();

router.get("/", (req, res) => {
  res.render("admin/admin");
});

export default router;
