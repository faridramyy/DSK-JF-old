import express from "express";
const router = express.Router();

router.get("/",(req,res)=>{
    res.render("admin/dashboard")
})
router.get("/users",(req,res)=>{
    res.render("admin/users")
})
router.get("/courses",(req,res)=>{
    res.render("admin/courses")
})
router.get("/settings",(req,res)=>{
    res.render("admin/settings")
})

router.get("/", (req, res) => {
  res.render("admin/dashboard")
})
router.get("/users",(req,res)=>{
  res.render("admin/users")
})
router.get("/courses",(req,res)=>{
  res.render("admin/courses")
})
router.get("/settings", (req, res) => {
  res.render("admin/settings")
});

export default router

