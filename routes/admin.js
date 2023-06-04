import express from "express";
import userModel from "../models/user.js";
import courseModel from "../models/course.js";
import path from "path";
import bcrypt from "bcrypt";
const __dirname = path.resolve();
const router = express.Router();

import dashboard from "../controllers/admin/dashboard.js";
import users from "../controllers/admin/users.js";
import courses from "../controllers/admin/courses.js";

router.get("/:id", dashboard.dashboard_get);

router.get("/:id/users", users.users_get);
router.put("/users/ban/:id", users.banUser_put);
router.delete("/users/delete/:id", users.deleteUser_delete);

router.get("/:id/courses", courses.courses_get);
router.post("/courses", courses.course_post);
router.get("/:id/courses/:Cid", courses.innerCourse_get);
router.put("/:cid/addStudent/:sid", courses.addStudentToCourse_put);

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
