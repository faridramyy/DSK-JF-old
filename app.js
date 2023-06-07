//Packages
import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
//Routes
import registrationRouter from "./routes/registration.js";
import adminRouter from "./routes/admin.js";
import instructorRouter from "./routes/instructor.js";
import studnetRouter from "./routes/student.js";
import homeRouter from "./routes/home.js";
//Schema
import UserModel from "./models/user.js";
//Middlewares
import {
  adminAuth,
  instructorAuth,
  studentAuth,
} from "./middlewares/userAuth.js";
dotenv.config();
//Variables
const app = express();
const port = process.env.port;

//Middlewares
app.use(express.static("public")); // to read static files (css ,js ,img)
app.use(express.json()); // to read req.body
app.use(express.urlencoded({ extended: true })); // to read req.body
app.use(cookieParser()); // to read from cookies
app.set("view engine", "ejs"); // to set view engine to ejs
app.use(fileUpload()); // to help in uploading files

app.use(homeRouter);
app.use(registrationRouter);
app.use("/admin", adminAuth, adminRouter);
app.use("/instructor", instructorRouter);
app.use("/student", studentAuth, studnetRouter);

// api with mohamed fareed
app.post("/api", async (req, res) => {
  console.log("wsl");
  const { id } = req.body;
  try {
    if (await UserModel.findById(id)) res.json({ found: true });
    else res.json({ found: false });
  } catch (err) {
    res.json({ found: false });
  }
});

//Handle banned users
app.get("/gotbanned/:id", async (req, res) => {
  res.render("student/gotBanned", {
    user: await UserModel.findById(req.params.id),
  });
});

// Handle 404 (Not Found)
app.use((req, res) => {
  // res.status(404).send("404");
  res.render("404");;
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});

mongoose
  .connect(process.env.mongooDbUrl)
  .then(() => console.log("connected to Database"))
  .catch(() => console.log(`Couldn't connect to Database`));
