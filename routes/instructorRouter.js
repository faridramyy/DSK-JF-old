import express from "express";
import courseModel from "../models/course.js";
import projectModel from "../models/project.js";
import userModel from "../models/user.js";
const router = express.Router();

router.get("/:id", async (req, res) => {
  try {
    const instructorId = req.params.id;
    let courses = await courseModel.find({ instructorId: instructorId });
    let projects = await projectModel.find();
    res.render("instructor/home", {
      courses,
      projects,
      instructorId,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});
router.get("/:id/:cid", async (req, res) => {
  try {
    const instructorId = req.params.id;
    const courseId = req.params.cid;
    //const course=await courseModel.findById({})
    //const currCourse = await courseModel.find({ courseId: courseId });
    let students = await userModel.find({ role: "student" });
    res.render("instructor/course", { instructorId, courseId, students });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/:id/:cid", async (req, res) => {
  const CourseId = req.params.cid;
  const { title, deadline, description, numberOfStudentsPerTeam, noOfPhases } =
    req.body;

  try {
    if (await projectModel.findOne({ CourseId }))
      return res
        .status(409)
        .json({ errMsg: "You can't add another project in this course" });
    //code 409 for conflict
    const newProject = new projectModel({
      title,
      deadline,
      CourseId,
      description,
      numberOfStudentsPerTeam,
      noOfPhases,
    });

    newProject.save();
    console.log("saved successfully");
  } catch (err) {
    res.status(500).json({ err: true });
    console.log(err);
  }
});

router.get("/:id/:cid/:sid/add", async (req, res) => {
  const courseId = req.params.cid;
  const studentId = req.params.sid;

  const course = await courseModel.findById(courseId);

  try {
    if (course) {
      course.students.push(studentId);
      await course.save();
      console.log("Students added to the course successfully.");
    } else {
      console.log("Course not found.error");
    }
  } catch (err) {
    res.status(500).json({ err: true });
    console.log(err);
  }
});

router.get("/:id/:pid/project", (req, res) => {
  const projectID = req.params.pid;
  projectModel
    .findById(projectID)
    .then((result) => {
      res.render("instructor/project", { project: result });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.get("/Instructor/:id/:pid", (req, res) => {
  const projectID = req.params.pid;
  projectModel
    .findById(projectID)
    .then((result) => {
      res.render("instructor/project", { project: result });
    })
    .catch((err) => {
      console.log(err);
    });
});

export default router;
