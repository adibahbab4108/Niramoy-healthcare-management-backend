import { UserRole } from "../../../prisma/generated/prisma/enums";

export type IJWTPayload = {
  email: string;
  role: UserRole;
};
