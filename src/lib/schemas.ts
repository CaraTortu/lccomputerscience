import { z } from "zod";

/**
 * This file contains shared schemas across the client and server
 * This is useful in form validation
 */

/**
 * Schema for password verification of requirements
 * - It must be at least 8 characters long
 * - It must contain at least one number
 * - It must contain at least one uppercase letter
 * - It must contain at least one lowercase letter
 */
export const passwordVerificationSchema = z
    .string()
    .min(1, "Password is required")
    .superRefine((data, ctx) => {
        // Check length
        if (data.length < 8) {
            ctx.addIssue({
                code: "custom",
                message: "Password must be at least 8 characters",
            });
        }

        // Check numbers
        if (!/[0-9]/.test(data)) {
            ctx.addIssue({
                code: "custom",
                message: "Password must contain at least one number",
            });
        }

        // Check uppercase letters
        if (!/[A-Z]/.test(data)) {
            ctx.addIssue({
                code: "custom",
                message: "Password must contain at least one uppercase letter",
            });
        }

        // Check lowercase letters
        if (!/[a-z]/.test(data)) {
            ctx.addIssue({
                code: "custom",
                message: "Password must contain at least one lowercase letter",
            });
        }
    });

/**
 * Schema for user registration form validation
 * - Contains an email, name and password
 */
export const registrationSchema = z.object({
    email: z.string().email("Invalid email address"),
    name: z.string().min(1, "Name is required").max(50, "Name is too long"),
    password: passwordVerificationSchema,
});

/**
 * Schema for contact form validation
 * - Contains a name, email and message
 */
export const contactSchema = z.object({
    name: z.string().min(1, "Name is required").max(50, "Name is too long"),
    email: z.string().email("Invalid email address"),
    message: z
        .string()
        .min(1, "Message is required")
        .max(500, "Message is too long"),
});

/**
 * Schema for creating courses
 * - Contains a name, description, status and image
 */
export const createCourseSchema = z.object({
    name: z.string().nonempty("Name is required"),
    description: z
        .string()
        .nonempty("Description is required")
        .max(200, "Description must be less than 200 characters"),
    image: z.string().url("Image URL is invalid"),
    status: z.enum(["active", "archived", "disabled", "draft"]),
});

/**
 * Schema for Editing courses
 * - Contains an id, name, description, status and image
 */
export const updateCourseSchema = createCourseSchema.extend({
    id: z.string().uuid("Invalid course ID"),
});

/**
 * Base schema for creating modules
 */
const baseModuleSchema = z.object({
    name: z.string().nonempty("Name is required"),
    description: z
        .string()
        .nonempty("Description is required")
        .max(200, "Description must be less than 200 characters"),
});

/**
 * Schema for creating modules
 */
export const createModuleSchema = baseModuleSchema.extend({
    courseId: z.string().uuid("Invalid course ID"),
});

/**
 * Schema for editing modules
 */
export const updateModuleSchema = createModuleSchema.extend({
    id: z.string().uuid("Invalid module ID"),
});

/**
 * Schema for updating users
 */
export const updateUserSchema = z.object({
    id: z.string().uuid("Invalid user ID"),
    name: z.string().nonempty("Name is required"),
    email: z.string().email("Invalid email address"),
    emailVerified: z.boolean(),
    image: z.string().url("Image URL is invalid").nullable(),
    tier: z.enum(["free", "pro"]),
    role: z.enum(["user", "admin"]),
});

/**
 * Schema for creating lessons
 */
export const createLessonSchema = z.object({
    name: z.string().nonempty("Name is required"),
    description: z
        .string()
        .max(200, "Description must be less than 200 characters")
        .nullish(),
    duration: z.number().int().positive("Duration must be a positive number"),
    content: z.string().nullable(),
    videoUrl: z.string().url("Video URL is invalid").nullable(),
    presentationUrl: z.string().url("Presentation URL is invalid").nullable(),
    moduleId: z.string().uuid("Invalid module ID"),
});

/**
 * Schema for updating lessons
 */
export const updateLessonSchema = createLessonSchema.extend({
    id: z.string().uuid("Invalid lesson ID"),
});
