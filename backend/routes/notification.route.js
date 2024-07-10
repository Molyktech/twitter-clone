import express from "express";
import { protectRoute } from "../middleware/protectedRoute.js";
import {
  getAllNotifications,
  deleteNotifications,
  deleteNotification,
} from "../controllers/notification.controller.js";

const router = express.Router();

router.get("/", protectRoute, getAllNotifications);
router.delete("/", protectRoute, deleteNotifications);
router.delete("/:notificationId", protectRoute, deleteNotification);

export default router;
