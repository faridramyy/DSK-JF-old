import express from "express";
import courseModel from "../models/course.js";
const router = express.Router();

router.get("/:id", async (req, res) => {
  try {
    const instructorId = req.params.id;
    let courses = await courseModel.find({ instructorId: instructorId });
    res.render("instructor/home", { courses });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/:id/course", (req, res) => {
  res.render("instructor/course");
});

export default router;
