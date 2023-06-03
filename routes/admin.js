import express from "express";
import userModel from "../models/user.js";
import courseModel from "../models/course.js";
import path from "path";
import bcrypt from "bcrypt";
import { createPublicKey } from "crypto";
const __dirname = path.resolve();
const router = express.Router();

router.get("/:id", async (req, res) => {
  res.render("admin/dashboard", {
    user: await userModel.findById(req.params.id),
  });
});
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

router.get("/:id/courses/courseInner/:Cid", async (req, res) => {
  const courseId = req.params.Cid;
  let course = await courseModel.findById(courseId);
  let instructor = await userModel.findById(course.instructorId);
  res.render("admin/courseInner", {
    user: await userModel.findById(req.params.id),
    dirname: __dirname,
    course,
    instructor , 
  });
});

router.get("/:id/users", async (req, res) => {
  const page = req.query.p || 0;
  const usersPerPage = 10;
  let userss = await userModel.find();
  const usersLength = userss.length;

  let users = await userModel
    .find()
    .skip(page * usersPerPage)
    .limit(usersPerPage);

  res.render("admin/users", {
    user: await userModel.findById(req.params.id),
    users,
    usersLength,
    usersPerPage,
  });
});

router.put("/users/ban/:id", async (req, res) => {
  const userID = req.params.id;
  await userModel
    .findById(userID)
    .then((user) => {
      user.isBanned = !user.isBanned; // Toggle the value of isBanned
      user.save();
      res.json({ msg: "done" });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.delete("/users/delete/:id", async (req, res) => {
  await userModel
    .findByIdAndDelete(req.params.id)
    .then(() => {
      res.json({ msg: "done" });
    })
    .catch((err) => {
      console.log(err);
    });
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

export default router;
