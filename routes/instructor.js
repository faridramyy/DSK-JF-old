import express from "express";
import userModel from "../models/user.js";
import courseModel from "../models/course.js";
import courseLinkModel from "../models/courseLink.js";
import courseFileModel from "../models/courseFile.js";
import bcrypt from "bcrypt";
import courseSubmissionModel from "../models/courseSubmission.js";
import courseProjectModel from "../models/courseProject.js";
import path from "path";
const __dirname = path.resolve();
const router = express.Router();

router.get("/:id", async (req, res) => {
  try {
    const instructorId = req.params.id;
    const page = req.query.p || 0;
    const coursesPerPage = 3;
    let coursess = await courseModel.find({
      instructorId: instructorId,
      availableForUsers: true,
    });

    const coursesLength = coursess.length;

    const courses = await courseModel
      .find({
        instructorId: instructorId,
        availableForUsers: true,
      })
      .skip(page * coursesPerPage)
      .limit(coursesPerPage);

    res.render("instructor/home", {
      user: await userModel.findById(instructorId),
      courses,
      coursesLength,
      coursesPerPage,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ err: true });
  }
});


router.get("/:id/settings", async (req, res) => {
  try {
    const instructorId = req.params.id;
    const courses = await courseModel.find({
      instructorId,
      availableForUsers: true,
    });

    res.render("instructor/settings", {
      user: await userModel.findById(instructorId),
      courses,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ err: true });
  }
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
  try {
    const instructorId = req.params.id;
    const courses = await courseModel.find({
      instructorId,
      availableForUsers: true,
    });

    res.render("instructor/security", {
      user: await userModel.findById(instructorId),
      courses,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ err: true });
  }
});

router.post("/:id/security/updatedata", async (req, res) => {
  const instrucID = req.params.id;
  const { currentPassword, password } = req.body;
  try {
    const user = await userModel.findById(instrucID);
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

// get inner-courses
router.get("/:Iid/:Cid", async (req, res) => {
  try {
    const instructorId = req.params.Iid;
    const courseId = req.params.Cid;

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

    res.render("instructor/inner-course", {
      user: await userModel.findById(instructorId),
      course: await courseModel.findById(courseId),
      projects,
      links,
      submissions,
      files,
    });
  } catch (error) {
    console.log(error);
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
// add link
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
// delete link
router.delete("/:cid/deleteLink/:lid", async (req, res) => {
  const linkId = req.params.lid;
  try {
    // Delete link from courseLinkModel
    await courseLinkModel.findByIdAndDelete(linkId);

    // Remove linkId from links array in courseModel
    await courseModel.findByIdAndUpdate(req.params.cid, {
      $pull: { links: linkId },
    });

    res.json({ msg: "done" });
  } catch (err) {
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

// delete file
router.delete("/:cid/deleteFile/:fid", async (req, res) => {
  const fileId = req.params.fid;
  try {
    // Delete link from courseLinkModel
    await courseFileModel.findByIdAndDelete(fileId);

    // Remove linkId from links array in courseModel
    await courseModel.findByIdAndUpdate(req.params.cid, {
      $pull: { files: fileId },
    });
    res.json({ msg: "done" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ err: true });
  }
});

router.post("/addFile/:id", async (req, res) => {
  if (req.files) {
    const file = req.files.file;
    const filename = file.name;
    const filePath = `${__dirname}/public/upload/files/${filename}`;

    file.mv(filePath, async (err) => {
      if (err) {
        console.log(err);
        res.status(500).json({ err: true });
      } else {
        try {
          const newFile = new courseFileModel({
            filePath: `/upload/images/${filename}`,
          });
          newFile.save();

          const course = await courseModel.findById(req.params.id);
          course.files.push(newFile._id);
          course.save();

          console.log("file updated successfully.");
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

router.post("/addSubmission", async (req, res) => {
  const { title, deadLine, description, courseID } = req.body;
  try {
    const newcourseSubmission = new courseSubmissionModel({
      title,
      deadLine,
      description,
    });
    newcourseSubmission.save();

    const course = await courseModel.findById(courseID);
    course.submissions.push(newcourseSubmission._id);
    course.save();

    res.status(200).json({ msg: "done" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ err: true });
  }
});
// delete file
router.delete("/:cid/deleteSubmission/:sid", async (req, res) => {
  const submissionId = req.params.sid;
  try {
    // Delete link from courseLinkModel
    await courseSubmissionModel.findByIdAndDelete(submissionId);

    // Remove linkId from links array in courseModel
    await courseModel.findByIdAndUpdate(req.params.cid, {
      $pull: { submissions: submissionId },
    });
    res.json({ msg: "done" });
  } catch (err) {
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
// post project page
router.post("/addProject", async (req, res) => {
  const courseId = req.params.cid;
  const {
    title,
    description,
    numberOfStudentsPerTeam,
    deadline,
    numberOfPhases,
    courseID,
  } = req.body;

  try {
    if (await courseProjectModel.findOne({ courseId }))
      return res
        .status(409)
        .json({ errMsg: "You can't add another project in this course" });
    //code 409 for conflict
    const newProject = new courseProjectModel({
      title,
      deadline,
      courseId,
      description,
      numberOfStudentsPerTeam,
      deadline,
      numberOfPhases,
    });

    newProject.save();

    const course = await courseModel.findById(courseID);
    course.projects.push(newProject._id);
    course.save();

    res.status(200).json({ msg: "done" });
  } catch (err) {
    res.status(500).json({ err: true });
    console.log(err);
  }
});
// delete Project
router.delete("/:cid/deleteProject/:pid", async (req, res) => {
  const projectId = req.params.pid;
  try {
    // Delete link from courseLinkModel
    await courseProjectModel.findByIdAndDelete(projectId);

    // Remove linkId from links array in courseModel
    await courseModel.findByIdAndUpdate(req.params.cid, {
      $pull: { projects: projectId },
    });
    res.json({ msg: "done" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ err: true });
  }
});

router.get("/:id/settings", async (req, res) => {
  res.render("instructor/settings", {
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
  res.render("instructor/security", {
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
  res.render("instructor/notifications", {
    user: await userModel.findById(req.params.id),
  });
});

router.get("/:id/:cid/viewall", async (req, res) => {
  const courseId = req.params.cid;
  const page = req.query.p || 0;
  const studentsPerPage = 5;

  try {
    const course = await courseModel.findById(courseId).populate("students");
    const studentslength = course.students.length;
    const students = course.students.slice(
      page * studentsPerPage,
      page * studentsPerPage + studentsPerPage
    );

    res.render("instructor/viewAll", {
      user: await userModel.findById(req.params.id),
      course: await courseModel.findById(courseId),
      students,
      studentsPerPage,
      studentslength,
    });
  } catch (err) {
    res.status(500).json({ error: true });
    console.log(err);
  }
});



export default router;
