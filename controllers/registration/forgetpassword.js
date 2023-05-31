//Packages
import nodemailer from "nodemailer";
import bcrypt from "bcrypt";
//Shcema
import UserModel from "../../models/user.js";
import otpModel from "../../models/otp.js";
// --------------------------------------------\\

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
          .catch((err) => console.log(err));
      }
    });
  } catch (err) {
    console.log(err);
  }
}

const forgetPassword_get = (req, res) => {
  res.render("registration/forgetpassword");
};

const forgetPassword_post = async (req, res) => {
  const { email } = req.body;
  try {
    const founduser = await UserModel.findOne({ email });
    if (founduser) return res.status(200).json({ Msg: "Email found" });
    else return res.status(401).json({ errMsg: "Email not found" });
  } catch (err) {
    console.log(err);
  }
};

const forgetPasswordSendCode_post = async (req, res) => {
  const { email } = req.body;
  sendCode(email);
};

const forgetPasswordCkeckCode_post = async (req, res) => {
  const { email, otp } = req.body;
  try {
    const foundEmail = await otpModel.findOne({ email });
    if (foundEmail.otp == otp) return res.status(200).json({ msg: "verified" });
    return res.status(401).json({ errMsg: "Wrong code" });
  } catch (err) {
    console.log(err);
  }
};

const forgetPasswordUpdatepassword_put = async (req, res) => {
  const { email, password } = req.body;

  const salt = await bcrypt.genSalt();
  const hashedPassword = await bcrypt.hash(password, salt);

  UserModel.findOneAndUpdate({ email }, { password: hashedPassword })
    .then(() => {
      otpModel
        .findOneAndDelete({ email })
        .then(() => {
          res.status(200).json({ msg: "done" });
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => {
      console.error(err);
    });
};

export default {
  forgetPassword_get,
  forgetPassword_post,
  forgetPasswordSendCode_post,
  forgetPasswordCkeckCode_post,
  forgetPasswordUpdatepassword_put,
};
