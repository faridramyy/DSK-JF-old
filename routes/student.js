import express from "express";
import userModel from "../models/user.js";
import courseModel from "../models/course.js";
const router = express.Router();
import { createPublicKey } from "crypto";
import bcrypt from "bcrypt";
import path from "path";
const __dirname = path.resolve();

// router.get("/:id", async (req, res) => {
//   const userId = req.params.id;
//   try {
//     const user = await userModel.findById(userId).populate("courses");
//     console.log(user);

//     if (user !== null && user.courses) {
//       const courses = user.courses;
//       const populatedCourses = await courseModel.populate(courses, {
//         path: "students",
//       });
//       console.log(populatedCourses);

//       const courseTitles = populatedCourses.map((course) => course.title);
//       console.log(courseTitles);

//       res.render("student/home", {
//         user: user,
//         courses: populatedCourses,
//         courseTitles: courseTitles,
//       });
//     } else {
//       console.log("User or courses not found.");
//       res.status(404).send("User or courses not found.");
//     }
//   } catch (err) {
//     res.status(500).json({ error: true });
//     console.log(err);
//   }
// });

router.get("/:id", async (req, res) => {
  const userId = req.params.id;
  try {
    const user = await userModel.findById(userId).populate("courses");
    console.log(user);

    if (user !== null && user.courses) {
      const courses = user.courses;
      const populatedCourses = await courseModel.populate(courses, {
        path: "students",
      });
      console.log(populatedCourses);

      const courseTitles = populatedCourses.map((course) => course.title);
      console.log(courseTitles);

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

// router.get("/:id/courseInner/:cid", async (req, res) => {
//   const userId = req.params.id;
//   const cid = req.params.cid;
//   console.log(await courseModel.findById(req.params.cid));
//   const user = await userModel.findById(userId).populate("courses");

//   const course = await courseModel.findById(cid).populate('User');
//   console.log(course.instructorId);
//   // const instructorTitle = course.user.title;
//   // console.log(instructorTitle);

//   let populatedCourses = [];

//   if (user !== null && user.courses) {
//     const courses = user.courses;
//     populatedCourses = await courseModel.populate(courses, {
//       path: "students",
//     });
//   }

//   res.render("student/courseInner", {
//     user: await userModel.findById(req.params.id),
//     course: await courseModel.findById(req.params.cid),
//     courses: populatedCourses,
//     // instructorTitle: instructorTitle,
//   });
// });
router.get("/:id/courseInner/:cid", async (req, res) => {
  const userId = req.params.id;
  const courseId=req.params.cid;

  console.log(await courseModel.findById(req.params.cid));
  const user = await userModel.findById(userId).populate("courses");

  const course = await courseModel.findById(courseId);
  console.log(course.instructorId); // Assuming 'name' is the field that holds the instructor's name
  const instructor = await userModel.findById(course.instructorId);
  console.log(instructor.firstName);

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
    projects
  });
});

// router.get("/:id/courseInner", async (req, res) => {
//   res.render("student/courseInner", {
//     user: await userModel.findById(req.params.id),
//   });
// });

router.get("/:id/settings", async (req, res) => {
  res.render("student/settings", {
    user: await userModel.findById(req.params.id),
    dirname: __dirname,
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
          console.log(id);
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
