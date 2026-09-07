import { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/customError.js";
import { Prisma } from "../generated/prisma/client.js";

export const ErrorMiddleware = (
    err: any,
    req: Request,
    res: Response,
    _next: NextFunction
) => {
    let statusCode = err.statusCode || 500;
    let message = err.message || "Internal server error.";

    // 1. Invalid JSON body syntax
    if (
        err instanceof SyntaxError &&
        "status" in err &&
        err.status === 400 &&
        "body" in err
    ) {
        statusCode = 400;
        message = "Invalid JSON format in request body. Check quotes and commas.";
    }

    // 2. Prisma Known Request Errors
    else if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === "P2002") {
            const target = (err.meta?.target as string[]) || [];
            message = `Duplicate value entered for field: ${target.join(", ")}`;
            statusCode = 400;
        } else if (err.code === "P2025") {
            message = "Resource not found.";
            statusCode = 404;
        }
    }

    // 3. Prisma Validation Errors
    else if (err instanceof Prisma.PrismaClientValidationError) {
        message = "Invalid data format provided to database.";
        statusCode = 400;
    }

    // 4. Custom AppError
    else if (err instanceof AppError) {
        statusCode = err.statusCode;
        message = err.message;
    }

    if (statusCode === 500) {
        console.error("CRITICAL UNHANDLED ERROR:", err);
    }

    return res.status(statusCode).json({
        success: false,
        error: {
            statusCode,
            message,
        },
    });
};