import express from "express";
const router = express.Router();

import dashboard from "../controllers/admin/dashboard.js";
import users from "../controllers/admin/users.js";
import courses from "../controllers/admin/courses.js";
import settings from "../controllers/admin/settings.js";
import security from "../controllers/admin/security.js";
import notifications from "../controllers/admin/notifications.js";

router.get("/:id", dashboard.dashboard_get);

router.get("/:id/users", users.users_get);
router.put("/users/ban/:id", users.banUser_put);
router.delete("/users/delete/:id", users.deleteUser_delete);

router.get("/:id/courses", courses.courses_get);
router.post("/courses", courses.course_post);
router.get("/:id/courses/:Cid", courses.innerCourse_get);
router.put("/:cid/addStudent/:sid", courses.addStudentToCourse_put);
router.put("/courses/:Cid/changeppcourse" , courses.changePPcourse_put);

router.get("/:id/settings", settings.setting_get);
router.put("/:id/settings/updatedata", settings.updateData_put);
router.put("/settings/changepp/:id", settings.changePP_put);

router.get("/:id/security", security.security_get);
router.put("/:id/security/updatedata", security.security_put);

router.get("/:id/notifications", notifications.notifications_get);

export default router;
