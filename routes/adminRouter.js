import express from "express";
import userModel from "../models/user.js";
const router = express.Router();

router.get("/", (req, res) => {
  res.render("admin/dashboard");
});
router.get("/users", async (req, res) => {
  const page = req.query.p || 0;
  const usersPerPage = 3;

  let userss = await userModel.find();
  const usersLength = userss.length;
  let users = await userModel
    .find()
    .skip(page * usersPerPage)
    .limit(usersPerPage);
  res.render("admin/users", { users, usersLength, usersPerPage });
});

// filter by role

// router.get("/users/:role ", async (req, res) => {
//   const role = req.params.role;
//   const filter = { role: role };

//   let usersFilter = await userModel.find(filter);

//   res.render("admin/users", { usersFilter });
// });

router.get("/courses", (req, res) => {
  res.render("admin/courses");
});
router.get("/settings", (req, res) => {
  res.render("admin/settings");
});
router.get("/security", (req, res) => {
  res.render("admin/security");
});
router.get("/notifications", (req, res) => {
  res.render("admin/notifications");
});

router.get("/delete/:id", async (req, res) => {
  await userModel
    .findByIdAndDelete(req.params.id)
    .then(() => {
      res.redirect("/admin/users");
    })
    .catch((err) => {
      console.log(err);
    });
});
router.get("/ban/:id", async (req, res) => {
  const userID = req.params.id;
  await userModel
    .findByIdAndUpdate(userID, { isBanned: "true" })
    .then(() => {
      console.log("Banned");
      res.redirect("/admin/users");
    })
    .catch((err) => {
      console.log(err);
    });
});

// return Day.findOneAndUpdate(
//   { _id: day.id },
//   [
//     { $set: { present: { $not: "$present" } } }
//   ]
// );

export default router;
