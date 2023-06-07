import express from "express";
const router = express.Router();

router.get("/", (req, res) => res.render("home/home"));

router.get("/about", (req, res) => res.render("home/about"));

router.get("/courses", (req, res) => res.render("home/courses"));

router.get("/contact", (req, res) => res.render("home/contact"));

export default router;
