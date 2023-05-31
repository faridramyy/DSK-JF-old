import express from "express";
const router = express.Router();

router.get("/:id", (req, res) => {
    res.render("instructor/home");
  });
  
export default router;