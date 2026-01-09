import { Router } from "express";
import { ScheduleController } from "./schedule.controller";

const router = Router();
router.post("/", ScheduleController.insertSchedule);

export const scheduleRoutes = router;
