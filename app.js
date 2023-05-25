//Packages
import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
//Routes
import registrationRouter from "./routes/registrationRouter.js";
import adminRouter from "./routes/adminRouter.js";
import studentRouter from "./routes/studentRouter.js";
//Middlewares
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
app.use("/admin", adminRouter);
app.use("/student", studentRouter);

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
