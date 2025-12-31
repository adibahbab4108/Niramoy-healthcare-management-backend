import { NextFunction, Request, Response } from "express"
import httpStatus from "http-status"
import { Prisma } from "../../../prisma/generated/prisma/client";

const globalErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {

    let statusCode:number = httpStatus.INTERNAL_SERVER_ERROR;
    let success = false;
    let message = err.message || "Something went wrong!";
    let error = err;
    console.log(error)

    if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === 'P2002') {
            message = "Unique constraint violation (Duplicate key error)";
            error = err.meta; // e.g., { target: ['email'] };
            statusCode=httpStatus.CONFLICT
        } else if (err.code === 'P2003') {
            message = "Foreign key constraint violation";
            error = err.meta;
        } else if (err.code === 'P2025') {
            message = "An operation failed because a required record was not found";
            error = err.meta;
        } else if (err.code === 'P2000') {
            message = "The provided value is too long for the column's type";
        } else if (err.code === 'P2021') {
            message = "The table does not exist in the current database";
        } else if (err.code === 'P2022') {
            message = "The column does not exist in the current database";
        } else {
            message = `Prisma Request Error: ${err.code}`;
        }
    }
    else if (err instanceof Prisma.PrismaClientValidationError) {
        message = "Validation error";
        error = err.message
    } else if (err instanceof Prisma.PrismaClientUnknownRequestError) {
        message = "Unknown prisma error occured";
        error = err.message
    }

    res.status(statusCode).json({
        success,
        message,
        error
    })
};

export default globalErrorHandler;