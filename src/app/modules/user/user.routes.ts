import { Router } from "express";
import { UserController } from "./user.controller";
import { fileUploader } from "../../helper/fileUploader";
import { userValidation } from "./user.validation";

const router = Router();
router.post(
  "/create-patient",
  fileUploader.upload.single("file"),
  (req, res, next) => {
    req.body = userValidation.createPatientValidationSchema.parse(
      JSON.parse(req.body.data)
    );
    return UserController.createPatient(req, res, next);
  }
);
export const userRoutes = router;
