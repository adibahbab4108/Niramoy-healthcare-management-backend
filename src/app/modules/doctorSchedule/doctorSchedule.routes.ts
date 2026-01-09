import { Router } from "express";
import auth from "../../middlewares/auth";
import { UserRole } from "../../../../prisma/generated/prisma/enums";
import { DoctorScheduleController } from "./doctorSchedule.controller";

const router = Router();

router.post("/", auth(UserRole.DOCTOR), DoctorScheduleController.insertIntoDB);

export const doctorScheduleRoutes = router;

// const router = express.Router();
// router.get(
//     '/',
//     auth(UserRole.ADMIN, UserRole.DOCTOR, UserRole.PATIENT),
//     DoctorScheduleController.getAllFromDB
// );

// router.get(
//     '/my-schedule',
//     auth(UserRole.DOCTOR),
//     DoctorScheduleController.getMySchedule
// )

// router.post(
//     "/",
//     auth(UserRole.DOCTOR),
//     validateRequest(DoctorScheduleValidation.createDoctorScheduleValidationSchema),
//     DoctorScheduleController.insertIntoDB
// )

// router.delete(
//     '/:id',
//     auth(UserRole.DOCTOR),
//     DoctorScheduleController.deleteFromDB
// );


// export const doctorScheduleRoutes = router;