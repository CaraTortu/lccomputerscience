import { relations } from "drizzle-orm";
import {
    boolean,
    integer,
    pgEnum,
    pgTableCreator,
    text,
    timestamp,
    varchar,
} from "drizzle-orm/pg-core";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator(
    (name) => `lccomputerscience_${name}`,
);

export const userTierEnum = pgEnum("user_tier", ["free", "pro"]);
export const userTypeEnum = pgEnum("user_type", ["user", "admin"]);

export const user = createTable("user", {
    id: text("id")
        .primaryKey()
        .notNull()
        .$defaultFn(() => crypto.randomUUID()),
    name: text("name").notNull(),
    email: text("email").notNull().unique(),
    emailVerified: boolean("email_verified").notNull().default(false),
    image: text("image"),
    tier: userTierEnum("tier").notNull().default("free"),
    role: text("role").notNull().default("user"),
    banned: boolean("banned").default(false),
    banReason: text("ban_reason"),
    banExpires: timestamp("ban_expires"),
    stripeCustomerId: text("stripe_customer_id"),
    lastLoginAt: timestamp("last_login_at"),
    createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const usersRelations = relations(user, ({ many }) => ({
    accounts: many(account),
    sessions: many(session),
    coursesEnrolled: many(userCourseEnrollments),
    lessonsComplete: many(userLessonsComplete),
}));

export const session = createTable("session", {
    id: text("id")
        .primaryKey()
        .notNull()
        .$defaultFn(() => crypto.randomUUID()),
    expiresAt: timestamp("expires_at").notNull(),
    token: text("token").notNull().unique(),
    createdAt: timestamp("created_at").notNull(),
    updatedAt: timestamp("updated_at").notNull(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    userId: text("user_id")
        .notNull()
        .references(() => user.id),
    impersonatedBy: text("impersonated_by"),
});

export const sessionRelations = relations(session, ({ one }) => ({
    user: one(user, {
        fields: [session.userId],
        references: [user.id],
    }),
}));

export const account = createTable("account", {
    id: text("id")
        .primaryKey()
        .notNull()
        .$defaultFn(() => crypto.randomUUID()),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    userId: text("user_id")
        .notNull()
        .references(() => user.id),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: timestamp("access_token_expires_at"),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
    scope: text("scope"),
    password: text("password"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const accountRelations = relations(account, ({ one }) => ({
    user: one(user, {
        fields: [account.userId],
        references: [user.id],
    }),
}));

export const verification = createTable("verification", {
    id: text("id")
        .primaryKey()
        .notNull()
        .$defaultFn(() => crypto.randomUUID()),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: timestamp("expires_at").notNull(),
    createdAt: timestamp("created_at"),
    updatedAt: timestamp("updated_at"),
});

/**
 * CONTENT
 */

export const userCourseEnrollments = createTable("user_course_enrollments", {
    userId: text("user_id")
        .notNull()
        .references(() => user.id, { onDelete: "cascade" }),
    courseId: varchar("course_id", { length: 255 })
        .notNull()
        .references(() => courses.id, { onDelete: "cascade" }),
});

export const userCourseEnrollmentsRelations = relations(
    userCourseEnrollments,
    ({ one }) => ({
        user: one(user, {
            fields: [userCourseEnrollments.userId],
            references: [user.id],
        }),
        course: one(courses, {
            fields: [userCourseEnrollments.courseId],
            references: [courses.id],
        }),
    }),
);

export const userLessonsComplete = createTable("user_lessons_complete", {
    userId: text("user_id")
        .notNull()
        .references(() => user.id, { onDelete: "cascade" }),
    lessonId: varchar("lesson_id", { length: 255 })
        .notNull()
        .references(() => lessons.id, { onDelete: "cascade" }),
});

export const userLessonsCompleteRelations = relations(
    userLessonsComplete,
    ({ one }) => ({
        user: one(user, {
            fields: [userLessonsComplete.userId],
            references: [user.id],
        }),
        lesson: one(lessons, {
            fields: [userLessonsComplete.lessonId],
            references: [lessons.id],
        }),
    }),
);

export const courseStatusEnum = pgEnum("course_status", [
    "active",
    "archived",
    "disabled",
    "draft",
]);

export const courses = createTable("courses", {
    id: varchar("id", { length: 255 })
        .notNull()
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
    name: varchar("name", { length: 255 }).notNull(),
    description: text("description"),
    image: varchar("image", { length: 255 }).notNull(),
    status: courseStatusEnum("status").notNull().default("active"),
    createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { mode: "date", precision: 3 })
        .notNull()
        .defaultNow()
        .$onUpdate(() => new Date()),
});

export const coursesRelations = relations(courses, ({ many }) => ({
    modules: many(modules),
    enrolledUsers: many(userCourseEnrollments),
}));

export const modules = createTable("modules", {
    id: varchar("id", { length: 255 })
        .notNull()
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
    courseId: varchar("course_id", { length: 255 })
        .notNull()
        .references(() => courses.id, { onDelete: "cascade" }),
    name: varchar("name", { length: 255 }).notNull(),
    description: text("description"),
    createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { mode: "date", precision: 3 })
        .notNull()
        .defaultNow()
        .$onUpdate(() => new Date()),
});

export const modulesRelations = relations(modules, ({ one, many }) => ({
    course: one(courses, {
        fields: [modules.courseId],
        references: [courses.id],
    }),
    lessons: many(lessons),
}));

export const lessons = createTable("lessons", {
    id: varchar("id", { length: 255 })
        .notNull()
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
    moduleId: varchar("module_id", { length: 255 })
        .notNull()
        .references(() => modules.id, { onDelete: "cascade" }),
    name: varchar("name", { length: 255 }).notNull(),
    description: text("description"),
    content: text("content"),
    videoUrl: text("video_url"),
    presentationUrl: text("presentation_url"),
    duration: integer("duration").notNull(),
    createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { mode: "date", precision: 3 })
        .notNull()
        .defaultNow()
        .$onUpdate(() => new Date()),
});

export const lessonsRelations = relations(lessons, ({ one }) => ({
    module: one(modules, {
        fields: [lessons.moduleId],
        references: [modules.id],
    }),
}));

/**
 * STRIPE
 */

export const subscription = createTable("subscription", {
    id: text("id")
        .primaryKey()
        .notNull()
        .$defaultFn(() => crypto.randomUUID()),
    plan: text("plan"),
    referenceId: text("referenceId"),
    stripeCustomerId: text("stripeCustomerId"),
    stripeSubscriptionId: text("stripeSubscriptionId"),
    status: text("status"),
    periodStart: timestamp("periodStart", { mode: "date" }),
    periodEnd: timestamp("periodEnd", { mode: "date" }),
    cancelAtPeriodEnd: boolean("cancelAtPeriodEnd").default(false),
    seats: integer("seats"),
    trialStart: timestamp("trialStart", { mode: "date" }),
    trialEnd: timestamp("trialEnd", { mode: "date" }),
});

export const stripePlans = createTable("stripePlans", {
    id: text("id")
        .primaryKey()
        .notNull()
        .$defaultFn(() => crypto.randomUUID()),
    name: text("name").notNull(),
    price: integer("price").notNull(),
    priceId: text("priceId").notNull().unique(),
});
