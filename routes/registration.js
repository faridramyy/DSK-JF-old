import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

import userModel from "../models/user.js";
import otpModel from "../models/otp.js";

const router = express.Router();

router.get("/login", (req, res) => {
  const notAllowed = req.query.notAllowed || false;
  res.render("registration/login", { notAllowed });
});

router.post("/login", async (req, res) => {
  const { username, Password } = req.body;

  try {
    const founduser = await userModel.findOne({ username });

    if (!founduser)
      return res.status(401).json({ errMsg: "Username not found" });

    if (!(await bcrypt.compare(Password, founduser.password)))
      return res.status(401).json({ errMsg: "Wrong password" });

    const token = jwt.sign({ user: founduser }, process.env.jwtSecretPhrase, {
      expiresIn: 3 * 24 * 60 * 60, //3 days
    });

    res.cookie("jwt", token, {
      httpOnly: true,
      maxAge: 3 * 24 * 60 * 60 * 1000, //3 days
    });

    return res.status(200).json({ user: founduser });
  } catch (err) {
    console.log(err);
    res.status(500).json({ err: true });
  }
});

router.get("/signup", (req, res) => res.render("registration/signup"));

router.post("/signup", async (req, res) => {
  const {
    role,
    firstName,
    lastName,
    username,
    email,
    password,
    gpa,
    createdByAdmin = 0,
  } = req.body;

  try {
    if (await userModel.findOne({ email }))
      return res.status(409).json({ errMsg: "Email is Taken" });

    if (await userModel.findOne({ username }))
      return res.status(409).json({ errMsg: "Usernmae is Taken" });

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new userModel({
      role,
      firstName,
      lastName,
      username,
      email,
      password: hashedPassword,
      gpa,
    });

    newUser.save();

    if (!createdByAdmin) {
      const token = jwt.sign({ user: newUser }, process.env.jwtSecretPhrase, {
        expiresIn: 3 * 24 * 60 * 60, //3 days
      });

      res.cookie("jwt", token, {
        httpOnly: true,
        maxAge: 3 * 24 * 60 * 60 * 1000, //3 days
      });
    }

    res.status(201).json({ user: newUser }); //code 201 for created success
  } catch (err) {
    console.log(err);
    res.status(500).json({ err: true });
  }
});

router.get("/forgetpassword", (req, res) =>
  res.render("registration/forgetpassword")
);

router.post("/forgetpassword", async (req, res) => {
  const { email } = req.body;
  try {
    if (await userModel.findOne({ email }))
      return res.status(200).json({ msg: "Email found" });
    else return res.status(401).json({ errMsg: "Email not found" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ err: true });
  }
});

async function sendCode(email) {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.email,
        pass: process.env.paasword,
      },
    });

    let randomNumber = Math.floor(100000 + Math.random() * 900000);

    const mailOptions = {
      from: process.env.email,
      to: email,
      subject: "DSK-JF recovery code",
      text: `Your security code is ${randomNumber}`,
    };

    transporter.sendMail(mailOptions, async (error, info) => {
      if (error) console.error(error);
      else {
        const newotp = new otpModel({
          email,
          otp: randomNumber,
        });

        if (await otpModel.findOne({ email }))
          await otpModel.deleteOne({ email });

        newotp
          .save()
          .then(() => console.log("Email sent: " + info.response))
          .catch((err) => {
            console.log(err);
            location.assign("/error");
          });
      }
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ err: true });
  }
}

router.post("/forgetpassword/sendcode", async (req, res) => {
  const { email } = req.body;
  sendCode(email);
});

router.post("/forgetpassword/checkcode", async (req, res) => {
  const { email, otp } = req.body;
  try {
    const foundEmail = await otpModel.findOne({ email });
    if (foundEmail.otp == otp) return res.status(200).json({ msg: "verified" });
    return res.status(401).json({ errMsg: "Wrong code" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ err: true });
  }
});

router.put("/forgetpassword/update", async (req, res) => {
  const { email, password } = req.body;

  const salt = await bcrypt.genSalt();
  const hashedPassword = await bcrypt.hash(password, salt);

  userModel
    .findOneAndUpdate({ email }, { password: hashedPassword })
    .then(() => {
      otpModel
        .findOneAndDelete({ email })
        .then(() => {
          res.status(200).json({ msg: "done" });
        })
        .catch((err) => {
          console.log(err);
          res.status(500).json({ err: true });
        });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ err: true });
    });
});

router.get("/logout", function (req, res) {
  res.cookie("jwt", "", { maxAge: 1 });
  res.redirect("/login");
});

export default router;
