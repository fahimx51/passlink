import { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/customError";
import { Prisma } from "../../src/generated/prisma/client";

export const ErrorMiddleware = (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    let statusCode = err.statusCode || 500;
    let message = err.message || "Internal Server Error";

    // 1. Prisma Known Request Errors
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
        // P2002: Unique constraint failed (e.g. duplicate slug or email)
        if (err.code === "P2002") {
            const target = (err.meta?.target as string[]) || [];
            message = `Duplicate value entered for field: ${target.join(", ")}`;
            statusCode = 400;
        }

        // P2025: Record to update/delete not found
        if (err.code === "P2025") {
            message = "Resource not found";
            statusCode = 404;
        }
    }

    // 2. Prisma Initialization / Validation Errors
    if (err instanceof Prisma.PrismaClientValidationError) {
        message = "Invalid data format provided to database";
        statusCode = 400;
    }

    // 3. Wrong JWT Error
    if (err.name === "JsonWebTokenError") {
        message = "JSON Web Token is invalid. Try again!";
        statusCode = 400;
    }

    // 4. JWT Expired Error
    if (err.name === "TokenExpiredError") {
        message = "JSON Web Token is expired. Try again!";
        statusCode = 400;
    }

    // 5. AppError Instances
    if (err instanceof AppError) {
        statusCode = err.statusCode;
        message = err.message;
    }

    // Log unhandled 500 internal errors for debugging
    if (statusCode === 500) {
        console.error("CRITICAL UNHANDLED ERROR:", err);
    }

    return res.status(statusCode).json({
        success: false,
        message,
        ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
    });
};