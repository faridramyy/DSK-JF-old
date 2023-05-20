import express from "express";
import { login_get, login_post } from "../controllers/loginController.js";
import { signup_get, signup_post } from "../controllers/signupController.js";
const router = express.Router();

router.get("/login", login_get);
router.get("/signup", signup_get);

router.post("/login/post", login_post);
router.post("/signup/post", signup_post);

export default router;
