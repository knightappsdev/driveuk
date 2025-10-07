CREATE TYPE "public"."achievement_type" AS ENUM('study_streak', 'test_pass', 'community_helper', 'knowledge_master', 'milestone');--> statement-breakpoint
CREATE TYPE "public"."adi_grade" AS ENUM('grade_4', 'grade_5', 'grade_6', 'trainee');--> statement-breakpoint
CREATE TYPE "public"."booking_status" AS ENUM('pending', 'confirmed', 'completed', 'cancelled', 'no_show');--> statement-breakpoint
CREATE TYPE "public"."cancellation_reason" AS ENUM('instructor_sick', 'student_emergency', 'vehicle_breakdown', 'weather', 'other');--> statement-breakpoint
CREATE TYPE "public"."content_moderation" AS ENUM('approved', 'pending', 'flagged', 'rejected');--> statement-breakpoint
CREATE TYPE "public"."conversation_type" AS ENUM('direct', 'group', 'system', 'support');--> statement-breakpoint
CREATE TYPE "public"."difficulty_level" AS ENUM('foundation', 'intermediate', 'advanced');--> statement-breakpoint
CREATE TYPE "public"."forum_category" AS ENUM('general_discussion', 'theory_test_help', 'practical_test_tips', 'instructor_reviews', 'study_groups', 'pass_stories', 'driving_tips', 'test_center_reviews', 'uk_driving_rules');--> statement-breakpoint
CREATE TYPE "public"."fuel_type" AS ENUM('petrol', 'diesel', 'hybrid', 'electric');--> statement-breakpoint
CREATE TYPE "public"."hazard_type" AS ENUM('developing', 'static', 'moving', 'environmental', 'behavioral');--> statement-breakpoint
CREATE TYPE "public"."lesson_type" AS ENUM('practical', 'theory_support', 'mock_test', 'intensive', 'assessment');--> statement-breakpoint
CREATE TYPE "public"."license_type" AS ENUM('provisional', 'full_manual', 'full_automatic', 'none');--> statement-breakpoint
CREATE TYPE "public"."membership_status" AS ENUM('pending', 'active', 'inactive', 'banned');--> statement-breakpoint
CREATE TYPE "public"."message_status" AS ENUM('sent', 'delivered', 'read', 'failed');--> statement-breakpoint
CREATE TYPE "public"."message_type" AS ENUM('text', 'image', 'file', 'location', 'booking_update', 'lesson_feedback');--> statement-breakpoint
CREATE TYPE "public"."notification_channel" AS ENUM('internal', 'email', 'whatsapp', 'sms', 'push');--> statement-breakpoint
CREATE TYPE "public"."notification_type" AS ENUM('booking_confirmation', 'lesson_reminder', 'payment_due', 'theory_reminder', 'instructor_message', 'system_update', 'emergency_cancellation', 'rebook_available', 'test_ready', 'achievement');--> statement-breakpoint
CREATE TYPE "public"."payment_status" AS ENUM('pending', 'paid', 'failed', 'refunded', 'partial');--> statement-breakpoint
CREATE TYPE "public"."post_status" AS ENUM('draft', 'published', 'archived', 'reported', 'deleted');--> statement-breakpoint
CREATE TYPE "public"."question_type" AS ENUM('multiple_choice', 'hazard_perception', 'case_study');--> statement-breakpoint
CREATE TYPE "public"."study_group_type" AS ENUM('theory_focused', 'practical_focused', 'test_prep', 'general_support');--> statement-breakpoint
CREATE TYPE "public"."test_status" AS ENUM('not_started', 'in_progress', 'completed', 'abandoned');--> statement-breakpoint
CREATE TYPE "public"."theory_category" AS ENUM('ALERTNESS', 'ATTITUDE', 'SAFETY_AND_YOUR_VEHICLE', 'SAFETY_MARGINS', 'HAZARD_AWARENESS', 'VULNERABLE_ROAD_USERS', 'OTHER_TYPES_OF_VEHICLE', 'VEHICLE_SAFETY', 'VEHICLE_LOADING', 'INCIDENTS_ACCIDENTS_EMERGENCIES', 'VEHICLE_HANDLING', 'MOTORWAY_RULES', 'RULES_OF_THE_ROAD', 'ROAD_AND_TRAFFIC_SIGNS', 'DOCUMENTS');--> statement-breakpoint
CREATE TYPE "public"."transmission_type" AS ENUM('manual', 'automatic', 'both');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('admin', 'instructor', 'student');--> statement-breakpoint
CREATE TABLE "account_activity_logs" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"activity_type" varchar(50) NOT NULL,
	"description" text NOT NULL,
	"ip_address" varchar(45),
	"user_agent" text,
	"metadata" json,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "achievements" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"description" text NOT NULL,
	"achievement_type" "achievement_type" NOT NULL,
	"icon" varchar(100) NOT NULL,
	"badge_color" varchar(7) DEFAULT '#FFD700',
	"criteria" json NOT NULL,
	"points_awarded" integer NOT NULL,
	"is_active" boolean DEFAULT true,
	"rarity_level" varchar(20) DEFAULT 'common',
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "admins" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"admin_level" integer DEFAULT 1,
	"can_assign_instructors" boolean DEFAULT true,
	"can_manage_packages" boolean DEFAULT true,
	"can_view_analytics" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "admins_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE "ai_readiness_assessments" (
	"id" serial PRIMARY KEY NOT NULL,
	"student_id" integer NOT NULL,
	"assessment_date" timestamp DEFAULT now(),
	"overall_readiness_score" numeric(5, 2) NOT NULL,
	"category_scores" json NOT NULL,
	"weakest_categories" json NOT NULL,
	"strongest_categories" json NOT NULL,
	"recommended_study_hours" integer NOT NULL,
	"suggested_test_date" date,
	"improvement_plan" json,
	"confidence_level" varchar(50) NOT NULL,
	"is_ready_for_official_test" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "booking_cancellations" (
	"id" serial PRIMARY KEY NOT NULL,
	"booking_id" integer NOT NULL,
	"cancelled_by" varchar(20) NOT NULL,
	"cancellation_reason" "cancellation_reason" NOT NULL,
	"reason_details" text,
	"cancellation_date" timestamp DEFAULT now(),
	"refund_amount" numeric(8, 2),
	"refund_status" "payment_status" DEFAULT 'pending',
	"rescheduled" boolean DEFAULT false,
	"new_booking_id" integer,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "bookings" (
	"id" serial PRIMARY KEY NOT NULL,
	"student_id" integer NOT NULL,
	"instructor_id" integer NOT NULL,
	"lesson_type" "lesson_type" NOT NULL,
	"scheduled_date" date NOT NULL,
	"scheduled_time" varchar(10) NOT NULL,
	"duration" integer NOT NULL,
	"pickup_location" varchar(255),
	"dropoff_location" varchar(255),
	"lesson_focus" text,
	"status" "booking_status" DEFAULT 'pending',
	"payment_status" "payment_status" DEFAULT 'pending',
	"total_amount" numeric(8, 2) NOT NULL,
	"paid_amount" numeric(8, 2) DEFAULT '0.00',
	"booking_notes" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "community_profiles" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"display_name" varchar(100),
	"bio" text,
	"location" varchar(100),
	"test_status" varchar(50),
	"study_goals" json,
	"helpfulness_score" integer DEFAULT 0,
	"reputation_points" integer DEFAULT 0,
	"badges_earned" json,
	"preferred_study_times" json,
	"learning_style" varchar(50),
	"strong_categories" json,
	"mentor_available" boolean DEFAULT false,
	"is_verified" boolean DEFAULT false,
	"total_posts" integer DEFAULT 0,
	"total_helpful_answers" integer DEFAULT 0,
	"joined_communities_count" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "community_profiles_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE "content_votes" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"content_type" varchar(20) NOT NULL,
	"content_id" integer NOT NULL,
	"vote_type" varchar(10) NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "conversations" (
	"id" serial PRIMARY KEY NOT NULL,
	"type" "conversation_type" NOT NULL,
	"title" varchar(200),
	"description" text,
	"participant_ids" json NOT NULL,
	"created_by" integer NOT NULL,
	"last_message_id" integer,
	"last_activity_at" timestamp DEFAULT now(),
	"is_active" boolean DEFAULT true,
	"conversation_meta" json,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "email_verification_tokens" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"token" varchar(255) NOT NULL,
	"expires_at" timestamp NOT NULL,
	"is_used" boolean DEFAULT false,
	"used_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "email_verification_tokens_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "emergency_alerts" (
	"id" serial PRIMARY KEY NOT NULL,
	"alert_type" varchar(50) NOT NULL,
	"title" varchar(200) NOT NULL,
	"message" text NOT NULL,
	"affected_users" json,
	"affected_areas" json,
	"severity" varchar(20) NOT NULL,
	"action_required" text,
	"is_active" boolean DEFAULT true,
	"resolved_at" timestamp,
	"created_by" integer NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "forum_categories" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"description" text NOT NULL,
	"category" "forum_category" NOT NULL,
	"icon" varchar(100),
	"color" varchar(7) DEFAULT '#3B82F6',
	"is_active" boolean DEFAULT true,
	"moderator_ids" json,
	"post_count" integer DEFAULT 0,
	"display_order" integer NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "forum_posts" (
	"id" serial PRIMARY KEY NOT NULL,
	"category_id" integer NOT NULL,
	"author_id" integer NOT NULL,
	"title" varchar(300) NOT NULL,
	"content" text NOT NULL,
	"content_type" varchar(20) DEFAULT 'markdown',
	"status" "post_status" DEFAULT 'published',
	"is_pinned" boolean DEFAULT false,
	"is_locked" boolean DEFAULT false,
	"tags" json,
	"upvotes" integer DEFAULT 0,
	"downvotes" integer DEFAULT 0,
	"reply_count" integer DEFAULT 0,
	"view_count" integer DEFAULT 0,
	"last_reply_at" timestamp,
	"last_reply_by" integer,
	"moderation_status" "content_moderation" DEFAULT 'approved',
	"moderated_by" integer,
	"moderated_at" timestamp,
	"moderation_reason" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "forum_replies" (
	"id" serial PRIMARY KEY NOT NULL,
	"post_id" integer NOT NULL,
	"author_id" integer NOT NULL,
	"content" text NOT NULL,
	"content_type" varchar(20) DEFAULT 'markdown',
	"reply_to_id" integer,
	"upvotes" integer DEFAULT 0,
	"downvotes" integer DEFAULT 0,
	"is_accepted_answer" boolean DEFAULT false,
	"moderation_status" "content_moderation" DEFAULT 'approved',
	"moderated_by" integer,
	"moderated_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "group_chat_messages" (
	"id" serial PRIMARY KEY NOT NULL,
	"group_id" integer NOT NULL,
	"sender_id" integer NOT NULL,
	"message_type" "message_type" NOT NULL,
	"content" text NOT NULL,
	"attachments" json,
	"reply_to_message_id" integer,
	"is_announcement" boolean DEFAULT false,
	"is_pinned" boolean DEFAULT false,
	"reactions" json,
	"is_deleted" boolean DEFAULT false,
	"deleted_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "hazard_perception_tests" (
	"id" serial PRIMARY KEY NOT NULL,
	"test_name" varchar(200) NOT NULL,
	"video_url" varchar(500) NOT NULL,
	"video_duration" integer NOT NULL,
	"hazard_type" "hazard_type" NOT NULL,
	"difficulty_level" "difficulty_level" NOT NULL,
	"scoring_window" json NOT NULL,
	"description" text,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "instructor_calendars" (
	"id" serial PRIMARY KEY NOT NULL,
	"instructor_id" integer NOT NULL,
	"calendar_name" varchar(200) DEFAULT 'Main Schedule',
	"timezone" varchar(50) DEFAULT 'Europe/London',
	"is_public" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "instructor_time_logs" (
	"id" serial PRIMARY KEY NOT NULL,
	"instructor_id" integer NOT NULL,
	"log_date" date NOT NULL,
	"activity_type" varchar(50) NOT NULL,
	"start_time" timestamp NOT NULL,
	"end_time" timestamp,
	"duration_minutes" integer,
	"total_earnings" numeric(10, 2),
	"instructor_notes" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "instructors" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"adi_badge_number" varchar(20) NOT NULL,
	"adi_grade" "adi_grade" NOT NULL,
	"years_experience" integer NOT NULL,
	"hourly_rate" numeric(8, 2) NOT NULL,
	"specialties" json NOT NULL,
	"instructor_summary" text,
	"weekly_availability" json,
	"base_city" varchar(100) NOT NULL,
	"whatsapp_number" varchar(20),
	"ethnicity" varchar(100),
	"religion" varchar(100),
	"car_make" varchar(50) NOT NULL,
	"car_model" varchar(50) NOT NULL,
	"car_year" integer NOT NULL,
	"car_type" "transmission_type" NOT NULL,
	"car_fuel_type" "fuel_type" NOT NULL,
	"vehicle_registration" varchar(10) NOT NULL,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "instructors_user_id_unique" UNIQUE("user_id"),
	CONSTRAINT "instructors_adi_badge_number_unique" UNIQUE("adi_badge_number")
);
--> statement-breakpoint
CREATE TABLE "lessons" (
	"id" serial PRIMARY KEY NOT NULL,
	"booking_id" integer NOT NULL,
	"student_id" integer NOT NULL,
	"instructor_id" integer NOT NULL,
	"actual_start_time" timestamp,
	"actual_end_time" timestamp,
	"actual_duration" integer,
	"skills_worked_on" json,
	"student_progress" json,
	"instructor_notes" text,
	"student_feedback" text,
	"instructor_rating" integer,
	"lesson_rating" integer,
	"areas_for_improvement" json,
	"next_lesson_focus" text,
	"is_completed" boolean DEFAULT false,
	"completed_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "lessons_booking_id_unique" UNIQUE("booking_id")
);
--> statement-breakpoint
CREATE TABLE "login_attempts" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" varchar(255) NOT NULL,
	"ip_address" varchar(45) NOT NULL,
	"user_agent" text,
	"is_successful" boolean NOT NULL,
	"failure_reason" varchar(100),
	"user_id" integer,
	"session_id" integer,
	"attempted_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "message_read_status" (
	"id" serial PRIMARY KEY NOT NULL,
	"message_id" integer NOT NULL,
	"user_id" integer NOT NULL,
	"read_at" timestamp DEFAULT now(),
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "messages" (
	"id" serial PRIMARY KEY NOT NULL,
	"conversation_id" integer NOT NULL,
	"sender_id" integer NOT NULL,
	"message_type" "message_type" NOT NULL,
	"content" text NOT NULL,
	"attachments" json,
	"reply_to_message_id" integer,
	"is_edited" boolean DEFAULT false,
	"edited_at" timestamp,
	"is_deleted" boolean DEFAULT false,
	"deleted_at" timestamp,
	"metadata" json,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "mock_theory_tests" (
	"id" serial PRIMARY KEY NOT NULL,
	"student_id" integer NOT NULL,
	"test_name" varchar(200) NOT NULL,
	"test_type" varchar(50) NOT NULL,
	"total_questions" integer NOT NULL,
	"questions_correct" integer,
	"score_percentage" numeric(5, 2),
	"time_spent" integer,
	"status" "test_status" DEFAULT 'not_started',
	"questions_data" json,
	"hazard_perception_score" integer,
	"overall_result" varchar(20),
	"started_at" timestamp,
	"completed_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "notification_deliveries" (
	"id" serial PRIMARY KEY NOT NULL,
	"notification_id" integer NOT NULL,
	"channel" "notification_channel" NOT NULL,
	"recipient_address" varchar(255) NOT NULL,
	"status" "message_status" NOT NULL,
	"attempts" integer DEFAULT 1,
	"last_attempt_at" timestamp DEFAULT now(),
	"delivered_at" timestamp,
	"failure_reason" text,
	"external_id" varchar(255),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "notifications" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"type" "notification_type" NOT NULL,
	"title" varchar(200) NOT NULL,
	"content" text NOT NULL,
	"action_url" varchar(500),
	"action_data" json,
	"priority" integer DEFAULT 1,
	"is_read" boolean DEFAULT false,
	"read_at" timestamp,
	"expires_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "password_reset_tokens" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"token" varchar(255) NOT NULL,
	"expires_at" timestamp NOT NULL,
	"is_used" boolean DEFAULT false,
	"used_at" timestamp,
	"ip_address" varchar(45),
	"user_agent" text,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "password_reset_tokens_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "peer_learning_sessions" (
	"id" serial PRIMARY KEY NOT NULL,
	"group_id" integer NOT NULL,
	"host_id" integer NOT NULL,
	"title" varchar(200) NOT NULL,
	"description" text,
	"session_type" varchar(50) NOT NULL,
	"scheduled_for" timestamp NOT NULL,
	"duration" integer NOT NULL,
	"max_participants" integer DEFAULT 10,
	"current_participants" integer DEFAULT 0,
	"meeting_link" varchar(500),
	"session_materials" json,
	"is_recurring" boolean DEFAULT false,
	"recurring_pattern" varchar(50),
	"status" varchar(20) DEFAULT 'scheduled',
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "registration_invitations" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" varchar(255) NOT NULL,
	"invite_token" varchar(255) NOT NULL,
	"invited_by_user_id" integer,
	"intended_role" "user_role" NOT NULL,
	"expires_at" timestamp NOT NULL,
	"is_used" boolean DEFAULT false,
	"used_at" timestamp,
	"used_by_user_id" integer,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "registration_invitations_invite_token_unique" UNIQUE("invite_token")
);
--> statement-breakpoint
CREATE TABLE "student_theory_progress" (
	"id" serial PRIMARY KEY NOT NULL,
	"student_id" integer NOT NULL,
	"category_id" integer NOT NULL,
	"questions_attempted" integer DEFAULT 0,
	"questions_correct" integer DEFAULT 0,
	"accuracy_percentage" numeric(5, 2) DEFAULT '0.00',
	"weak_areas" json,
	"strong_areas" json,
	"last_practice_date" timestamp,
	"total_practice_time" integer DEFAULT 0,
	"is_ready_for_test" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "students" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"license_type" "license_type" DEFAULT 'none',
	"theory_test_passed" boolean DEFAULT false,
	"theory_test_date" date,
	"practical_test_date" date,
	"practical_test_passed" boolean DEFAULT false,
	"emergency_contact" json,
	"medical_conditions" text,
	"learning_goals" json,
	"preferred_instructor_gender" varchar(20),
	"preferred_language" varchar(50) DEFAULT 'english',
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "students_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE "study_group_memberships" (
	"id" serial PRIMARY KEY NOT NULL,
	"group_id" integer NOT NULL,
	"user_id" integer NOT NULL,
	"status" "membership_status" DEFAULT 'pending',
	"role" varchar(20) DEFAULT 'member',
	"joined_at" timestamp DEFAULT now(),
	"last_active_at" timestamp DEFAULT now(),
	"contribution_score" integer DEFAULT 0,
	"study_streak" integer DEFAULT 0,
	"helpful_answers" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "study_groups" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(200) NOT NULL,
	"description" text NOT NULL,
	"group_type" "study_group_type" NOT NULL,
	"focus_categories" json,
	"max_members" integer DEFAULT 20,
	"current_members" integer DEFAULT 0,
	"is_public" boolean DEFAULT true,
	"requires_approval" boolean DEFAULT false,
	"created_by" integer NOT NULL,
	"moderator_ids" json,
	"meeting_schedule" json,
	"study_plan" json,
	"group_avatar" varchar(500),
	"invite_code" varchar(10),
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "study_groups_invite_code_unique" UNIQUE("invite_code")
);
--> statement-breakpoint
CREATE TABLE "study_reminders" (
	"id" serial PRIMARY KEY NOT NULL,
	"student_id" integer NOT NULL,
	"reminder_type" varchar(50) NOT NULL,
	"title" varchar(200) NOT NULL,
	"message" text NOT NULL,
	"scheduled_for" timestamp NOT NULL,
	"is_recurring" boolean DEFAULT false,
	"recurring_pattern" varchar(50),
	"category_focus" integer,
	"priority" integer DEFAULT 1,
	"is_active" boolean DEFAULT true,
	"sent_at" timestamp,
	"responded_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "study_sessions" (
	"id" serial PRIMARY KEY NOT NULL,
	"student_id" integer NOT NULL,
	"session_type" varchar(50) NOT NULL,
	"category_id" integer,
	"questions_attempted" integer NOT NULL,
	"questions_correct" integer NOT NULL,
	"session_duration" integer NOT NULL,
	"focus_areas" json,
	"improvement_notes" text,
	"next_session_recommendation" text,
	"confidence_level" integer,
	"session_started" timestamp NOT NULL,
	"session_ended" timestamp,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "system_announcements" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(200) NOT NULL,
	"content" text NOT NULL,
	"announcement_type" varchar(50) NOT NULL,
	"target_audience" json NOT NULL,
	"priority" integer DEFAULT 1,
	"show_until" timestamp,
	"is_active" boolean DEFAULT true,
	"created_by" integer NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "two_factor_auth" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"is_enabled" boolean DEFAULT false,
	"secret" varchar(32),
	"backup_codes" json,
	"last_used_at" timestamp,
	"enabled_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "two_factor_auth_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE "uk_theory_categories" (
	"id" serial PRIMARY KEY NOT NULL,
	"category_code" "theory_category" NOT NULL,
	"category_name" varchar(100) NOT NULL,
	"description" text NOT NULL,
	"total_questions" integer NOT NULL,
	"pass_requirement" integer NOT NULL,
	"is_active" boolean DEFAULT true,
	"display_order" integer NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "uk_theory_categories_category_code_unique" UNIQUE("category_code")
);
--> statement-breakpoint
CREATE TABLE "uk_theory_questions" (
	"id" serial PRIMARY KEY NOT NULL,
	"category_id" integer NOT NULL,
	"question_type" "question_type" NOT NULL,
	"difficulty_level" "difficulty_level" NOT NULL,
	"question_text" text NOT NULL,
	"question_image" varchar(500),
	"option_a" varchar(500) NOT NULL,
	"option_b" varchar(500) NOT NULL,
	"option_c" varchar(500),
	"option_d" varchar(500),
	"correct_answer" varchar(1) NOT NULL,
	"explanation" text NOT NULL,
	"official_reference" varchar(200),
	"is_active" boolean DEFAULT true,
	"times_asked" integer DEFAULT 0,
	"times_correct" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "user_achievements" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"achievement_id" integer NOT NULL,
	"earned_at" timestamp DEFAULT now(),
	"progress" json,
	"is_completed" boolean DEFAULT true,
	"notification_sent" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "user_communication_preferences" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"email_notifications" boolean DEFAULT true,
	"whatsapp_notifications" boolean DEFAULT true,
	"sms_notifications" boolean DEFAULT false,
	"push_notifications" boolean DEFAULT true,
	"internal_messages" boolean DEFAULT true,
	"booking_reminders" boolean DEFAULT true,
	"payment_reminders" boolean DEFAULT true,
	"theory_reminders" boolean DEFAULT true,
	"instructor_messages" boolean DEFAULT true,
	"system_updates" boolean DEFAULT true,
	"marketing_messages" boolean DEFAULT false,
	"quiet_hours_start" varchar(5) DEFAULT '22:00',
	"quiet_hours_end" varchar(5) DEFAULT '08:00',
	"timezone" varchar(50) DEFAULT 'Europe/London',
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "user_communication_preferences_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE "user_sessions" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"session_token" varchar(255) NOT NULL,
	"device_info" json,
	"ip_address" varchar(45) NOT NULL,
	"user_agent" text,
	"is_active" boolean DEFAULT true,
	"last_activity" timestamp DEFAULT now(),
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"revoked_at" timestamp,
	CONSTRAINT "user_sessions_session_token_unique" UNIQUE("session_token")
);
--> statement-breakpoint
CREATE TABLE "user_settings" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"theme" varchar(20) DEFAULT 'light',
	"language" varchar(10) DEFAULT 'en-GB',
	"date_format" varchar(20) DEFAULT 'DD/MM/YYYY',
	"time_format" varchar(10) DEFAULT '24h',
	"week_starts_on" integer DEFAULT 1,
	"auto_logout_minutes" integer DEFAULT 30,
	"show_online_status" boolean DEFAULT true,
	"allow_data_collection" boolean DEFAULT true,
	"marketing_emails" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "user_settings_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" varchar(255) NOT NULL,
	"password_hash" varchar(255) NOT NULL,
	"first_name" varchar(100) NOT NULL,
	"last_name" varchar(100) NOT NULL,
	"phone" varchar(20),
	"role" "user_role" NOT NULL,
	"city" varchar(100),
	"is_email_verified" boolean DEFAULT false,
	"is_phone_verified" boolean DEFAULT false,
	"is_active" boolean DEFAULT true,
	"is_blocked" boolean DEFAULT false,
	"email_verified_at" timestamp,
	"phone_verified_at" timestamp,
	"last_login_at" timestamp,
	"registration_ip" varchar(45),
	"last_login_ip" varchar(45),
	"profile_picture" varchar(500),
	"timezone" varchar(50) DEFAULT 'Europe/London',
	"locale" varchar(10) DEFAULT 'en-GB',
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "whatsapp_messages" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"whatsapp_number" varchar(20) NOT NULL,
	"message_direction" varchar(10) NOT NULL,
	"message_type" "message_type" NOT NULL,
	"content" text NOT NULL,
	"whatsapp_message_id" varchar(255),
	"status" "message_status" NOT NULL,
	"webhook_data" json,
	"internal_message_id" integer,
	"failure_reason" text,
	"delivered_at" timestamp,
	"read_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "whatsapp_messages_whatsapp_message_id_unique" UNIQUE("whatsapp_message_id")
);
--> statement-breakpoint
ALTER TABLE "account_activity_logs" ADD CONSTRAINT "account_activity_logs_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "admins" ADD CONSTRAINT "admins_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ai_readiness_assessments" ADD CONSTRAINT "ai_readiness_assessments_student_id_students_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."students"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "booking_cancellations" ADD CONSTRAINT "booking_cancellations_booking_id_bookings_id_fk" FOREIGN KEY ("booking_id") REFERENCES "public"."bookings"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "booking_cancellations" ADD CONSTRAINT "booking_cancellations_new_booking_id_bookings_id_fk" FOREIGN KEY ("new_booking_id") REFERENCES "public"."bookings"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_student_id_students_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."students"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_instructor_id_instructors_id_fk" FOREIGN KEY ("instructor_id") REFERENCES "public"."instructors"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "community_profiles" ADD CONSTRAINT "community_profiles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "content_votes" ADD CONSTRAINT "content_votes_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "conversations" ADD CONSTRAINT "conversations_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "email_verification_tokens" ADD CONSTRAINT "email_verification_tokens_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "emergency_alerts" ADD CONSTRAINT "emergency_alerts_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "forum_posts" ADD CONSTRAINT "forum_posts_category_id_forum_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."forum_categories"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "forum_posts" ADD CONSTRAINT "forum_posts_author_id_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "forum_posts" ADD CONSTRAINT "forum_posts_last_reply_by_users_id_fk" FOREIGN KEY ("last_reply_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "forum_posts" ADD CONSTRAINT "forum_posts_moderated_by_users_id_fk" FOREIGN KEY ("moderated_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "forum_replies" ADD CONSTRAINT "forum_replies_post_id_forum_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."forum_posts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "forum_replies" ADD CONSTRAINT "forum_replies_author_id_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "forum_replies" ADD CONSTRAINT "forum_replies_moderated_by_users_id_fk" FOREIGN KEY ("moderated_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "group_chat_messages" ADD CONSTRAINT "group_chat_messages_group_id_study_groups_id_fk" FOREIGN KEY ("group_id") REFERENCES "public"."study_groups"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "group_chat_messages" ADD CONSTRAINT "group_chat_messages_sender_id_users_id_fk" FOREIGN KEY ("sender_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "instructor_calendars" ADD CONSTRAINT "instructor_calendars_instructor_id_instructors_id_fk" FOREIGN KEY ("instructor_id") REFERENCES "public"."instructors"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "instructor_time_logs" ADD CONSTRAINT "instructor_time_logs_instructor_id_instructors_id_fk" FOREIGN KEY ("instructor_id") REFERENCES "public"."instructors"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "instructors" ADD CONSTRAINT "instructors_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lessons" ADD CONSTRAINT "lessons_booking_id_bookings_id_fk" FOREIGN KEY ("booking_id") REFERENCES "public"."bookings"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lessons" ADD CONSTRAINT "lessons_student_id_students_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."students"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lessons" ADD CONSTRAINT "lessons_instructor_id_instructors_id_fk" FOREIGN KEY ("instructor_id") REFERENCES "public"."instructors"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "login_attempts" ADD CONSTRAINT "login_attempts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "login_attempts" ADD CONSTRAINT "login_attempts_session_id_user_sessions_id_fk" FOREIGN KEY ("session_id") REFERENCES "public"."user_sessions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "message_read_status" ADD CONSTRAINT "message_read_status_message_id_messages_id_fk" FOREIGN KEY ("message_id") REFERENCES "public"."messages"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "message_read_status" ADD CONSTRAINT "message_read_status_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "messages" ADD CONSTRAINT "messages_conversation_id_conversations_id_fk" FOREIGN KEY ("conversation_id") REFERENCES "public"."conversations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "messages" ADD CONSTRAINT "messages_sender_id_users_id_fk" FOREIGN KEY ("sender_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mock_theory_tests" ADD CONSTRAINT "mock_theory_tests_student_id_students_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."students"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notification_deliveries" ADD CONSTRAINT "notification_deliveries_notification_id_notifications_id_fk" FOREIGN KEY ("notification_id") REFERENCES "public"."notifications"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "peer_learning_sessions" ADD CONSTRAINT "peer_learning_sessions_group_id_study_groups_id_fk" FOREIGN KEY ("group_id") REFERENCES "public"."study_groups"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "peer_learning_sessions" ADD CONSTRAINT "peer_learning_sessions_host_id_users_id_fk" FOREIGN KEY ("host_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "registration_invitations" ADD CONSTRAINT "registration_invitations_invited_by_user_id_users_id_fk" FOREIGN KEY ("invited_by_user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "registration_invitations" ADD CONSTRAINT "registration_invitations_used_by_user_id_users_id_fk" FOREIGN KEY ("used_by_user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "student_theory_progress" ADD CONSTRAINT "student_theory_progress_student_id_students_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."students"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "student_theory_progress" ADD CONSTRAINT "student_theory_progress_category_id_uk_theory_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."uk_theory_categories"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "students" ADD CONSTRAINT "students_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "study_group_memberships" ADD CONSTRAINT "study_group_memberships_group_id_study_groups_id_fk" FOREIGN KEY ("group_id") REFERENCES "public"."study_groups"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "study_group_memberships" ADD CONSTRAINT "study_group_memberships_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "study_groups" ADD CONSTRAINT "study_groups_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "study_reminders" ADD CONSTRAINT "study_reminders_student_id_students_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."students"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "study_reminders" ADD CONSTRAINT "study_reminders_category_focus_uk_theory_categories_id_fk" FOREIGN KEY ("category_focus") REFERENCES "public"."uk_theory_categories"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "study_sessions" ADD CONSTRAINT "study_sessions_student_id_students_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."students"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "study_sessions" ADD CONSTRAINT "study_sessions_category_id_uk_theory_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."uk_theory_categories"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "system_announcements" ADD CONSTRAINT "system_announcements_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "two_factor_auth" ADD CONSTRAINT "two_factor_auth_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "uk_theory_questions" ADD CONSTRAINT "uk_theory_questions_category_id_uk_theory_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."uk_theory_categories"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_achievements" ADD CONSTRAINT "user_achievements_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_achievements" ADD CONSTRAINT "user_achievements_achievement_id_achievements_id_fk" FOREIGN KEY ("achievement_id") REFERENCES "public"."achievements"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_communication_preferences" ADD CONSTRAINT "user_communication_preferences_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_sessions" ADD CONSTRAINT "user_sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_settings" ADD CONSTRAINT "user_settings_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "whatsapp_messages" ADD CONSTRAINT "whatsapp_messages_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "whatsapp_messages" ADD CONSTRAINT "whatsapp_messages_internal_message_id_messages_id_fk" FOREIGN KEY ("internal_message_id") REFERENCES "public"."messages"("id") ON DELETE no action ON UPDATE no action;