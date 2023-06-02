import express from "express";
import userModel from "../models/user.js";
import courseModel from "../models/course.js";
import courseLinkModel from "../models/courseLink.js";

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

router.post("/addlink", async (req, res) => {
  const { name, link, courseID } = req.body;
  try {
    const newCourseLink = new courseLinkModel({ name, link });
    newCourseLink.save();

    const course = await courseModel.findById(courseID);
    course.links.push(newCourseLink._id);
    course.save();
    res.status(200).json({ msg: "done" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ err: true });
  }
});

// get link page
router.get("/:Iid/:Cid/addLink", async (req, res) => {
  try {
    const instructorId = req.params.Iid;
    const courseId = req.params.Cid;
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
router.get("/:Iid/:Cid/addFile", async (req, res) => {
  try {
    const instructorId = req.params.Iid;
    const courseId = req.params.Cid;
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
router.get("/:Iid/:Cid/addSubmission", async (req, res) => {
  try {
    const instructorId = req.params.Iid;
    const courseId = req.params.Cid;
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
router.get("/:Iid/:Cid/addProject", async (req, res) => {
  try {
    const instructorId = req.params.Iid;
    const courseId = req.params.Cid;
    res.render("instructor/addProject", {
      user: await userModel.findById(instructorId),
      course: await courseModel.findById(courseId),
    });
  } catch (error) {
    console.log(err);
    res.status(500).json({ err: true });
  }
});

export default router;
