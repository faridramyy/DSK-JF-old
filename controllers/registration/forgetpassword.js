import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import userModel from "../../models/user.js";
import otpModel from "../../models/otp.js";

//function that takes an email as a parameter and sent to this email otp (one time password)
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

const forgetpassword_get = (req, res) =>
  res.render("registration/forgetpassword");

//check if the email is in the data base
const forgetpassword_post = async (req, res) => {
  const { email } = req.body;
  try {
    if (await userModel.findOne({ email }))
      res.status(200).json({ msg: "Email found" });
    else res.status(401).json({ errMsg: "Email not found" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ err: true });
  }
};

const resendCode_post = async (req, res) => {
  const { email } = req.body;
  sendCode(email);
};

const checkCode_post = async (req, res) => {
  const { email, otp } = req.body;
  try {
    const foundEmail = await otpModel.findOne({ email });
    if (foundEmail.otp == otp) return res.status(200).json({ msg: "verified" });
    return res.status(401).json({ errMsg: "Wrong code" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ err: true });
  }
};

const updatePassword_put = async (req, res) => {
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
};

export default {
  forgetpassword_get,
  forgetpassword_post,
  resendCode_post,
  checkCode_post,
  updatePassword_put,
};
