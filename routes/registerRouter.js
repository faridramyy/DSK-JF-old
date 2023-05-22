import express from "express";
import {
  login_get,
  login_post,
  forgetPassword_get,
} from "../controllers/loginController.js";
import { signup_get, signup_post } from "../controllers/signupController.js";
const router = express.Router();

router.get("/signup", signup_get);
router.get("/login", login_get);
router.get("/forgetpassword", forgetPassword_get);

router.post("/signup/post", signup_post);
router.post("/login/post", login_post);

router.get("/logout", function (req, res, next) {
  req.session.user = null;
  req.session.save(function (err) {
    if (err) next(err);
    req.session.regenerate(function (err) {
      if (err) next(err);
      res.redirect("/login");
    });
  });
});

export default router;
