import express from "express";
import userModel from "../models/user.js";
const router = express.Router();
import path from "path";
const __dirname = path.resolve();

router.get("/:id", async (req, res) => {
  res.render("admin/dashboard", {
    user: await userModel.findById(req.params.id),
  });
});

router.get("/:id/users", async (req, res) => {
  res.render("admin/users", {
    user: await userModel.findById(req.params.id),
  });
});

router.get("/:id/courses", async (req, res) => {
  res.render("admin/courses", {
    user: await userModel.findById(req.params.id),
  });
});

router.get("/:id/settings", async (req, res) => {
  res.render("admin/settings", {
    user: await userModel.findById(req.params.id),
    dirname: __dirname,
  });
});

router.post("/:id/settings/updatedata", async (req, res) => {
  const userid = req.params.id;
  const { firstName, lastName, email, birthdayDate } = req.body;
  try {
    if (await userModel.findOne({ email, _id: { $ne: userid } }))
      return res.status(409).json({ errMsg: "Email is Taken" });
    userModel
      .findByIdAndUpdate(userid, { firstName, lastName, email, birthdayDate })
      .then(() => {
        return res.status(200).json({ msg: "done" });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({ err: true });
      });
  } catch (err) {
    console.log(err);
    res.status(500).json({ err: true });
  }
});

router.post("/settings/changepp/:id", async (req, res) => {
  if (req.files) {
    const file = req.files.file;
    const filename = file.name;
    const filePath = `${__dirname}/public/upload/images/${filename}`;

    file.mv(filePath, async (err) => {
      if (err) {
        console.log(err);
        res.status(500).json({ err: true });
      } else {
        try {
          const id = req.params.id;
          await userModel.findByIdAndUpdate(id, {
            profilePic: `/upload/images/${filename}`,
          });
          console.log("Profile picture updated successfully.");
          res.json({ msg: "done" });
        } catch (err) {
          console.log(err);
          res.status(500).json({ err: true });
        }
      }
    });
  } else {
    console.log("No file received.");
    res.status(400).json({ err: true });
  }
});

router.get("/:id/security", async (req, res) => {
  res.render("admin/security", {
    user: await userModel.findById(req.params.id),
  });
});

router.get("/:id/notifications", async (req, res) => {
  res.render("admin/notifications", {
    user: await userModel.findById(req.params.id),
  });
});

export default router;
