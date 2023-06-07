import express from "express";

import login from "../controllers/registration/login.js";
import signup from "../controllers/registration/signup.js";
import forgetpassword from "../controllers/registration/forgetpassword.js";

const router = express.Router();

router.get("/login", login.login_get);
router.post("/login", login.login_post);

router.get("/signup", signup.signup_get);
router.post("/signup", signup.signup_post);

router.get("/forgetpassword", forgetpassword.forgetpassword_get);
router.post("/forgetpassword", forgetpassword.forgetpassword_post);
router.post("/forgetpassword/sendcode", forgetpassword.resendCode_post);
router.post("/forgetpassword/checkcode", forgetpassword.checkCode_post);
router.put("/forgetpassword/update", forgetpassword.updatePassword_put);

router.get("/logout", (req, res) => {
  res.cookie("jwt", "", { maxAge: 1 });
  res.redirect("/login");
});

export default router;


