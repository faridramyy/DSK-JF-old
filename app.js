import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import UserModel from "./models/user.js";
import bcrypt from "bcrypt";
dotenv.config();

const app = express();
const port = process.env.port;
//middlewares
app.use(express.static("public"));
app.use(express.json()); // parse request body to JSON
app.use(express.urlencoded({ extended: true })); // to read data from re.body

app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/login", (req, res) => {
  res.render("login");
});
app.get("/signup", (req, res) => {
  res.render("signup");
});

app.post("/login/post", async (req, res) => {
  const { username, password } = req.body;
  try {
    const found = await UserModel.findOne({ username });
    if (found) {
      if (await bcrypt.compare(password, found.password)) {
        res.send({ msg: "Logged in successfully" });
      } else res.send({ err: "Wrong password" });
    } else {
      res.send({ err: "Username not found" });
    }
  } catch (err) {
    res.send({ err: "Database error" });
    console.log(err);
  }
});

app.post("/signup/post", async (req, res) => {
  const { firstName, lastName, username, email, password } = req.body;
  try {
    if (await UserModel.findOne({ email })) {
      res.send({ err: "Email is Taken" });
    } else if (await UserModel.findOne({ username })) {
      res.send({ err: "Username is Taken" });
    } else {
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(password, salt);

      const newUser = new UserModel({
        role: "student",
        firstName,
        lastName,
        username,
        email,
        password: hashedPassword,
        gpa: 0,
      });
      newUser.save();

      res.send({ msg: "Student added" });
    }
  } catch (err) {
    res.send({ err: "Database error" });
    console.log(err);
  }
});

app.get("/home", (req, res) => {
  res.render("home");
});

mongoose.connect(process.env.mongooDbUrl).then(() => {
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
  });
});
