import { Router } from "express";
import { DoctorScheduleController } from "./doctorSchedule.controller";
import validateRequest from "../../middlewares/validateRequest";
import { DoctorScheduleValidation } from "./doctorSchedule.validation";
import auth from "../../middlewares/auth";
import { UserRole } from "../../../../prisma/generated/prisma/enums";

const router = Router()

router.post("/",
    auth(UserRole.DOCTOR),
    validateRequest(DoctorScheduleValidation.createDoctorScheduleValidationSchema)
    , DoctorScheduleController.insertIntoDB)

export const doctorScheduleRoutes = router