import {
  pgTable,
  serial,
  varchar,
  text,
  timestamp,
  integer,

  numeric,
  boolean,
  json,
  pgEnum,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Define enums
export const roleEnum = pgEnum('role', ['admin', 'instructor', 'student']);
export const genderEnum = pgEnum('gender', ['Male', 'Female', 'Other']);
export const licenseStatusEnum = pgEnum('license_status', ['none', 'provisional', 'full']);
export const courseLevelEnum = pgEnum('course_level', ['absolute-beginner', 'beginner', 'intermediate', 'advanced']);
export const bookingStatusEnum = pgEnum('booking_status', ['pending', 'confirmed', 'completed', 'cancelled']);
export const lessonStatusEnum = pgEnum('lesson_status', ['scheduled', 'completed', 'cancelled', 'no-show']);

// Users table with role-based access
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  role: roleEnum('role').notNull().default('student'),
  avatar: varchar('avatar', { length: 500 }),
  phone: varchar('phone', { length: 20 }),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
  deletedAt: timestamp('deleted_at'),
});

// Instructors table with detailed information
export const instructors = pgTable('instructors', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id),
  licenseNumber: varchar('license_number', { length: 50 }).notNull().unique(),
  experience: integer('experience').notNull(),
  specialties: json('specialties').$type<string[]>().notNull(),
  transmissionTypes: json('transmission_types').$type<string[]>().notNull(),
  pricePerHour: numeric('price_per_hour', { precision: 8, scale: 2 }).notNull(),
  location: varchar('location', { length: 100 }).notNull(),
  bio: text('bio'),

  availability: text('availability'),
  languages: json('languages').$type<string[]>(),
  nationality: varchar('nationality', { length: 50 }),
  religion: varchar('religion', { length: 50 }),
  ethnicity: varchar('ethnicity', { length: 50 }),
  gender: genderEnum('gender'),
  isApproved: boolean('is_approved').notNull().default(false),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Students table
export const students = pgTable('students', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id),
  dateOfBirth: timestamp('date_of_birth'),
  address: text('address'),
  emergencyContact: varchar('emergency_contact', { length: 20 }),
  licenseStatus: licenseStatusEnum('license_status').notNull().default('none'),
  medicalConditions: text('medical_conditions'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Courses table
export const courses = pgTable('courses', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 100 }).notNull(),
  description: text('description').notNull(),
  level: courseLevelEnum('level').notNull(),
  totalHours: integer('total_hours').notNull(),
  price: numeric('price', { precision: 8, scale: 2 }).notNull(),
  features: json('features').$type<string[]>().notNull(),
  color: varchar('color', { length: 20 }).notNull().default('blue'),
  isRecommended: boolean('is_recommended').notNull().default(false),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Bookings table
export const bookings = pgTable('bookings', {
  id: serial('id').primaryKey(),
  studentId: integer('student_id').notNull().references(() => students.id),
  instructorId: integer('instructor_id').notNull().references(() => instructors.id),
  courseId: integer('course_id').notNull().references(() => courses.id),
  status: bookingStatusEnum('status').notNull().default('pending'),
  scheduledDate: timestamp('scheduled_date').notNull(),
  duration: integer('duration').notNull(), // in minutes
  totalCost: numeric('total_cost', { precision: 8, scale: 2 }).notNull(),
  notes: text('notes'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Lessons table (individual lesson records)
export const lessons = pgTable('lessons', {
  id: serial('id').primaryKey(),
  bookingId: integer('booking_id').notNull().references(() => bookings.id),
  studentId: integer('student_id').notNull().references(() => students.id),
  instructorId: integer('instructor_id').notNull().references(() => instructors.id),
  lessonDate: timestamp('lesson_date').notNull(),
  startTime: varchar('start_time', { length: 8 }).notNull(),
  endTime: varchar('end_time', { length: 8 }).notNull(),
  status: lessonStatusEnum('status').notNull().default('scheduled'),
  studentProgress: text('student_progress'),
  instructorNotes: text('instructor_notes'),
  skills: json('skills').$type<string[]>(),

  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});



// Activity logs
export const activityLogs = pgTable('activity_logs', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id),
  action: text('action').notNull(),
  timestamp: timestamp('timestamp').notNull().defaultNow(),
  ipAddress: varchar('ip_address', { length: 45 }),
  metadata: json('metadata'),
});

// Settings table for admin configuration
export const settings = pgTable('settings', {
  id: serial('id').primaryKey(),
  key: varchar('key', { length: 100 }).notNull().unique(),
  value: text('value').notNull(),
  description: text('description'),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Course purchases statistics table
export const coursePurchases = pgTable('course_purchases', {
  id: serial('id').primaryKey(),
  courseId: integer('course_id').notNull().references(() => courses.id),
  studentName: varchar('student_name', { length: 100 }).notNull(),
  studentEmail: varchar('student_email', { length: 255 }),
  location: varchar('location', { length: 100 }),
  purchaseAmount: numeric('purchase_amount', { precision: 8, scale: 2 }).notNull(),
  isRealPurchase: boolean('is_real_purchase').notNull().default(true),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  metadata: json('metadata').$type<{
    userAgent?: string;
    ipAddress?: string;
    referrer?: string;
  }>(),
});

// Relations
export const usersRelations = relations(users, ({ one, many }) => ({
  instructor: one(instructors),
  student: one(students),
  activityLogs: many(activityLogs),
}));

export const instructorsRelations = relations(instructors, ({ one, many }) => ({
  user: one(users, {
    fields: [instructors.userId],
    references: [users.id],
  }),
  bookings: many(bookings),
  lessons: many(lessons),

}));

export const studentsRelations = relations(students, ({ one, many }) => ({
  user: one(users, {
    fields: [students.userId],
    references: [users.id],
  }),
  bookings: many(bookings),
  lessons: many(lessons),
}));

export const coursesRelations = relations(courses, ({ many }) => ({
  bookings: many(bookings),
  purchases: many(coursePurchases),
}));

export const coursePurchasesRelations = relations(coursePurchases, ({ one }) => ({
  course: one(courses, {
    fields: [coursePurchases.courseId],
    references: [courses.id],
  }),
}));

export const bookingsRelations = relations(bookings, ({ one, many }) => ({
  student: one(students, {
    fields: [bookings.studentId],
    references: [students.id],
  }),
  instructor: one(instructors, {
    fields: [bookings.instructorId],
    references: [instructors.id],
  }),
  course: one(courses, {
    fields: [bookings.courseId],
    references: [courses.id],
  }),
  lessons: many(lessons),
}));

export const lessonsRelations = relations(lessons, ({ one }) => ({
  booking: one(bookings, {
    fields: [lessons.bookingId],
    references: [bookings.id],
  }),
  student: one(students, {
    fields: [lessons.studentId],
    references: [students.id],
  }),
  instructor: one(instructors, {
    fields: [lessons.instructorId],
    references: [instructors.id],
  }),
}));



export const activityLogsRelations = relations(activityLogs, ({ one }) => ({
  user: one(users, {
    fields: [activityLogs.userId],
    references: [users.id],
  }),
}));

// Type exports
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Instructor = typeof instructors.$inferSelect;
export type NewInstructor = typeof instructors.$inferInsert;
export type Student = typeof students.$inferSelect;
export type NewStudent = typeof students.$inferInsert;
export type Course = typeof courses.$inferSelect;
export type NewCourse = typeof courses.$inferInsert;
export type Booking = typeof bookings.$inferSelect;
export type NewBooking = typeof bookings.$inferInsert;
export type Lesson = typeof lessons.$inferSelect;
export type NewLesson = typeof lessons.$inferInsert;

export type ActivityLog = typeof activityLogs.$inferSelect;
export type NewActivityLog = typeof activityLogs.$inferInsert;
export type Setting = typeof settings.$inferSelect;
export type NewSetting = typeof settings.$inferInsert;
export type CoursePurchase = typeof coursePurchases.$inferSelect;
export type NewCoursePurchase = typeof coursePurchases.$inferInsert;

// Enums
export enum UserRole {
  ADMIN = 'admin',
  INSTRUCTOR = 'instructor',
  STUDENT = 'student',
}

export enum BookingStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export enum LessonStatus {
  SCHEDULED = 'scheduled',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  NO_SHOW = 'no-show',
}

export enum ActivityType {
  SIGN_UP = 'SIGN_UP',
  SIGN_IN = 'SIGN_IN',
  SIGN_OUT = 'SIGN_OUT',
  UPDATE_PASSWORD = 'UPDATE_PASSWORD',
  DELETE_ACCOUNT = 'DELETE_ACCOUNT',
  UPDATE_ACCOUNT = 'UPDATE_ACCOUNT',
  BOOKING_CREATED = 'BOOKING_CREATED',
  BOOKING_UPDATED = 'BOOKING_UPDATED',
  LESSON_COMPLETED = 'LESSON_COMPLETED',

}