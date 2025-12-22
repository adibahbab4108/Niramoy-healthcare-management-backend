import express from "express";
import { ScheduleController } from "./schedule.controller";
import { UserRole } from "../../../../prisma/generated/prisma/enums";
import auth from "../../middlewares/auth";


const router = express.Router();

router.get(
    "/",
    auth(UserRole.DOCTOR, UserRole.DOCTOR),
    ScheduleController.schedulesForDoctor
)

router.post(
    "/",
    ScheduleController.insertIntoDB
)


router.delete(
    "/:id",
    ScheduleController.deleteScheduleFromDB
)
export const ScheduleRoutes = router;