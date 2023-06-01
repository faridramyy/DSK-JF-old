import express from "express";
import courseModel from "../models/course.js";
import projectModel from "../models/project.js";
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
router.get("/:id/:cid", async (req, res) => {
  try {
    const instructorId = req.params.id;
    const courseId = req.params.cid;

    res.render("instructor/course",{instructorId,courseId});
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/:id/:cid", async (req, res) => {
  const { title, deadline, description, numberOfStudentsPerTeam, noOfPhases } =
    req.body;
  try {
    const newProject = new projectModel({
      title,
      deadline,
      description,
      numberOfStudentsPerTeam,
      noOfPhases,
    });
   
    newProject.save();

    
  } catch (err) {
    res.status(500).json({ err: true });
    console.log(err);
  }
});

export default router;
