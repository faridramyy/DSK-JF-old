import userModel from "../../models/user.js"; 
import courseModel from "../../models/course.js"; 

export const courses_get = async (req, res) => {
  let instructors = await userModel.find({ role: "Instructor" });
  res.render("admin/courses", { instructors });
};

export const courses_post = async (req, res) => {
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
    res.send({ err: "Database error" });
    console.log(err);
  }
};
