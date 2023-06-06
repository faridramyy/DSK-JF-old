import express from "express";
import userModel from "../models/user.js";
import courseModel from "../models/course.js";
const router = express.Router();
import { createPublicKey } from "crypto";
import bcrypt from "bcrypt";
import path from "path";
const __dirname = path.resolve();



router.get("/:id", async (req, res) => {
  const userId = req.params.id;
  try {
    const user = await userModel.findById(userId).populate("courses");

    if (user !== null && user.courses) {
      const courses = user.courses;
      const populatedCourses = await courseModel.populate(courses, {
        path: "students",
      });

      const instructornames = await courseModel.populate(courses, {
        path: "instructorId",
      });
      const instructorNames = instructornames.map(
        (course) => course.instructorId
      );

      const courseTitles = populatedCourses.map((course) => course.title);

      res.render("student/home", {
        user: user,
        courses: populatedCourses,
        courseTitles: courseTitles,
      });
    } else {
      console.log("User or courses not found.");
      res.status(404).send("User or courses not found.");
    }
  } catch (err) {
    res.status(500).json({ error: true });
    console.log(err);
  }
});
//get all courses
router.get("/:id/courses", async (req, res) => {
  const userId = req.params.id;
  try {
    const user = await userModel.findById(userId).populate("courses");
    const myCourses = user.courses;
    const populatedCourses = await courseModel.populate(myCourses, {
      path: "students",
    });
    const page = req.query.p || 0;
    const coursesPerPage = 8;
    let coursess = await courseModel.find();
    const coursesLength = coursess.length;

    const allCourses = await courseModel
      .find()
      .skip(page * coursesPerPage)
      .limit(coursesPerPage);
    res.render("student/courses", {
      user: await userModel.findById(userId),
      courses: populatedCourses,
      allCourses,

      coursesLength,
      coursesPerPage,
    });
  } catch (err) {
    console.log(err);
  }
});

router.get("/:id/courseInner/:cid", async (req, res) => {
  const userId = req.params.id;
  const courseId = req.params.cid;

  const user = await userModel.findById(userId).populate("courses");

  const course = await courseModel.findById(courseId);
  const instructor = await userModel.findById(course.instructorId);

  const courseProject = await courseModel
    .findById(courseId)
    .populate("projects");
  const projects = courseProject.projects;

  const courseLinks = await courseModel.findById(courseId).populate("links");
  const links = courseLinks.links;

  const courseSubmissions = await courseModel
    .findById(courseId)
    .populate("submissions");
  const submissions = courseSubmissions.submissions;

  const courseFiles = await courseModel.findById(courseId).populate("files");
  const files = courseFiles.files;

  let populatedCourses = [];

  if (user !== null && user.courses) {
    const courses = user.courses;
    populatedCourses = await courseModel.populate(courses, {
      path: "students",
    });
  }

  res.render("student/courseInner", {
    user: await userModel.findById(req.params.id),
    course: await courseModel.findById(req.params.cid),
    courses: populatedCourses,
    instructor,
    links,
    submissions,
    files,
    projects,
  });
});

router.get("/:id/courses/:cid", async (req, res) => {
  const userId = req.params.id;
  const courseId = req.params.cid;

  const user = await userModel.findById(userId).populate("courses");

  const course = await courseModel.findById(courseId);
  const instructor = await userModel.findById(course.instructorId);
  let populatedCourses = [];

  if (user !== null && user.courses) {
    const courses = user.courses;
    populatedCourses = await courseModel.populate(courses, {
      path: "students",
    });
  }
  res.render("student/allCourses-inner", {
    user: await userModel.findById(req.params.id),
    course: await courseModel.findById(req.params.cid),
    courses: populatedCourses,
    instructor,
    title: "Course inner",
  });
});

router.post("/:id/settings/updatedata", async (req, res) => {
  const userid = req.params.id;
  const { firstName, lastName, email, phoneNumber, birthdayDate } = req.body;
  try {
    if (await userModel.findOne({ email, _id: { $ne: userid } }))
      return res.status(409).json({ errMsg: "Email is Taken" });
    userModel
      .findByIdAndUpdate(userid, {
        firstName,
        lastName,
        email,
        phoneNumber,
        birthdayDate,
      })
      .then(() => {
        return res.status(200).json({ msg: "done" });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({ err: true });
      });
  } catch (err) {
    console.log(err);
    res.status(500).json({ err: true });
  }
});

router.post("/settings/changepp/:id", async (req, res) => {
  if (req.files) {
    const file = req.files.file;
    const filename = file.name;
    const filePath = `${__dirname}/public/upload/images/${filename}`;

    file.mv(filePath, async (err) => {
      if (err) {
        console.log(err);
        res.status(500).json({ err: true });
      } else {
        try {
          const id = req.params.id;
          await userModel.findByIdAndUpdate(id, {
            profilePic: `/upload/images/${filename}`,
          });
          console.log("Profile picture updated successfully.");
          res.json({ msg: "done" });
        } catch (err) {
          console.log(err);
          res.status(500).json({ err: true });
        }
      }
    });
  } else {
    console.log("No file received.");
    res.status(400).json({ err: true });
  }
});

router.get("/:id/settings", async (req, res) => {
  res.render("student/settings", {
    user: await userModel.findById(req.params.id),
  });
});

router.get("/:id/security", async (req, res) => {
  res.render("student/security", {
    user: await userModel.findById(req.params.id),
  });
});

router.get("/:id/notifications", async (req, res) => {
  res.render("student/notifications", {
    user: await userModel.findById(req.params.id),
  });
});

export default router;
