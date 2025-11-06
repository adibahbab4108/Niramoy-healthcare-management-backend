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
export const userValidation = {
  createPatientValidationSchema,
};
