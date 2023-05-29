import express from "express";
import {
  dashboard_get,
  dashboard_post,
} from "../controllers/admin/dashboard.js";
import {
  users_get,
  users_ban_put,
  users_delete,
} from "../controllers/admin/users.js";
import { courses_get, courses_post } from "../controllers/admin/courses.js";
import { settings_get, settings_post } from "../controllers/admin/settings.js";
import { security_get } from "../controllers/admin/security.js";
import { notifications_get } from "../controllers/admin/notifications.js";
const router = express.Router();

router.get("/", dashboard_get);
router.post("/", dashboard_post);

router.get("/users", users_get);
router.put("/users/ban/:id", users_ban_put);
router.delete("/users/delete/:id", users_delete);

router.get("/courses", courses_get);
router.post("/courses", courses_post);

router.get("/settings", settings_get);
router.post("/settings", settings_post);

router.get("/security", security_get);

router.get("/notifications", notifications_get);

export default router;
