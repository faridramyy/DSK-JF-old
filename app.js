//Packages
import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
//Routes
import registrationRouter from "./routes/registrationRouter.js";
import adminRouter from "./routes/adminRouter.js";
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

app.get("/chat", (req, res) => {
  res.render("chat");
});

app.get("/error", (req, res) => {
  res.render("error");
});
// Handle 404 (Not Found)
app.use((req, res) => {
  res.status(404).send("404");
});

mongoose
  .connect(process.env.mongooDbUrl)
  .then(() => {
    app.listen(port, () => {
      console.log(
        `Example app listening on port ${port} and connected to Database`
      );
    });
  })
  .catch(() => console.log(`Couldn't connect to Database`));
