import express from "express";
import userModel from "../models/user.js";
import courseModel from "../models/course.js";

const router = express.Router();

router.get("/:id", async (req, res) => {
  try {
    const instructorId = req.params.id;
    const courses = await courseModel.find({
      instructorId,
      availableForUsers: true,
    });

    res.render("instructor/home", {
      user: await userModel.findById(instructorId),
      courses,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ err: true });
  }
});

//get inner-courses
router.get("/:Iid/:Cid", async (req, res) => {
  try {
    const instructorId = req.params.Iid;
    const courseId = req.params.Cid;
    res.render("instructor/inner-course", {
      user: await userModel.findById(instructorId),
      course: await courseModel.findById(courseId),
    });
  } catch (error) {
    console.log(err);
    res.status(500).json({ err: true });
  }
});

// get link page
router.get("/:uid/:cid/addLink", async (req, res) => {
  try {
    const instructorId = req.params.uid;
    const courseId = req.params.cid;
    res.render("instructor/addLink", {
      user: await userModel.findById(instructorId),
      course: await courseModel.findById(courseId),
    });
  } catch (error) {
    console.log(err);
    res.status(500).json({ err: true });
  }
});
// get file page
router.get("/:uid/:cid/addFile", async (req, res) => {
  try {
    const instructorId = req.params.uid;
    const courseId = req.params.cid;
    res.render("instructor/addFile", {
      user: await userModel.findById(instructorId),
      course: await courseModel.findById(courseId),
    });
  } catch (error) {
    console.log(err);
    res.status(500).json({ err: true });
  }
});
// get submission page
router.get("/:uid/:cid/addSubmission", async (req, res) => {
  try {
    const instructorId = req.params.uid;
    const courseId = req.params.cid;
    res.render("instructor/addSubmission", {
      user: await userModel.findById(instructorId),
      course: await courseModel.findById(courseId),
    });
  } catch (error) {
    console.log(err);
    res.status(500).json({ err: true });
  }
});
// get project page
router.get("/:uid/:cid/addProject", async (req, res) => {
  try {
    const instructorId = req.params.uid;
    const courseId = req.params.cid;
    res.render("instructor/addProject", {
      user: await userModel.findById(instructorId),
      course: await courseModel.findById(courseId),
    });
  } catch (error) {
    console.log(err);
    res.status(500).json({ err: true });
  }
});
// post project page
router.post("/:uid/:cid/addProject", async (req, res) => {
  const courseId = req.params.cid;
  const {
    title,
    deadline,
    description,
    numberOfStudentsPerTeam,
    numberOfPhases,
  } = req.body;
  try {
    if (await projectModel.findOne({ CourseId }))
      return res
        .status(409)
        .json({ errMsg: "You can't add another project in this course" });
    //code 409 for conflict
    const newProject = new projectModel({
      title,
      deadline,
      courseId,
      description,
      numberOfStudentsPerTeam,
      numberOfPhases,
    });
    newProject.save();
    console.log("saved successfully");
  } catch (err) {
    res.status(500).json({ err: true });
    console.log(err);
  }
});

//////////////////////////////////////////////////////////////////////////////////
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
      let availableStudent = course.students.includes(studentId);
      console.log(availableStudent);

      if (!availableStudent) {
        course.students.push(studentId);
        await course.save();
        console.log("Students added to the course successfully.");
        res.render("instructor/home", { availableStudent });
      } else {
        console.log("Student already exists");
      }
    } else {
      console.log("Course not found.");
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
