import express from "express";
const router = express.Router();

router.get("/:id", (req ,res) =>{
    res.send("Welcome !!");
});

export default router;
