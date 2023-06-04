import express from "express";
import userModel from "../models/user.js";
import courseModel from "../models/course.js";
import path from "path";
import bcrypt from "bcrypt";
const __dirname = path.resolve();
const router = express.Router();

import dashboard from "../controllers/admin/dashboard.js";
import users from "../controllers/admin/users.js";

router.get("/:id", dashboard.dashboard_get);

router.get("/:id/users", users.users_get);
router.put("/users/ban/:id", users.banUser_put);
router.delete("/users/delete/:id", users.deleteUser_delete);



router.get("/:id/courses", async (req, res) => {
  let instructors = await userModel.find({ role: "Instructor" });
  let course = await courseModel.find();

  res.render("admin/courses", {
    user: await userModel.findById(req.params.id),
    dirname: __dirname,
    instructors,
    course,
  });
});

router.post("/courses", async (req, res) => {
  const { title, numberOfStudents, instructorId } = req.body;
  try {
    const newCourse = new courseModel({
      title,
      numberOfStudents,
      instructorId,
    });
    newCourse.save();

    res.json({ msg: "done" });
  } catch (err) {
    res.status(500).json({ err: true });
  }
});

router.get("/:id/courses/:Cid", async (req, res) => {
  console.log("HEre");
  const courseId = req.params.Cid;
  try {
    let course = await courseModel.findById(courseId);
    let Arrayofstudents = course.students;
    let instructor = await userModel.findById(course.instructorId);
    let students = await userModel.find({ role: "student" });
    res.render("admin/courseInner", {
      user: await userModel.findById(req.params.id),
      dirname: __dirname,
      course,
      instructor,
      students,
      Arrayofstudents,
      students,
    });
  } catch (error) {
    console.error("Error retrieving course:", error);
    res.status(500).send("Internal Server Error");
  }
});

// router.put("/:id/courses/:Cid/addStudent/:sid", async (req, res) => {
//   console.log("Hereeee");
//   const courseId = req.params.Cid;
//   const studentId = req.params.sid;
//   try {
//     const course = await courseModel.findById(courseId);
//     const arrayOfStudents = course.students;
//     arrayOfStudents.push(studentId);
//     await course.save();
//     res.json({ msg: "done" });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Error Adding student" });
//   }
// });

router.get("/:cid/addStudent/:sid", async (req, res) => {
  const courseId = req.params.cid;
  const studentId = req.params.sid;
  try {
    const course = await courseModel.findById(courseId);
    console.log(course);
    if (course !== null) {
      let availableStudent = course.students.includes(studentId);
      console.log(availableStudent);
      if (!availableStudent) {
        course.students.push(studentId);
        course.numberOfStudents++; // Increment the number of students
        await course.save();

        // Save the course in the user's courses array
        const user = await userModel.findById(studentId);
        user.courses.push(courseId);
        await user.save();

        console.log("Student added to the course successfully.");
        // res.render("admin/courseInner");
      } else {
        console.log("Student already exists.");
      }
    } else {
      console.log("Course not found.");
    }
  } catch (err) {
    res.status(500).json({ error: true });
    console.log(err);
  }
});

router.get("/:id/courses", async (req, res) => {
  res.render("admin/courses", {
    user: await userModel.findById(req.params.id),
  });
});

router.get("/:id/settings", async (req, res) => {
  res.render("admin/settings", {
    user: await userModel.findById(req.params.id),
    dirname: __dirname,
  });
});

router.post("/:id/settings/updatedata", async (req, res) => {
  const userid = req.params.id;
  const { firstName, lastName, email, birthdayDate } = req.body;
  try {
    if (await userModel.findOne({ email, _id: { $ne: userid } }))
      return res.status(409).json({ errMsg: "Email is Taken" });
    userModel
      .findByIdAndUpdate(userid, { firstName, lastName, email, birthdayDate })
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

router.get("/:id/security", async (req, res) => {
  res.render("admin/security", {
    user: await userModel.findById(req.params.id),
  });
});

router.post("/:id/security/updatedata", async (req, res) => {
  const userid = req.params.id;
  const { currentPassword, password } = req.body;
  try {
    const user = await userModel.findById(userid);
    if (!(await bcrypt.compare(currentPassword, user.password)))
      return res.status(401).json({ errMsg: "Wrong current password" });

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    user.password = hashedPassword;
    user.save();
    return res.status(200).json({ msg: "done" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ err: true });
  }
});

router.get("/:id/notifications", async (req, res) => {
  res.render("admin/notifications", {
    user: await userModel.findById(req.params.id),
  });
});

router.get("/:id/users", async (req, res) => {
  const page = req.query.p || 0;
  const usersPerPage = 10;
  const searchQuery = req.query.q.toLowerCase();

  // Create a regular expression to perform case-insensitive search
  const regexQuery = new RegExp(searchQuery, "i");

  // Count the total number of matching users
  const usersLength = await userModel.countDocuments({
    $or: [
      { username: regexQuery },
      { email: regexQuery },
      { role: regexQuery },
    ],
  });

  // Retrieve the users based on the search query, skip and limit based on pagination
  let users = await userModel
    .find({
      $or: [
        { username: regexQuery },
        { email: regexQuery },
        { role: regexQuery },
      ],
    })
    .skip(page * usersPerPage)
    .limit(usersPerPage);

  res.render("admin/users", {
    user: await userModel.findById(req.params.id),
    users,
    usersLength,
    usersPerPage,
    searchQuery,
  });
});

export default router;
