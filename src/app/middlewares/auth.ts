import { NextFunction, Request, Response } from "express";
import { jwtHelper } from "../helper/jwtHelper";
import { envVar } from "../../config/env.config";

const auth = (...roles: string[]) => {
  return async (
    req: Request & { user?: any },
    res: Response,
    next: NextFunction
  ) => {
    try {
      //  const token = req.headers.authorization?.split(" ")[1];
      const token = req.cookies.accessToken;
      if (!token) {
        throw new Error("Authentication token missing");
      }
      const verifyToken = jwtHelper.verifyToken(
        token,
        envVar.JWT_ACCESS_SECRET
      );
      req.user = verifyToken;
      if (roles.length && !roles.includes(verifyToken.role)) {
        throw new Error("You are not authorized to access this route");
      }
      next();
    } catch (error) {
      next(error);
    }
  };
};

export default auth;
