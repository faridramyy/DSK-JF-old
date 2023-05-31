import express from "express";
import d from "../controllers/admin/dashboard.js";
import u from "../controllers/admin/users.js";
import c from "../controllers/admin/courses.js";
import settings from "../controllers/admin/settings.js";
import security from "../controllers/admin/security.js";
import n from "../controllers/admin/notifications.js";
const router = express.Router();

router.get("/", d.dashboard_get);
router.post("/", d.dashboard_post);

router.get("/users", u.users_get);
router.put("/users/ban/:id", u.users_ban_put);
router.delete("/users/delete/:id", u.users_delete);

router.get("/courses", c.courses_get);
router.post("/courses", c.courses_post);

router.get("/settings", settings.settings_get);
router.put("/changeimage", settings.changeImage_put);
router.post("/checkemail", settings.checkemail_post);
router.put("/settings", settings.settings_put);

router.get("/security", security.security_get);

router.get("/notifications", n.notifications_get);

export default router;
