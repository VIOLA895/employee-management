import express from "express";

import {
  getAttendance,
  checkIn,
  checkOut,
} from "../controllers/attendanceController.js";

import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(authenticate);

router.get("/", getAttendance);
router.post("/check-in", checkIn);
router.post("/check-out", checkOut);

export default router;