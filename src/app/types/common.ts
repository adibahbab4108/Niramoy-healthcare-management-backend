import { UserRole } from "../../../prisma/generated/prisma/enums";


export type IJWTPayload = {
    userId: string;
    email: string;
    role: UserRole;
}