import { Gender } from "@prisma/client";
import z from "zod";

const createPatientValidationSchema = z.object({
  password: z
    .string()
    .min(6, "Password must be at least 6 characters long")
    .optional(),
  patient: z.object({
    name: z.string().min(1).optional(),
    email: z.email("Invalid email address"),
    contactNumber: z.string().optional(),
    address: z.string().optional(),
    dateOfBirth: z.string().optional(),
    profilePhoto: z.url().optional(),
  }),
});
const createAdminValidationSchema = z.object({
  password: z
    .string()
    .min(6, "Password must be at least 6 characters long")
    .optional(),
  admin: z.object({
    name: z.string().min(1).optional(),
    email: z.email("Invalid email address"),
    contactNumber: z.string().optional(),
    address: z.string().optional(),
    dateOfBirth: z.string().optional(),
    profilePhoto: z.url().optional(),
  }),
});
const createDoctorValidationSchema = z.object({
  password: z.string("Password is required"),
  doctor: z.object({
    name: z.string("Name is required!"),
    email: z.string("Email is required!"),
    contactNumber: z.string("Contact Number is required!").optional(),
    address: z.string().optional(),
    registrationNumber: z.string("Reg number is required"),
    experience: z.number().optional(),
    gender: z.enum([Gender.MALE, Gender.FEMALE]),
    appointmentFee: z.number({
      error: "appointment fee is required",
    }),
    qualification: z.string({
      error: "quilification is required",
    }),
    currentWorkingPlace: z.string({
      error: "Current working place is required!",
    }),
    designation: z.string({
      error: "Designation is required!",
    }),
  }),
});

export const UserValidation = {
  createPatientValidationSchema,
  createAdminValidationSchema,
  createDoctorValidationSchema,
};
