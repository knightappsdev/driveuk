import { 
  pgTable, 
  text, 
  varchar, 
  integer, 
  decimal, 
  boolean, 
  timestamp, 
  date, 
  json, 
  serial, 
  pgEnum 
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// UK Driving Platform - Core Schema
// Essential Enums
export const userRoleEnum = pgEnum('user_role', ['admin', 'instructor', 'student']);
export const transmissionTypeEnum = pgEnum('transmission_type', ['manual', 'automatic', 'both']);
export const fuelTypeEnum = pgEnum('fuel_type', ['petrol', 'diesel', 'hybrid', 'electric']);
export const adiGradeEnum = pgEnum('adi_grade', ['grade_4', 'grade_5', 'grade_6', 'trainee']);

// Phase 1 Enums - Student & Booking System
export const licenseTypeEnum = pgEnum('license_type', ['provisional', 'full_manual', 'full_automatic', 'none']);
export const bookingStatusEnum = pgEnum('booking_status', ['pending', 'confirmed', 'completed', 'cancelled', 'no_show']);
export const lessonTypeEnum = pgEnum('lesson_type', ['practical', 'theory_support', 'mock_test', 'intensive', 'assessment']);
export const paymentStatusEnum = pgEnum('payment_status', ['pending', 'paid', 'failed', 'refunded', 'partial']);
export const cancellationReasonEnum = pgEnum('cancellation_reason', ['instructor_sick', 'student_emergency', 'vehicle_breakdown', 'weather', 'other']);

// Phase 2 Enums - UK DVSA Theory Testing System
export const theoryCategoryEnum = pgEnum('theory_category', [
  'ALERTNESS', 'ATTITUDE', 'SAFETY_AND_YOUR_VEHICLE', 'SAFETY_MARGINS', 'HAZARD_AWARENESS',
  'VULNERABLE_ROAD_USERS', 'OTHER_TYPES_OF_VEHICLE', 'VEHICLE_SAFETY', 'VEHICLE_LOADING',
  'INCIDENTS_ACCIDENTS_EMERGENCIES', 'VEHICLE_HANDLING', 'MOTORWAY_RULES', 'RULES_OF_THE_ROAD',
  'ROAD_AND_TRAFFIC_SIGNS', 'DOCUMENTS'
]);
export const questionTypeEnum = pgEnum('question_type', ['multiple_choice', 'hazard_perception', 'case_study']);
export const difficultyLevelEnum = pgEnum('difficulty_level', ['foundation', 'intermediate', 'advanced']);
export const testStatusEnum = pgEnum('test_status', ['not_started', 'in_progress', 'completed', 'abandoned']);
export const hazardTypeEnum = pgEnum('hazard_type', ['developing', 'static', 'moving', 'environmental', 'behavioral']);

// Phase 3 Enums - Communication & Messaging System
export const messageTypeEnum = pgEnum('message_type', ['text', 'image', 'file', 'location', 'booking_update', 'lesson_feedback']);
export const notificationTypeEnum = pgEnum('notification_type', [
  'booking_confirmation', 'lesson_reminder', 'payment_due', 'theory_reminder', 'instructor_message',
  'system_update', 'emergency_cancellation', 'rebook_available', 'test_ready', 'achievement'
]);
export const notificationChannelEnum = pgEnum('notification_channel', ['internal', 'email', 'whatsapp', 'sms', 'push']);
export const messageStatusEnum = pgEnum('message_status', ['sent', 'delivered', 'read', 'failed']);
export const conversationTypeEnum = pgEnum('conversation_type', ['direct', 'group', 'system', 'support']);

// Phase 4 Enums - Community & Social Learning Platform
export const forumCategoryEnum = pgEnum('forum_category', [
  'general_discussion', 'theory_test_help', 'practical_test_tips', 'instructor_reviews',
  'study_groups', 'pass_stories', 'driving_tips', 'test_center_reviews', 'uk_driving_rules'
]);
export const postStatusEnum = pgEnum('post_status', ['draft', 'published', 'archived', 'reported', 'deleted']);
export const studyGroupTypeEnum = pgEnum('study_group_type', ['theory_focused', 'practical_focused', 'test_prep', 'general_support']);
export const membershipStatusEnum = pgEnum('membership_status', ['pending', 'active', 'inactive', 'banned']);
export const contentModerationEnum = pgEnum('content_moderation', ['approved', 'pending', 'flagged', 'rejected']);
export const achievementTypeEnum = pgEnum('achievement_type', ['study_streak', 'test_pass', 'community_helper', 'knowledge_master', 'milestone']);

// Core Users Table
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  passwordHash: varchar('password_hash', { length: 255 }).notNull(),
  firstName: varchar('first_name', { length: 100 }).notNull(),
  lastName: varchar('last_name', { length: 100 }).notNull(),
  phone: varchar('phone', { length: 20 }),
  role: userRoleEnum('role').notNull(),
  city: varchar('city', { length: 100 }),
  // User Registration & Verification Fields
  isEmailVerified: boolean('is_email_verified').default(false),
  isPhoneVerified: boolean('is_phone_verified').default(false),
  isActive: boolean('is_active').default(true),
  isBlocked: boolean('is_blocked').default(false),
  emailVerifiedAt: timestamp('email_verified_at'),
  phoneVerifiedAt: timestamp('phone_verified_at'),
  lastLoginAt: timestamp('last_login_at'),
  registrationIp: varchar('registration_ip', { length: 45 }), // IPv6 support
  lastLoginIp: varchar('last_login_ip', { length: 45 }),
  profilePicture: varchar('profile_picture', { length: 500 }),
  timezone: varchar('timezone', { length: 50 }).default('Europe/London'),
  locale: varchar('locale', { length: 10 }).default('en-GB'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// ====================================================================
// USER MANAGEMENT & AUTHENTICATION SYSTEM
// ====================================================================

// Email Verification Tokens
export const emailVerificationTokens = pgTable('email_verification_tokens', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id).notNull(),
  token: varchar('token', { length: 255 }).notNull().unique(),
  expiresAt: timestamp('expires_at').notNull(),
  isUsed: boolean('is_used').default(false),
  usedAt: timestamp('used_at'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Password Reset Tokens
export const passwordResetTokens = pgTable('password_reset_tokens', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id).notNull(),
  token: varchar('token', { length: 255 }).notNull().unique(),
  expiresAt: timestamp('expires_at').notNull(),
  isUsed: boolean('is_used').default(false),
  usedAt: timestamp('used_at'),
  ipAddress: varchar('ip_address', { length: 45 }),
  userAgent: text('user_agent'),
  createdAt: timestamp('created_at').defaultNow(),
});

// User Sessions (Login Management)
export const userSessions = pgTable('user_sessions', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id).notNull(),
  sessionToken: varchar('session_token', { length: 255 }).notNull().unique(),
  deviceInfo: json('device_info'), // {browser, os, device, etc.}
  ipAddress: varchar('ip_address', { length: 45 }).notNull(),
  userAgent: text('user_agent'),
  isActive: boolean('is_active').default(true),
  lastActivity: timestamp('last_activity').defaultNow(),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  revokedAt: timestamp('revoked_at'),
});

// Login Attempts & Security
export const loginAttempts = pgTable('login_attempts', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 255 }).notNull(),
  ipAddress: varchar('ip_address', { length: 45 }).notNull(),
  userAgent: text('user_agent'),
  isSuccessful: boolean('is_successful').notNull(),
  failureReason: varchar('failure_reason', { length: 100 }), // 'invalid_password', 'user_not_found', 'account_blocked'
  userId: integer('user_id').references(() => users.id), // NULL if login failed
  sessionId: integer('session_id').references(() => userSessions.id),
  attemptedAt: timestamp('attempted_at').defaultNow(),
});

// Two-Factor Authentication
export const twoFactorAuth = pgTable('two_factor_auth', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id).notNull().unique(),
  isEnabled: boolean('is_enabled').default(false),
  secret: varchar('secret', { length: 32 }), // TOTP secret
  backupCodes: json('backup_codes'), // Array of one-time backup codes
  lastUsedAt: timestamp('last_used_at'),
  enabledAt: timestamp('enabled_at'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Account Activity Log
export const accountActivityLogs = pgTable('account_activity_logs', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id).notNull(),
  activityType: varchar('activity_type', { length: 50 }).notNull(), // 'login', 'logout', 'password_change', 'email_change', 'profile_update'
  description: text('description').notNull(),
  ipAddress: varchar('ip_address', { length: 45 }),
  userAgent: text('user_agent'),
  metadata: json('metadata'), // Additional activity data
  createdAt: timestamp('created_at').defaultNow(),
});

// User Preferences & Settings
export const userSettings = pgTable('user_settings', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id).notNull().unique(),
  theme: varchar('theme', { length: 20 }).default('light'), // 'light', 'dark', 'auto'
  language: varchar('language', { length: 10 }).default('en-GB'),
  dateFormat: varchar('date_format', { length: 20 }).default('DD/MM/YYYY'),
  timeFormat: varchar('time_format', { length: 10 }).default('24h'), // '12h', '24h'
  weekStartsOn: integer('week_starts_on').default(1), // 1 = Monday, 0 = Sunday
  autoLogoutMinutes: integer('auto_logout_minutes').default(30),
  showOnlineStatus: boolean('show_online_status').default(true),
  allowDataCollection: boolean('allow_data_collection').default(true),
  marketingEmails: boolean('marketing_emails').default(false),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Registration Invitations (for controlled registration)
export const registrationInvitations = pgTable('registration_invitations', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 255 }).notNull(),
  inviteToken: varchar('invite_token', { length: 255 }).notNull().unique(),
  invitedByUserId: integer('invited_by_user_id').references(() => users.id),
  intendedRole: userRoleEnum('intended_role').notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  isUsed: boolean('is_used').default(false),
  usedAt: timestamp('used_at'),
  usedByUserId: integer('used_by_user_id').references(() => users.id),
  createdAt: timestamp('created_at').defaultNow(),
});

// Students Table - Phase 1
export const students = pgTable('students', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id).notNull().unique(),
  // License Information
  licenseType: licenseTypeEnum('license_type').default('none'),
  licenseNumber: varchar('license_number', { length: 50 }),
  theoryTestPassed: boolean('theory_test_passed').default(false),
  theoryTestDate: date('theory_test_date'),
  practicalTestDate: date('practical_test_date'),
  practicalTestPassed: boolean('practical_test_passed').default(false),
  // Personal Information
  dateOfBirth: date('date_of_birth'),
  address: text('address'),
  postcode: varchar('postcode', { length: 10 }),
  emergencyContact: json('emergency_contact'), // {name, phone, relationship}
  medicalConditions: text('medical_conditions'),
  // Learning Information
  learningGoals: text('learning_goals'),
  previousDrivingExperience: text('previous_driving_experience'),
  preferredInstructorGender: varchar('preferred_instructor_gender', { length: 20 }),
  preferredLanguage: varchar('preferred_language', { length: 50 }).default('english'),
  drivingLevel: varchar('driving_level', { length: 20 }),
  startDate: date('start_date'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Admins Table - Phase 1
export const admins = pgTable('admins', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id).notNull().unique(),
  adminLevel: integer('admin_level').default(1),
  canAssignInstructors: boolean('can_assign_instructors').default(true),
  canManagePackages: boolean('can_manage_packages').default(true),
  canViewAnalytics: boolean('can_view_analytics').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Enhanced Instructors Table - YOUR REQUIREMENTS
export const instructors = pgTable('instructors', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id).notNull().unique(),
  
  // UK ADI Badge
  adiBadgeNumber: varchar('adi_badge_number', { length: 20 }).notNull().unique(),
  adiGrade: adiGradeEnum('adi_grade').notNull(),
  
  // Professional Details
  yearsExperience: integer('years_experience').notNull(),
  hourlyRate: decimal('hourly_rate', { precision: 8, scale: 2 }).notNull(),
  specialties: json('specialties').notNull(),
  instructorSummary: text('instructor_summary'),
  qualifications: text('qualifications'),
  weeklyAvailability: json('weekly_availability'),
  availability: text('availability'),
  
  // Location & Contact
  baseCity: varchar('base_city', { length: 100 }).notNull(),
  businessAddress: text('business_address'),
  businessPostcode: varchar('business_postcode', { length: 10 }),
  whatsappNumber: varchar('whatsapp_number', { length: 20 }),
  
  // Vehicle & Insurance
  vehicleDetails: text('vehicle_details'),
  carMake: varchar('car_make', { length: 50 }),
  carModel: varchar('car_model', { length: 50 }),
  carYear: integer('car_year'),
  carType: transmissionTypeEnum('car_type'),
  carFuelType: fuelTypeEnum('car_fuel_type'),
  vehicleRegistration: varchar('vehicle_registration', { length: 10 }), // UK format: AB12 CDE
  transmissionTypes: json('transmission_types'), // Array of transmission types offered
  
  // Insurance Details
  insuranceCompany: varchar('insurance_company', { length: 100 }),
  insurancePolicyNumber: varchar('insurance_policy_number', { length: 50 }),
  
  // Additional Details
  ethnicity: varchar('ethnicity', { length: 100 }),
  religion: varchar('religion', { length: 100 }),
  isActive: boolean('is_active').default(true),
  isApproved: boolean('is_approved').default(false),
  bio: text('bio'),
  teachingExpertise: varchar('teaching_expertise', { length: 50 }),
  adiNumber: varchar('adi_number', { length: 50 }),
  
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// CRM Leads Table - Exit Intent and Contact Forms
export const leads = pgTable('leads', {
  id: serial('id').primaryKey(),
  firstName: varchar('first_name', { length: 100 }).notNull(),
  lastName: varchar('last_name', { length: 100 }),
  email: varchar('email', { length: 255 }).notNull(),
  phone: varchar('phone', { length: 20 }).notNull(),
  drivingLevel: varchar('driving_level', { length: 20 }).notNull(), // 'Theory' or 'Practical'
  leadSource: varchar('lead_source', { length: 50 }).notNull(), // 'exit_intent_popup', 'contact_form', etc.
  status: varchar('status', { length: 20 }).default('new'), // 'new', 'contacted', 'qualified', 'converted', 'closed'
  notes: text('notes'),
  contactPreference: varchar('contact_preference', { length: 20 }).default('phone'), // 'phone', 'email', 'whatsapp'
  assignedTo: integer('assigned_to').references(() => users.id), // Sales rep or instructor
  lastContactDate: timestamp('last_contact_date'),
  nextFollowUpDate: timestamp('next_follow_up_date'),
  conversionDate: timestamp('conversion_date'), // When they became a student
  studentId: integer('student_id').references(() => students.id), // If converted
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Comprehensive Calendar System - YOUR REQUIREMENT
export const instructorCalendars = pgTable('instructor_calendars', {
  id: serial('id').primaryKey(),
  instructorId: integer('instructor_id').references(() => instructors.id).notNull(),
  calendarName: varchar('calendar_name', { length: 200 }).default('Main Schedule'),
  timezone: varchar('timezone', { length: 50 }).default('Europe/London'),
  isPublic: boolean('is_public').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Time Tracker for Instructors - YOUR REQUIREMENT
export const instructorTimeLogs = pgTable('instructor_time_logs', {
  id: serial('id').primaryKey(),
  instructorId: integer('instructor_id').references(() => instructors.id).notNull(),
  logDate: date('log_date').notNull(),
  activityType: varchar('activity_type', { length: 50 }).notNull(),
  startTime: timestamp('start_time').notNull(),
  endTime: timestamp('end_time'),
  durationMinutes: integer('duration_minutes'),
  totalEarnings: decimal('total_earnings', { precision: 10, scale: 2 }),
  instructorNotes: text('instructor_notes'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Bookings System - Phase 1
export const bookings = pgTable('bookings', {
  id: serial('id').primaryKey(),
  studentId: integer('student_id').references(() => students.id).notNull(),
  instructorId: integer('instructor_id').references(() => instructors.id).notNull(),
  lessonType: lessonTypeEnum('lesson_type').notNull(),
  scheduledDate: date('scheduled_date').notNull(),
  scheduledTime: varchar('scheduled_time', { length: 10 }).notNull(), // "09:00-11:00"
  duration: integer('duration').notNull(), // minutes
  pickupLocation: varchar('pickup_location', { length: 255 }),
  dropoffLocation: varchar('dropoff_location', { length: 255 }),
  lessonFocus: text('lesson_focus'), // What to work on
  status: bookingStatusEnum('status').default('pending'),
  paymentStatus: paymentStatusEnum('payment_status').default('pending'),
  totalAmount: decimal('total_amount', { precision: 8, scale: 2 }).notNull(),
  paidAmount: decimal('paid_amount', { precision: 8, scale: 2 }).default('0.00'),
  bookingNotes: text('booking_notes'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Lessons Table - Phase 1 (Completed lessons with progress)
export const lessons = pgTable('lessons', {
  id: serial('id').primaryKey(),
  bookingId: integer('booking_id').references(() => bookings.id).notNull().unique(),
  studentId: integer('student_id').references(() => students.id).notNull(),
  instructorId: integer('instructor_id').references(() => instructors.id).notNull(),
  actualStartTime: timestamp('actual_start_time'),
  actualEndTime: timestamp('actual_end_time'),
  actualDuration: integer('actual_duration'), // minutes
  skillsWorkedOn: json('skills_worked_on'), // Array of skills practiced
  studentProgress: json('student_progress'), // Progress ratings per skill
  instructorNotes: text('instructor_notes'),
  studentFeedback: text('student_feedback'),
  instructorRating: integer('instructor_rating'), // 1-5 stars from student
  lessonRating: integer('lesson_rating'), // 1-5 stars overall
  areasForImprovement: json('areas_for_improvement'),
  nextLessonFocus: text('next_lesson_focus'),
  isCompleted: boolean('is_completed').default(false),
  completedAt: timestamp('completed_at'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Booking Cancellations - Phase 1
export const bookingCancellations = pgTable('booking_cancellations', {
  id: serial('id').primaryKey(),
  bookingId: integer('booking_id').references(() => bookings.id).notNull(),
  cancelledBy: varchar('cancelled_by', { length: 20 }).notNull(), // 'student', 'instructor', 'admin'
  cancellationReason: cancellationReasonEnum('cancellation_reason').notNull(),
  reasonDetails: text('reason_details'),
  cancellationDate: timestamp('cancellation_date').defaultNow(),
  refundAmount: decimal('refund_amount', { precision: 8, scale: 2 }),
  refundStatus: paymentStatusEnum('refund_status').default('pending'),
  rescheduled: boolean('rescheduled').default(false),
  newBookingId: integer('new_booking_id').references(() => bookings.id),
  createdAt: timestamp('created_at').defaultNow(),
});

// Course Management System
export const courses = pgTable('courses', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 200 }).notNull(),
  description: text('description'),
  level: varchar('level', { length: 50 }).notNull(), // 'beginner', 'intermediate', 'advanced'
  duration: integer('duration').notNull().default(60), // minutes
  price: decimal('price', { precision: 8, scale: 2 }).notNull().default('0.00'),
  maxStudents: integer('max_students').default(1),
  enrolledStudents: integer('enrolled_students').default(0),
  transmissionType: transmissionTypeEnum('transmission_type').default('manual'),
  isActive: boolean('is_active').default(true),
  isRecommended: boolean('is_recommended').default(false),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// System Settings for Admin Configuration
export const systemSettings = pgTable('system_settings', {
  id: serial('id').primaryKey(),
  category: varchar('category', { length: 100 }).notNull(), // 'general', 'payment', 'email', etc.
  key: varchar('key', { length: 100 }).notNull().unique(),
  value: text('value').notNull(),
  description: text('description'),
  isPublic: boolean('is_public').default(false), // Whether setting can be viewed by non-admin users
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Theory Test CTA Section Settings
export const theoryCtaSettings = pgTable('theory_cta_settings', {
  id: serial('id').primaryKey(),
  isActive: boolean('is_active').default(true),
  
  // Main Content
  title: varchar('title', { length: 200 }).default('Pass Your Theory Test Today'),
  subtitle: text('subtitle').default('Master the DVSA theory test with our comprehensive practice questions. Study all 15 official categories and boost your confidence before the real exam.'),
  
  // CTA Button
  buttonText: varchar('button_text', { length: 100 }).default('Take The Test'),
  buttonUrl: varchar('button_url', { length: 200 }).default('/theory'),
  
  // Statistics (3 stats displayed)
  stat1Icon: varchar('stat1_icon', { length: 50 }).default('CheckCircle'),
  stat1Text: varchar('stat1_text', { length: 100 }).default('15 Official DVSA Categories'),
  stat1Count: integer('stat1_count').default(15),
  
  stat2Icon: varchar('stat2_icon', { length: 50 }).default('BookOpen'),
  stat2Text: varchar('stat2_text', { length: 100 }).default('50+ Practice Questions'),
  stat2Count: integer('stat2_count').default(50),
  
  stat3Icon: varchar('stat3_icon', { length: 50 }).default('Star'),
  stat3Text: varchar('stat3_text', { length: 100 }).default('Real Exam Experience'),
  stat3Count: integer('stat3_count'),
  
  // Footer Text
  footerText: varchar('footer_text', { length: 200 }).default('Free practice • No registration required'),
  
  // Styling Options
  backgroundGradientFrom: varchar('bg_gradient_from', { length: 50 }).default('blue-600'),
  backgroundGradientVia: varchar('bg_gradient_via', { length: 50 }).default('blue-500'),
  backgroundGradientTo: varchar('bg_gradient_to', { length: 50 }).default('green-500'),
  
  // Display Options
  showDecorations: boolean('show_decorations').default(true),
  minHeight: varchar('min_height', { length: 20 }).default('min-h-96'),
  
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Custom Course Configuration
export const customCourseSettings = pgTable('custom_course_settings', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 200 }).notNull().default('Custom Course'),
  description: text('description').default('Build your personalized driving course'),
  hourlyRate: decimal('hourly_rate', { precision: 6, scale: 2 }).notNull().default('30.00'),
  minHours: integer('min_hours').default(1),
  maxHours: integer('max_hours').default(10),
  isActive: boolean('is_active').default(true),
  cardColor: varchar('card_color', { length: 50 }).default('orange'),
  cardIcon: varchar('card_icon', { length: 50 }).default('settings'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Custom Course Skills
export const customCourseSkills = pgTable('custom_course_skills', {
  id: serial('id').primaryKey(),
  skillId: varchar('skill_id', { length: 100 }).notNull().unique(),
  name: varchar('name', { length: 200 }).notNull(),
  category: varchar('category', { length: 50 }).notNull(), // 'safety', 'control', 'manoeuvres', 'navigation'
  description: text('description').notNull(),
  isActive: boolean('is_active').default(true),
  displayOrder: integer('display_order').default(0),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Phase 2: UK DVSA Theory Testing System

// UK Theory Categories (Official DVSA 15 Categories)  
export const ukTheoryCategories = pgTable('uk_theory_categories', {
  id: serial('id').primaryKey(),
  categoryCode: theoryCategoryEnum('category_code').notNull().unique(),
  categoryName: varchar('category_name', { length: 100 }).notNull(),
  description: text('description').notNull(),
  totalQuestions: integer('total_questions').notNull(),
  passRequirement: integer('pass_requirement').notNull(), // Min questions needed correct
  isActive: boolean('is_active').default(true),
  displayOrder: integer('display_order').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// UK Theory Questions (Complete DVSA Question Bank)
export const ukTheoryQuestions = pgTable('uk_theory_questions', {
  id: serial('id').primaryKey(),
  categoryId: integer('category_id').references(() => ukTheoryCategories.id).notNull(),
  questionType: questionTypeEnum('question_type').notNull(),
  difficultyLevel: difficultyLevelEnum('difficulty_level').notNull(),
  questionText: text('question_text').notNull(),
  questionImage: varchar('question_image', { length: 500 }), // Image URL if applicable
  optionA: varchar('option_a', { length: 500 }).notNull(),
  optionB: varchar('option_b', { length: 500 }).notNull(),
  optionC: varchar('option_c', { length: 500 }),
  optionD: varchar('option_d', { length: 500 }),
  correctAnswer: varchar('correct_answer', { length: 1 }).notNull(), // A, B, C, or D
  explanation: text('explanation').notNull(),
  officialReference: varchar('official_reference', { length: 200 }), // Highway Code reference
  isActive: boolean('is_active').default(true),
  timesAsked: integer('times_asked').default(0),
  timesCorrect: integer('times_correct').default(0),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Hazard Perception Tests
export const hazardPerceptionTests = pgTable('hazard_perception_tests', {
  id: serial('id').primaryKey(),
  testName: varchar('test_name', { length: 200 }).notNull(),
  videoUrl: varchar('video_url', { length: 500 }).notNull(),
  videoDuration: integer('video_duration').notNull(), // seconds
  hazardType: hazardTypeEnum('hazard_type').notNull(),
  difficultyLevel: difficultyLevelEnum('difficulty_level').notNull(),
  scoringWindow: json('scoring_window').notNull(), // {start: seconds, end: seconds, maxScore: number}
  description: text('description'),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Student Theory Progress
export const studentTheoryProgress = pgTable('student_theory_progress', {
  id: serial('id').primaryKey(),
  studentId: integer('student_id').references(() => students.id).notNull(),
  categoryId: integer('category_id').references(() => ukTheoryCategories.id).notNull(),
  questionsAttempted: integer('questions_attempted').default(0),
  questionsCorrect: integer('questions_correct').default(0),
  accuracyPercentage: decimal('accuracy_percentage', { precision: 5, scale: 2 }).default('0.00'),
  weakAreas: json('weak_areas'), // Array of question IDs frequently wrong
  strongAreas: json('strong_areas'), // Array of question IDs consistently correct
  lastPracticeDate: timestamp('last_practice_date'),
  totalPracticeTime: integer('total_practice_time').default(0), // minutes
  isReadyForTest: boolean('is_ready_for_test').default(false),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
}, (table) => ({
  // Composite unique constraint: one progress record per student per category
  uniqueStudentCategory: {
    columns: [table.studentId, table.categoryId],
    name: 'unique_student_category'
  }
}));

// Mock Theory Tests
export const mockTheoryTests = pgTable('mock_theory_tests', {
  id: serial('id').primaryKey(),
  studentId: integer('student_id').references(() => students.id).notNull(),
  testName: varchar('test_name', { length: 200 }).notNull(),
  testType: varchar('test_type', { length: 50 }).notNull(), // 'practice', 'mock', 'official_prep'
  totalQuestions: integer('total_questions').notNull(),
  questionsCorrect: integer('questions_correct'),
  scorePercentage: decimal('score_percentage', { precision: 5, scale: 2 }),
  timeSpent: integer('time_spent'), // minutes
  status: testStatusEnum('status').default('not_started'),
  questionsData: json('questions_data'), // Array of {questionId, selectedAnswer, isCorrect, timeSpent}
  hazardPerceptionScore: integer('hazard_perception_score'), // 0-75 points
  overallResult: varchar('overall_result', { length: 20 }), // 'pass', 'fail', 'incomplete'
  startedAt: timestamp('started_at'),
  completedAt: timestamp('completed_at'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Student Study Sessions
export const studySessions = pgTable('study_sessions', {
  id: serial('id').primaryKey(),
  studentId: integer('student_id').references(() => students.id).notNull(),
  sessionType: varchar('session_type', { length: 50 }).notNull(), // 'practice', 'revision', 'weak_areas'
  categoryId: integer('category_id').references(() => ukTheoryCategories.id),
  questionsAttempted: integer('questions_attempted').notNull(),
  questionsCorrect: integer('questions_correct').notNull(),
  sessionDuration: integer('session_duration').notNull(), // minutes
  focusAreas: json('focus_areas'), // Array of topics focused on
  improvementNotes: text('improvement_notes'),
  nextSessionRecommendation: text('next_session_recommendation'),
  confidenceLevel: integer('confidence_level'), // 1-10 scale
  sessionStarted: timestamp('session_started').notNull(),
  sessionEnded: timestamp('session_ended'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Study Reminders & AI Readiness Calculator
export const studyReminders = pgTable('study_reminders', {
  id: serial('id').primaryKey(),
  studentId: integer('student_id').references(() => students.id).notNull(),
  reminderType: varchar('reminder_type', { length: 50 }).notNull(), // 'daily_practice', 'weak_area_focus', 'test_prep', 'mock_test'
  title: varchar('title', { length: 200 }).notNull(),
  message: text('message').notNull(),
  scheduledFor: timestamp('scheduled_for').notNull(),
  isRecurring: boolean('is_recurring').default(false),
  recurringPattern: varchar('recurring_pattern', { length: 50 }), // 'daily', 'weekly', 'custom'
  categoryFocus: integer('category_focus').references(() => ukTheoryCategories.id),
  priority: integer('priority').default(1), // 1-5 scale
  isActive: boolean('is_active').default(true),
  sentAt: timestamp('sent_at'),
  respondedAt: timestamp('responded_at'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// AI Readiness Assessment
export const aiReadinessAssessments = pgTable('ai_readiness_assessments', {
  id: serial('id').primaryKey(),
  studentId: integer('student_id').references(() => students.id).notNull(),
  assessmentDate: timestamp('assessment_date').defaultNow(),
  overallReadinessScore: decimal('overall_readiness_score', { precision: 5, scale: 2 }).notNull(), // 0-100
  categoryScores: json('category_scores').notNull(), // {categoryId: score} for all 15 categories
  weakestCategories: json('weakest_categories').notNull(), // Array of category IDs
  strongestCategories: json('strongest_categories').notNull(), // Array of category IDs
  recommendedStudyHours: integer('recommended_study_hours').notNull(),
  suggestedTestDate: date('suggested_test_date'),
  improvementPlan: json('improvement_plan'), // Detailed study plan
  confidenceLevel: varchar('confidence_level', { length: 50 }).notNull(), // 'very_low', 'low', 'medium', 'high', 'very_high'
  isReadyForOfficialTest: boolean('is_ready_for_official_test').default(false),
  createdAt: timestamp('created_at').defaultNow(),
});

// Gamification & Rewards System
export const achievements = pgTable('achievements', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 200 }).notNull(),
  description: text('description').notNull(),
  type: achievementTypeEnum('type').notNull(),
  category: varchar('category', { length: 50 }).notNull(), // 'theory', 'practical', 'streak', 'milestone'
  iconUrl: varchar('icon_url', { length: 500 }),
  condition: json('condition').notNull(), // {type: 'score', threshold: 90, category_id: 1}
  points: integer('points').default(0),
  badgeColor: varchar('badge_color', { length: 50 }).default('blue'),
  rarity: varchar('rarity', { length: 50 }).default('common'), // 'common', 'rare', 'epic', 'legendary'
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const userAchievements = pgTable('user_achievements', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id).notNull(),
  achievementId: integer('achievement_id').references(() => achievements.id).notNull(),
  earnedAt: timestamp('earned_at').defaultNow(),
  progress: decimal('progress', { precision: 5, scale: 2 }).default('100.00'), // For partial achievements
  data: json('data'), // Additional data about how it was earned
  createdAt: timestamp('created_at').defaultNow(),
}, (table) => ({
  uniqueUserAchievement: {
    columns: [table.userId, table.achievementId],
    name: 'unique_user_achievement'
  }
}));

export const userPoints = pgTable('user_points', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id).notNull().unique(),
  totalPoints: integer('total_points').default(0),
  theoryPoints: integer('theory_points').default(0),
  practicalPoints: integer('practical_points').default(0),
  streakPoints: integer('streak_points').default(0),
  currentStreak: integer('current_streak').default(0),
  longestStreak: integer('longest_streak').default(0),
  lastActivityDate: date('last_activity_date'),
  level: integer('level').default(1),
  nextLevelPoints: integer('next_level_points').default(100),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const leaderboard = pgTable('leaderboard', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id).notNull(),
  category: varchar('category', { length: 50 }).notNull(), // 'weekly', 'monthly', 'all_time', 'category_specific'
  categoryId: integer('category_id').references(() => ukTheoryCategories.id), // For category-specific leaderboards
  points: integer('points').notNull(),
  rank: integer('rank').notNull(),
  weekOf: date('week_of'), // For weekly leaderboards
  monthOf: date('month_of'), // For monthly leaderboards
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Theory Test Statistics
export const theoryTestStats = pgTable('theory_test_stats', {
  id: serial('id').primaryKey(),
  questionId: integer('question_id').references(() => ukTheoryQuestions.id).notNull().unique(),
  timesShown: integer('times_shown').default(0),
  timesCorrect: integer('times_correct').default(0),
  timesIncorrect: integer('times_incorrect').default(0),
  averageTimeSpent: decimal('average_time_spent', { precision: 5, scale: 2 }).default('0.00'), // seconds
  difficultyRating: decimal('difficulty_rating', { precision: 3, scale: 2 }).default('0.00'), // 0-10 scale
  lastUpdated: timestamp('last_updated').defaultNow(),
});

// Phase 3: Communication & Messaging System

// Conversations (Message Threads)
export const conversations = pgTable('conversations', {
  id: serial('id').primaryKey(),
  type: conversationTypeEnum('type').notNull(),
  title: varchar('title', { length: 200 }),
  description: text('description'),
  participantIds: json('participant_ids').notNull(), // Array of user IDs
  createdBy: integer('created_by').references(() => users.id).notNull(),
  lastMessageId: integer('last_message_id'), // Foreign key handled in relations to avoid circular reference
  lastActivityAt: timestamp('last_activity_at').defaultNow(),
  isActive: boolean('is_active').default(true),
  conversationMeta: json('conversation_meta'), // booking_id, lesson_id, etc.
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Messages
export const messages = pgTable('messages', {
  id: serial('id').primaryKey(),
  conversationId: integer('conversation_id').references(() => conversations.id).notNull(),
  senderId: integer('sender_id').references(() => users.id).notNull(),
  messageType: messageTypeEnum('message_type').notNull(),
  content: text('content').notNull(),
  attachments: json('attachments'), // Array of file URLs/metadata
  replyToMessageId: integer('reply_to_message_id'), // Self-reference handled in relations
  isEdited: boolean('is_edited').default(false),
  editedAt: timestamp('edited_at'),
  isDeleted: boolean('is_deleted').default(false),
  deletedAt: timestamp('deleted_at'),
  metadata: json('metadata'), // Location data, booking info, etc.
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Message Read Status
export const messageReadStatus = pgTable('message_read_status', {
  id: serial('id').primaryKey(),
  messageId: integer('message_id').references(() => messages.id).notNull(),
  userId: integer('user_id').references(() => users.id).notNull(),
  readAt: timestamp('read_at').defaultNow(),
  createdAt: timestamp('created_at').defaultNow(),
}, (table) => ({
  // Composite unique constraint: one read status per user per message
  uniqueMessageUser: {
    columns: [table.messageId, table.userId],
    name: 'unique_message_user_read_status'
  }
}));

// Notification System
export const notifications = pgTable('notifications', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id).notNull(),
  type: notificationTypeEnum('type').notNull(),
  title: varchar('title', { length: 200 }).notNull(),
  content: text('content').notNull(),
  actionUrl: varchar('action_url', { length: 500 }), // Deep link to relevant page
  actionData: json('action_data'), // booking_id, lesson_id, etc.
  priority: integer('priority').default(1), // 1-5 scale
  isRead: boolean('is_read').default(false),
  readAt: timestamp('read_at'),
  expiresAt: timestamp('expires_at'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Notification Delivery Tracking
export const notificationDeliveries = pgTable('notification_deliveries', {
  id: serial('id').primaryKey(),
  notificationId: integer('notification_id').references(() => notifications.id).notNull(),
  channel: notificationChannelEnum('channel').notNull(),
  recipientAddress: varchar('recipient_address', { length: 255 }).notNull(), // email, phone, etc.
  status: messageStatusEnum('status').notNull(),
  attempts: integer('attempts').default(1),
  lastAttemptAt: timestamp('last_attempt_at').defaultNow(),
  deliveredAt: timestamp('delivered_at'),
  failureReason: text('failure_reason'),
  externalId: varchar('external_id', { length: 255 }), // WhatsApp message ID, etc.
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// User Communication Preferences
export const userCommunicationPreferences = pgTable('user_communication_preferences', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id).notNull().unique(),
  emailNotifications: boolean('email_notifications').default(true),
  whatsappNotifications: boolean('whatsapp_notifications').default(true),
  smsNotifications: boolean('sms_notifications').default(false),
  pushNotifications: boolean('push_notifications').default(true),
  internalMessages: boolean('internal_messages').default(true),
  // Specific notification preferences
  bookingReminders: boolean('booking_reminders').default(true),
  paymentReminders: boolean('payment_reminders').default(true),
  theoryReminders: boolean('theory_reminders').default(true),
  instructorMessages: boolean('instructor_messages').default(true),
  systemUpdates: boolean('system_updates').default(true),
  marketingMessages: boolean('marketing_messages').default(false),
  // Timing preferences
  quietHoursStart: varchar('quiet_hours_start', { length: 5 }).default('22:00'),
  quietHoursEnd: varchar('quiet_hours_end', { length: 5 }).default('08:00'),
  timezone: varchar('timezone', { length: 50 }).default('Europe/London'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// WhatsApp Integration
export const whatsappMessages = pgTable('whatsapp_messages', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id).notNull(),
  whatsappNumber: varchar('whatsapp_number', { length: 20 }).notNull(),
  messageDirection: varchar('message_direction', { length: 10 }).notNull(), // 'inbound', 'outbound'
  messageType: messageTypeEnum('message_type').notNull(),
  content: text('content').notNull(),
  whatsappMessageId: varchar('whatsapp_message_id', { length: 255 }).unique(),
  status: messageStatusEnum('status').notNull(),
  webhookData: json('webhook_data'), // Full WhatsApp API response
  internalMessageId: integer('internal_message_id').references(() => messages.id),
  failureReason: text('failure_reason'),
  deliveredAt: timestamp('delivered_at'),
  readAt: timestamp('read_at'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// System Announcements
export const systemAnnouncements = pgTable('system_announcements', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 200 }).notNull(),
  content: text('content').notNull(),
  announcementType: varchar('announcement_type', { length: 50 }).notNull(), // 'maintenance', 'feature', 'important'
  targetAudience: json('target_audience').notNull(), // ['students', 'instructors', 'admins']
  priority: integer('priority').default(1), // 1-5 scale
  showUntil: timestamp('show_until'),
  isActive: boolean('is_active').default(true),
  createdBy: integer('created_by').references(() => users.id).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Emergency Communication System
export const emergencyAlerts = pgTable('emergency_alerts', {
  id: serial('id').primaryKey(),
  alertType: varchar('alert_type', { length: 50 }).notNull(), // 'weather', 'system_down', 'urgent_cancellation'
  title: varchar('title', { length: 200 }).notNull(),
  message: text('message').notNull(),
  affectedUsers: json('affected_users'), // Array of user IDs or 'all'
  affectedAreas: json('affected_areas'), // Array of postcodes/cities
  severity: varchar('severity', { length: 20 }).notNull(), // 'low', 'medium', 'high', 'critical'
  actionRequired: text('action_required'),
  isActive: boolean('is_active').default(true),
  resolvedAt: timestamp('resolved_at'),
  createdBy: integer('created_by').references(() => users.id).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Phase 4: Community & Social Learning Platform

// Community Forums
export const forumCategories = pgTable('forum_categories', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  description: text('description').notNull(),
  category: forumCategoryEnum('category').notNull(),
  icon: varchar('icon', { length: 100 }), // Icon name/URL
  color: varchar('color', { length: 7 }).default('#3B82F6'), // Hex color
  isActive: boolean('is_active').default(true),
  moderatorIds: json('moderator_ids'), // Array of user IDs who can moderate
  postCount: integer('post_count').default(0),
  displayOrder: integer('display_order').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Forum Posts
export const forumPosts = pgTable('forum_posts', {
  id: serial('id').primaryKey(),
  categoryId: integer('category_id').references(() => forumCategories.id).notNull(),
  authorId: integer('author_id').references(() => users.id).notNull(),
  title: varchar('title', { length: 300 }).notNull(),
  content: text('content').notNull(),
  contentType: varchar('content_type', { length: 20 }).default('markdown'), // 'markdown', 'html', 'plain'
  status: postStatusEnum('status').default('published'),
  isPinned: boolean('is_pinned').default(false),
  isLocked: boolean('is_locked').default(false),
  tags: json('tags'), // Array of topic tags
  upvotes: integer('upvotes').default(0),
  downvotes: integer('downvotes').default(0),
  replyCount: integer('reply_count').default(0),
  viewCount: integer('view_count').default(0),
  lastReplyAt: timestamp('last_reply_at'),
  lastReplyBy: integer('last_reply_by').references(() => users.id),
  moderationStatus: contentModerationEnum('moderation_status').default('approved'),
  moderatedBy: integer('moderated_by').references(() => users.id),
  moderatedAt: timestamp('moderated_at'),
  moderationReason: text('moderation_reason'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Forum Post Replies
export const forumReplies = pgTable('forum_replies', {
  id: serial('id').primaryKey(),
  postId: integer('post_id').references(() => forumPosts.id).notNull(),
  authorId: integer('author_id').references(() => users.id).notNull(),
  content: text('content').notNull(),
  contentType: varchar('content_type', { length: 20 }).default('markdown'),
  replyToId: integer('reply_to_id'), // Self-reference for nested replies, handled in relations
  upvotes: integer('upvotes').default(0),
  downvotes: integer('downvotes').default(0),
  isAcceptedAnswer: boolean('is_accepted_answer').default(false),
  moderationStatus: contentModerationEnum('moderation_status').default('approved'),
  moderatedBy: integer('moderated_by').references(() => users.id),
  moderatedAt: timestamp('moderated_at'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Study Groups for Theory Test Students
export const studyGroups = pgTable('study_groups', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 200 }).notNull(),
  description: text('description').notNull(),
  groupType: studyGroupTypeEnum('group_type').notNull(),
  focusCategories: json('focus_categories'), // Array of theory category IDs
  maxMembers: integer('max_members').default(20),
  currentMembers: integer('current_members').default(0),
  isPublic: boolean('is_public').default(true),
  requiresApproval: boolean('requires_approval').default(false),
  createdBy: integer('created_by').references(() => users.id).notNull(),
  moderatorIds: json('moderator_ids'), // Array of user IDs
  meetingSchedule: json('meeting_schedule'), // {days: [], time: '', timezone: ''}
  studyPlan: json('study_plan'), // Structured learning plan
  groupAvatar: varchar('group_avatar', { length: 500 }),
  inviteCode: varchar('invite_code', { length: 10 }).unique(),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Study Group Memberships
export const studyGroupMemberships = pgTable('study_group_memberships', {
  id: serial('id').primaryKey(),
  groupId: integer('group_id').references(() => studyGroups.id).notNull(),
  userId: integer('user_id').references(() => users.id).notNull(),
  status: membershipStatusEnum('status').default('pending'),
  role: varchar('role', { length: 20 }).default('member'), // 'owner', 'moderator', 'member'
  joinedAt: timestamp('joined_at').defaultNow(),
  lastActiveAt: timestamp('last_active_at').defaultNow(),
  contributionScore: integer('contribution_score').default(0),
  studyStreak: integer('study_streak').default(0), // Days in a row
  helpfulAnswers: integer('helpful_answers').default(0),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
}, (table) => ({
  // Composite unique constraint: one membership per user per group
  uniqueUserGroup: {
    columns: [table.groupId, table.userId],
    name: 'unique_user_group_membership'
  }
}));

// Group Chat Messages for Study Groups
export const groupChatMessages = pgTable('group_chat_messages', {
  id: serial('id').primaryKey(),
  groupId: integer('group_id').references(() => studyGroups.id).notNull(),
  senderId: integer('sender_id').references(() => users.id).notNull(),
  messageType: messageTypeEnum('message_type').notNull(),
  content: text('content').notNull(),
  attachments: json('attachments'), // Files, images, theory questions
  replyToMessageId: integer('reply_to_message_id'), // Self-reference handled in relations
  isAnnouncement: boolean('is_announcement').default(false),
  isPinned: boolean('is_pinned').default(false),
  reactions: json('reactions'), // {emoji: [userIds]}
  isDeleted: boolean('is_deleted').default(false),
  deletedAt: timestamp('deleted_at'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Peer Learning Sessions
export const peerLearningSessions = pgTable('peer_learning_sessions', {
  id: serial('id').primaryKey(),
  groupId: integer('group_id').references(() => studyGroups.id).notNull(),
  hostId: integer('host_id').references(() => users.id).notNull(),
  title: varchar('title', { length: 200 }).notNull(),
  description: text('description'),
  sessionType: varchar('session_type', { length: 50 }).notNull(), // 'quiz', 'discussion', 'mock_test', 'study_review'
  scheduledFor: timestamp('scheduled_for').notNull(),
  duration: integer('duration').notNull(), // minutes
  maxParticipants: integer('max_participants').default(10),
  currentParticipants: integer('current_participants').default(0),
  meetingLink: varchar('meeting_link', { length: 500 }), // Video call link
  sessionMaterials: json('session_materials'), // Resources, questions, etc.
  isRecurring: boolean('is_recurring').default(false),
  recurringPattern: varchar('recurring_pattern', { length: 50 }),
  status: varchar('status', { length: 20 }).default('scheduled'), // 'scheduled', 'active', 'completed', 'cancelled'
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Community User Profiles & Achievements
export const communityProfiles = pgTable('community_profiles', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id).notNull().unique(),
  displayName: varchar('display_name', { length: 100 }),
  bio: text('bio'),
  location: varchar('location', { length: 100 }),
  testStatus: varchar('test_status', { length: 50 }), // 'studying', 'theory_passed', 'practical_passed', 'full_license'
  studyGoals: json('study_goals'),
  helpfulnessScore: integer('helpfulness_score').default(0),
  reputationPoints: integer('reputation_points').default(0),
  badgesEarned: json('badges_earned'), // Array of achievement IDs
  preferredStudyTimes: json('preferred_study_times'),
  learningStyle: varchar('learning_style', { length: 50 }), // 'visual', 'auditory', 'kinesthetic', 'mixed'
  strongCategories: json('strong_categories'), // Theory categories they excel at
  mentorAvailable: boolean('mentor_available').default(false),
  isVerified: boolean('is_verified').default(false), // Passed official test
  totalPosts: integer('total_posts').default(0),
  totalHelpfulAnswers: integer('total_helpful_answers').default(0),
  joinedCommunitiesCount: integer('joined_communities_count').default(0),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Achievement System (using existing achievements and userAchievements tables above)

// Post/Reply Voting System
export const contentVotes = pgTable('content_votes', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id).notNull(),
  contentType: varchar('content_type', { length: 20 }).notNull(), // 'forum_post', 'forum_reply', 'group_message'
  contentId: integer('content_id').notNull(),
  voteType: varchar('vote_type', { length: 10 }).notNull(), // 'upvote', 'downvote'
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
}, (table) => ({
  // Composite unique constraint: one vote per user per content item
  uniqueUserContentVote: {
    columns: [table.userId, table.contentType, table.contentId],
    name: 'unique_user_content_vote'
  }
}));

// Relations - Phase 1 Updated
export const usersRelations = relations(users, ({ one, many }) => ({
  instructor: one(instructors),
  student: one(students),
  admin: one(admins),
  // User Management & Authentication Relations
  emailVerificationTokens: many(emailVerificationTokens),
  passwordResetTokens: many(passwordResetTokens),
  sessions: many(userSessions),
  loginAttempts: many(loginAttempts),
  twoFactorAuth: one(twoFactorAuth),
  activityLogs: many(accountActivityLogs),
  settings: one(userSettings),
  // Phase 3 - Communication Relations
  sentMessages: many(messages),
  messageReadStatus: many(messageReadStatus),
  notifications: many(notifications),
  communicationPreferences: one(userCommunicationPreferences),
  whatsappMessages: many(whatsappMessages),
  conversationsCreated: many(conversations),
  // Phase 4 - Community Relations
  communityProfile: one(communityProfiles),
  forumPosts: many(forumPosts),
  forumReplies: many(forumReplies),
  studyGroupMemberships: many(studyGroupMemberships),
  groupChatMessages: many(groupChatMessages),
  hostedLearningSessions: many(peerLearningSessions),
  achievements: many(userAchievements),
  contentVotes: many(contentVotes),
}));

export const studentsRelations = relations(students, ({ one, many }) => ({
  user: one(users, {
    fields: [students.userId],
    references: [users.id],
  }),
  bookings: many(bookings),
  lessons: many(lessons),
  // Phase 2 - Theory Testing Relations
  theoryProgress: many(studentTheoryProgress),
  mockTests: many(mockTheoryTests),
  studySessions: many(studySessions),
  studyReminders: many(studyReminders),
  readinessAssessments: many(aiReadinessAssessments),
}));

export const instructorsRelations = relations(instructors, ({ one, many }) => ({
  user: one(users, {
    fields: [instructors.userId],
    references: [users.id],
  }),
  timeLogs: many(instructorTimeLogs),
  calendars: many(instructorCalendars),
  bookings: many(bookings),
  lessons: many(lessons),
}));

export const leadsRelations = relations(leads, ({ one }) => ({
  assignedUser: one(users, {
    fields: [leads.assignedTo],
    references: [users.id],
  }),
  convertedStudent: one(students, {
    fields: [leads.studentId],
    references: [students.id],
  }),
}));

export const adminsRelations = relations(admins, ({ one }) => ({
  user: one(users, {
    fields: [admins.userId],
    references: [users.id],
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
  lesson: one(lessons),
  cancellation: one(bookingCancellations),
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

// Phase 2 Relations - UK DVSA Theory Testing
export const ukTheoryCategoriesRelations = relations(ukTheoryCategories, ({ many }) => ({
  questions: many(ukTheoryQuestions),
  studentProgress: many(studentTheoryProgress),
}));

export const ukTheoryQuestionsRelations = relations(ukTheoryQuestions, ({ one }) => ({
  category: one(ukTheoryCategories, {
    fields: [ukTheoryQuestions.categoryId],
    references: [ukTheoryCategories.id],
  }),
}));

export const studentTheoryProgressRelations = relations(studentTheoryProgress, ({ one }) => ({
  student: one(students, {
    fields: [studentTheoryProgress.studentId],
    references: [students.id],
  }),
  category: one(ukTheoryCategories, {
    fields: [studentTheoryProgress.categoryId],
    references: [ukTheoryCategories.id],
  }),
}));

export const mockTheoryTestsRelations = relations(mockTheoryTests, ({ one }) => ({
  student: one(students, {
    fields: [mockTheoryTests.studentId],
    references: [students.id],
  }),
}));

export const studySessionsRelations = relations(studySessions, ({ one }) => ({
  student: one(students, {
    fields: [studySessions.studentId],
    references: [students.id],
  }),
  category: one(ukTheoryCategories, {
    fields: [studySessions.categoryId],
    references: [ukTheoryCategories.id],
  }),
}));

export const studyRemindersRelations = relations(studyReminders, ({ one }) => ({
  student: one(students, {
    fields: [studyReminders.studentId],
    references: [students.id],
  }),
  categoryFocus: one(ukTheoryCategories, {
    fields: [studyReminders.categoryFocus],
    references: [ukTheoryCategories.id],
  }),
}));

export const aiReadinessAssessmentsRelations = relations(aiReadinessAssessments, ({ one }) => ({
  student: one(students, {
    fields: [aiReadinessAssessments.studentId],
    references: [students.id],
  }),
}));

// Phase 3 Relations - Communication & Messaging System
export const conversationsRelations = relations(conversations, ({ one, many }) => ({
  creator: one(users, {
    fields: [conversations.createdBy],
    references: [users.id],
  }),
  messages: many(messages),
  lastMessage: one(messages, {
    fields: [conversations.lastMessageId],
    references: [messages.id],
  }),
}));

export const messagesRelations = relations(messages, ({ one, many }) => ({
  conversation: one(conversations, {
    fields: [messages.conversationId],
    references: [conversations.id],
  }),
  sender: one(users, {
    fields: [messages.senderId],
    references: [users.id],
  }),
  replyToMessage: one(messages, {
    fields: [messages.replyToMessageId],
    references: [messages.id],
  }),
  readStatus: many(messageReadStatus),
  whatsappMessage: one(whatsappMessages),
}));

export const messageReadStatusRelations = relations(messageReadStatus, ({ one }) => ({
  message: one(messages, {
    fields: [messageReadStatus.messageId],
    references: [messages.id],
  }),
  user: one(users, {
    fields: [messageReadStatus.userId],
    references: [users.id],
  }),
}));

export const notificationsRelations = relations(notifications, ({ one, many }) => ({
  user: one(users, {
    fields: [notifications.userId],
    references: [users.id],
  }),
  deliveries: many(notificationDeliveries),
}));

export const notificationDeliveriesRelations = relations(notificationDeliveries, ({ one }) => ({
  notification: one(notifications, {
    fields: [notificationDeliveries.notificationId],
    references: [notifications.id],
  }),
}));

export const userCommunicationPreferencesRelations = relations(userCommunicationPreferences, ({ one }) => ({
  user: one(users, {
    fields: [userCommunicationPreferences.userId],
    references: [users.id],
  }),
}));

export const whatsappMessagesRelations = relations(whatsappMessages, ({ one }) => ({
  user: one(users, {
    fields: [whatsappMessages.userId],
    references: [users.id],
  }),
  internalMessage: one(messages, {
    fields: [whatsappMessages.internalMessageId],
    references: [messages.id],
  }),
}));

export const systemAnnouncementsRelations = relations(systemAnnouncements, ({ one }) => ({
  creator: one(users, {
    fields: [systemAnnouncements.createdBy],
    references: [users.id],
  }),
}));

export const emergencyAlertsRelations = relations(emergencyAlerts, ({ one }) => ({
  creator: one(users, {
    fields: [emergencyAlerts.createdBy],
    references: [users.id],
  }),
}));

// Phase 4 Relations - Community & Social Learning Platform
export const forumCategoriesRelations = relations(forumCategories, ({ many }) => ({
  posts: many(forumPosts),
}));

export const forumPostsRelations = relations(forumPosts, ({ one, many }) => ({
  category: one(forumCategories, {
    fields: [forumPosts.categoryId],
    references: [forumCategories.id],
  }),
  author: one(users, {
    fields: [forumPosts.authorId],
    references: [users.id],
  }),
  lastReplyUser: one(users, {
    fields: [forumPosts.lastReplyBy],
    references: [users.id],
  }),
  moderator: one(users, {
    fields: [forumPosts.moderatedBy],
    references: [users.id],
  }),
  replies: many(forumReplies),
}));

export const forumRepliesRelations = relations(forumReplies, ({ one, many }) => ({
  post: one(forumPosts, {
    fields: [forumReplies.postId],
    references: [forumPosts.id],
  }),
  author: one(users, {
    fields: [forumReplies.authorId],
    references: [users.id],
  }),
  moderator: one(users, {
    fields: [forumReplies.moderatedBy],
    references: [users.id],
  }),
  // Self-reference for nested replies
  parentReply: one(forumReplies, {
    fields: [forumReplies.replyToId],
    references: [forumReplies.id],
  }),
  childReplies: many(forumReplies),
}));

export const studyGroupsRelations = relations(studyGroups, ({ one, many }) => ({
  creator: one(users, {
    fields: [studyGroups.createdBy],
    references: [users.id],
  }),
  memberships: many(studyGroupMemberships),
  chatMessages: many(groupChatMessages),
  learningSessions: many(peerLearningSessions),
}));

export const studyGroupMembershipsRelations = relations(studyGroupMemberships, ({ one }) => ({
  group: one(studyGroups, {
    fields: [studyGroupMemberships.groupId],
    references: [studyGroups.id],
  }),
  user: one(users, {
    fields: [studyGroupMemberships.userId],
    references: [users.id],
  }),
}));

export const groupChatMessagesRelations = relations(groupChatMessages, ({ one, many }) => ({
  group: one(studyGroups, {
    fields: [groupChatMessages.groupId],
    references: [studyGroups.id],
  }),
  sender: one(users, {
    fields: [groupChatMessages.senderId],
    references: [users.id],
  }),
  // Self-reference for reply functionality
  replyToMessage: one(groupChatMessages, {
    fields: [groupChatMessages.replyToMessageId],
    references: [groupChatMessages.id],
  }),
  replies: many(groupChatMessages),
}));

export const peerLearningSessionsRelations = relations(peerLearningSessions, ({ one }) => ({
  group: one(studyGroups, {
    fields: [peerLearningSessions.groupId],
    references: [studyGroups.id],
  }),
  host: one(users, {
    fields: [peerLearningSessions.hostId],
    references: [users.id],
  }),
}));

export const communityProfilesRelations = relations(communityProfiles, ({ one }) => ({
  user: one(users, {
    fields: [communityProfiles.userId],
    references: [users.id],
  }),
}));

export const achievementsRelations = relations(achievements, ({ many }) => ({
  userAchievements: many(userAchievements),
}));

export const userAchievementsRelations = relations(userAchievements, ({ one }) => ({
  user: one(users, {
    fields: [userAchievements.userId],
    references: [users.id],
  }),
  achievement: one(achievements, {
    fields: [userAchievements.achievementId],
    references: [achievements.id],
  }),
}));

export const contentVotesRelations = relations(contentVotes, ({ one }) => ({
  user: one(users, {
    fields: [contentVotes.userId],
    references: [users.id],
  }),
}));

// User Management & Authentication Relations
export const emailVerificationTokensRelations = relations(emailVerificationTokens, ({ one }) => ({
  user: one(users, {
    fields: [emailVerificationTokens.userId],
    references: [users.id],
  }),
}));

export const passwordResetTokensRelations = relations(passwordResetTokens, ({ one }) => ({
  user: one(users, {
    fields: [passwordResetTokens.userId],
    references: [users.id],
  }),
}));

export const userSessionsRelations = relations(userSessions, ({ one }) => ({
  user: one(users, {
    fields: [userSessions.userId],
    references: [users.id],
  }),
}));

export const loginAttemptsRelations = relations(loginAttempts, ({ one }) => ({
  user: one(users, {
    fields: [loginAttempts.userId],
    references: [users.id],
  }),
  session: one(userSessions, {
    fields: [loginAttempts.sessionId],
    references: [userSessions.id],
  }),
}));

export const twoFactorAuthRelations = relations(twoFactorAuth, ({ one }) => ({
  user: one(users, {
    fields: [twoFactorAuth.userId],
    references: [users.id],
  }),
}));

export const accountActivityLogsRelations = relations(accountActivityLogs, ({ one }) => ({
  user: one(users, {
    fields: [accountActivityLogs.userId],
    references: [users.id],
  }),
}));

export const userSettingsRelations = relations(userSettings, ({ one }) => ({
  user: one(users, {
    fields: [userSettings.userId],
    references: [users.id],
  }),
}));

export const registrationInvitationsRelations = relations(registrationInvitations, ({ one }) => ({
  invitedBy: one(users, {
    fields: [registrationInvitations.invitedByUserId],
    references: [users.id],
  }),
  usedBy: one(users, {
    fields: [registrationInvitations.usedByUserId],
    references: [users.id],
  }),
}));

// Schema Export - Complete with User Management System
export const schema = {
  // Core Tables
  users,
  students,
  instructors,
  admins,
  
  // User Management & Authentication System
  emailVerificationTokens,
  passwordResetTokens,
  userSessions,
  loginAttempts,
  twoFactorAuth,
  accountActivityLogs,
  userSettings,
  registrationInvitations,
  
  // Calendar & Time Tracking
  instructorCalendars,
  instructorTimeLogs,
  
  // Booking System
  bookings,
  lessons,
  bookingCancellations,
  
  // Phase 2: UK DVSA Theory Testing System
  ukTheoryCategories,
  ukTheoryQuestions,
  hazardPerceptionTests,
  studentTheoryProgress,
  mockTheoryTests,
  studySessions,
  studyReminders,
  aiReadinessAssessments,
  
  // Phase 3: Communication & Messaging System
  conversations,
  messages,
  messageReadStatus,
  notifications,
  notificationDeliveries,
  userCommunicationPreferences,
  whatsappMessages,
  systemAnnouncements,
  emergencyAlerts,
  
  // Phase 4: Community & Social Learning Platform
  forumCategories,
  forumPosts,
  forumReplies,
  studyGroups,
  studyGroupMemberships,
  groupChatMessages,
  peerLearningSessions,
  communityProfiles,
  achievements,
  userAchievements,
  contentVotes,
  
  // Relations
  usersRelations,
  studentsRelations,
  instructorsRelations,
  leadsRelations,
  adminsRelations,
  bookingsRelations,
  lessonsRelations,
  // Phase 2 Relations
  ukTheoryCategoriesRelations,
  ukTheoryQuestionsRelations,
  studentTheoryProgressRelations,
  mockTheoryTestsRelations,
  studySessionsRelations,
  studyRemindersRelations,
  aiReadinessAssessmentsRelations,
  // Phase 3 Relations
  conversationsRelations,
  messagesRelations,
  messageReadStatusRelations,
  notificationsRelations,
  notificationDeliveriesRelations,
  userCommunicationPreferencesRelations,
  whatsappMessagesRelations,
  systemAnnouncementsRelations,
  emergencyAlertsRelations,
  // Phase 4 Relations
  forumCategoriesRelations,
  forumPostsRelations,
  forumRepliesRelations,
  studyGroupsRelations,
  studyGroupMembershipsRelations,
  groupChatMessagesRelations,
  peerLearningSessionsRelations,
  communityProfilesRelations,
  achievementsRelations,
  userAchievementsRelations,
  contentVotesRelations,
  // User Management Relations
  emailVerificationTokensRelations,
  passwordResetTokensRelations,
  userSessionsRelations,
  loginAttemptsRelations,
  twoFactorAuthRelations,
  accountActivityLogsRelations,
  userSettingsRelations,
  registrationInvitationsRelations,
};

