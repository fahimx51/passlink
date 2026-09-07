import { z } from "zod";

export const createPasteSchema = z.object({
    title: z
        .string("title must be a string")
        .min(1, "title is required"),

    content: z
        .string("content must be a string")
        .min(1, "content is required"),

    ttl: z
        .number("ttl must be a number, not a string")
        .min(1, "ttl must be at least 1 day")
        .max(15, "ttl must be at most 15 days"),

    password: z
        .string()
        .min(4, "Password must be at least 4 characters long.")
        .optional(),

    slug: z
        .string()
        .regex(
            /^[a-zA-Z0-9_-]+$/,
            "Custom URL slug can only contain letters, numbers, hyphens, and underscores."
        )
        .optional(),
    maxViews: z
        .number("maxViews must be a number, not a string")
        .positive("maxViews must be greater than 0")
        .optional(),
});

export const updatePasteSchema = z.object({
    title: z
        .string("title must be a string")
        .min(1, "title cannot be empty")
        .optional(),

    content: z
        .string("content must be a string")
        .min(1, "content cannot be empty")
        .optional(),

    newSlug: z
        .string()
        .regex(
            /^[a-zA-Z0-9_-]+$/,
            "Custom URL slug can only contain letters, numbers, hyphens, and underscores."
        )
        .optional(),

    extendTtl: z
        .number("extendTtl must be a number, not a string")
        .int("extendTtl must be an integer")
        .min(1, "extendTtl must be at least 1 day")
        .max(30, "extendTtl cannot exceed 30 days")
        .optional(),

    maxViews: z
        .number("maxViews must be a number, not a string")
        .int("maxViews must be an integer")
        .positive("maxViews must be greater than 0")
        .nullable()
        .optional(),

    password: z
        .string("password must be a string")
        .optional(),

    currentPassword: z
        .string("currentPassword must be a string")
        .optional(),
});

// Inferred TypeScript Types
export type CreatePasteInput = z.infer<typeof createPasteSchema>;
export type UpdatePasteInput = z.infer<typeof updatePasteSchema>;