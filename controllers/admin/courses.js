import userModel from "../../models/user.js";
import courseModel from "../../models/course.js";
import path from "path";
const __dirname = path.resolve();

const courses_get = async (req, res) => {
  try {
    let instructors = await userModel.find({ role: "Instructor" });
    const page = req.query.p || 0;
    const coursesPerPage = 8;
    const coursesLength = await courseModel.count();

    const course = await courseModel
      .find()
      .skip(page * coursesPerPage)
      .limit(coursesPerPage);

    res.render("admin/courses", {
      user: await userModel.findById(req.params.id),
      dirname: __dirname,
      instructors,
      course,
      coursesLength,
      coursesPerPage,
    });
  } catch (err) {
    console.log(err);
    res.render("error");
  }
};

const course_post = async (req, res) => {
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
    console.log(err);
    res.status(500).json({ err: true });
  }
};

const innerCourse_get = async (req, res) => {
  const courseId = req.params.Cid;
  try {
    const course = await courseModel.findById(courseId).populate()  ;

    const Arrayofstudents = course.students;

    const instructor = await userModel.findById(course.instructorId);
    const students = await userModel.find({ role: "student" });
    res.render("admin/courseInner", {
      user: await userModel.findById(req.params.id),
      dirname: __dirname,
      course,
      instructor,
      students,
      Arrayofstudents,
      students,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ err: true });
  }
};

const addStudentToCourse_put = async (req, res) => {
  const courseId = req.params.cid;
  const studentId = req.params.sid;

  try {
    const course = await courseModel.findById(courseId);

    course.students.push(studentId);
    course.numberOfStudents++;
    course.save();

    // Save the course in the user's courses array
    const user = await userModel.findById(studentId);
    user.courses.push(courseId);
    user.save();
    res.json({ msg: "done" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: true });
  }
};

const changePPcourse_put = async (req, res) => {
  console.log("farid");
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
          const id = req.params.Cid;
          await courseModel.findByIdAndUpdate(id, {
            coverPic: `/upload/images/${filename}`,
          });
          console.log(filePath);
          console.log("Cover photo updated successfully.");
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
};

export default {
  courses_get,
  course_post,
  innerCourse_get,
  addStudentToCourse_put,
  changePPcourse_put,
};
