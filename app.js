//Packages
import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
//Routes
import registrationRouter from "./routes/registration.js";
import adminRouter from "./routes/admin.js";
import studentRouter from "./routes/studentRouter.js";
import instructorRouter from "./routes/instructorRouter.js";
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
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.set("view engine", "ejs");

app.use(registrationRouter);
app.use("/admin", adminAuth, adminRouter);
app.use("/student", studentRouter);
app.use("/instructor", instructorRouter);

app.get("/gotbanned/:id", async (req, res) => {
  res.render("student/gotBanned", {
    user: await UserModel.findById(req.params.id),
  });
});

// Handle 404 (Not Found)
app.use((req, res) => {
  res.status(404).send("404");
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});

mongoose
  .connect(process.env.mongooDbUrl)
  .then(() => console.log("connected to Database"))
  .catch(() => console.log(`Couldn't connect to Database`));
