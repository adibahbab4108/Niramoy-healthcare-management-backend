import bcrypt from "bcryptjs";
import { jwtHelper } from "../../helper/jwtHelper";
import { envVar } from "../../../config/env.config";
import { prisma } from "../../lib/prisma";
import { UserStatus } from "../../../../prisma/generated/prisma/enums";

const login = async (payload: { email: string; password: string }) => {
  const user = await prisma.user.findUniqueOrThrow({
    where: {
      email: payload.email,
      status: UserStatus.ACTIVE,
    },
  });

  const isCorrectPassword = await bcrypt.compare(
    payload.password,
    user.password
  );
  if (!isCorrectPassword) {
    throw new Error("Password is incorrect!");
  }

  const accessToken = jwtHelper.generateToken(
    { email: user.email, role: user.role },
    envVar.JWT_ACCESS_SECRET,
    envVar.JWT_ACCESS_EXPIRES_IN
  );

  const refreshToken = jwtHelper.generateToken(
    { email: user.email, role: user.role },
    envVar.JWT_REFRESH_SECRET,
    envVar.JWT_REFRESH_EXPIRES_IN
  );

  return {
    accessToken,
    refreshToken,
    needPasswordChange: user.needPasswordChange,
  };
};

export const AuthService = {
  login,
};
