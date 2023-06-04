import express from "express";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";

import userModel from "../models/user.js";
import otpModel from "../models/otp.js";

import login from "../controllers/registration/login.js";
import signup from "../controllers/registration/signup.js";

const router = express.Router();

router.get("/login", login.login_get);
router.post("/login", login.login_post);


router.get("/signup",signup.signup_get );
router.post("/signup", signup.signup_post);

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
