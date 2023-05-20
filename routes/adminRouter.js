import express from "express";
import UserModel from "../models/user.js";
import bcrypt from "bcrypt";

const router = express.Router();

router.get("/", (req, res) => {
  res.render("admin/admin");
});

router.get("/users", (req, res) => {
  res.render("admin/users");
});

router.post("/users", async (req, res) => {
  const {
    firstName,
    lastName,
    username,
    email,
    password,
    role = "student",
  } = req.body;
  try {
    if (await UserModel.findOne({ email })) {
      res.send({ err: "Email is Taken" });
    } else if (await UserModel.findOne({ username })) {
      res.send({ err: "Username is Taken" });
    } else {
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(password, salt);

      const newUser = new UserModel({
        role,
        firstName,
        lastName,
        username,
        email,
        password: hashedPassword,
        gpa: 0,
      });
      newUser.save();

      res.send({ msg: "done" });
    }
  } catch (err) {
    res.send({ err: "Database error" });
    console.log(err);
  }
});

router.get("/courses", (req, res) => {
  res.render("admin/courses");
});

router.post("/courses", async (req, res) => {
  const {
    Name,
      NumofStudents,
      Instructor,
      Description ,
      role = "course",
  } = req.body;
  try {
    if (await CourseModel.findOne({ Name })) {
     res.send({ err: "Course Already exists " });
} else {
      
       const newCourse = new CourseModel({
        role,
        Name,
      NumofStudents,
      Instructor,
      Description ,
      
      });
      newCourse.save();

      res.send({ msg: "done" });
    }
  } catch (err) {
    res.send({ err: "Database error" });
    console.log(err);
  }

});


export default router;
