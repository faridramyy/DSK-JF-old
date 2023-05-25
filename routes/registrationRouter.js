import express from "express";
import { signup_get, signup_post } from "../controllers/registration/signup.js";
import { login_get, login_post } from "../controllers/registration/login.js";
import {
  forgetPassword_get,
  forgetPassword_post,
  forgetPasswordSendCode_post,
  forgetPasswordCkeckCode_post,
  forgetPasswordUpdatepassword_put,
} from "../controllers/registration/forgetpassword.js";
const router = express.Router();

router.get("/signup", signup_get);
router.post("/signup", signup_post);

router.get("/login", login_get);
router.post("/login", login_post);

router.get("/forgetpassword", forgetPassword_get);
router.post("/forgetpassword", forgetPassword_post);
router.post("/forgetpassword/sendcode", forgetPasswordSendCode_post);
router.post("/forgetpassword/checkcode", forgetPasswordCkeckCode_post);
router.put("/forgetpassword/updatepassword", forgetPasswordUpdatepassword_put);

router.get("/logout", function (req, res) {
  res.cookie("jwt", "", { maxAge: 1 });
  res.redirect("/login");
});

export default router;
