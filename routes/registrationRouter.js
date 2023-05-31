import express from "express";
import s from "../controllers/registration/signup.js";
import l from "../controllers/registration/login.js";
import f from "../controllers/registration/forgetpassword.js";
const router = express.Router();

router.get("/signup", s.signup_get);
router.post("/signup", s.signup_post);

router.get("/login", l.login_get);
router.post("/login", l.login_post);

router.get("/forgetpassword", f.forgetPassword_get);
router.post("/forgetpassword", f.forgetPassword_post);
router.post("/forgetpassword/sendcode", f.forgetPasswordSendCode_post);
router.post("/forgetpassword/checkcode", f.forgetPasswordCkeckCode_post);
router.put("/forgetpassword/updatepassword",f.forgetPasswordUpdatepassword_put);

router.get("/logout", function (req, res) {
  res.cookie("jwt", "", { maxAge: 1 });
  res.redirect("/login");
});

export default router;
