# 🚗 UPDATED DATABASE FLOW MAP - PLATFORM AS A SERVICE
## With DVLA Theory Testing & Community Features

Based on your preferences:
- **Student-Instructor:** Flexible (Admin assigns available instructors to students)
- **Lesson Packages:** Advanced backend management, frontend display only
- **Group Lessons:** Individual only
- **Recurring Lessons:** Automatic with manual override
- **Location Management:** Simple, non-mandatory
- **New Features:** DVLA Theory Testing + Community Platform

---

## 🏗️ UPDATED CORE SYSTEM MODULES

### **1️⃣ PLATFORM MANAGEMENT MODULE**
**Purpose:** Multi-tenant platform configuration and instructor-student matching

**Tables:**
```sql
platform_settings (Platform Configuration)
- id, setting_key, setting_value (JSON), category, is_public, timestamps

instructor_student_assignments (Flexible Matching System)
- id, student_id, instructor_id, assigned_by (admin), assignment_type
- status, priority_level, assignment_date, end_date, notes

lesson_packages (Advanced Package Management)
- id, package_name, package_type, total_lessons, duration, price
- discount_percentage, validity_days, is_active, target_audience (JSON)
- instructor_id (NULL for platform-wide), created_by (admin)

student_packages (Package Purchases & Tracking)
- id, student_id, package_id, instructor_id, lessons_remaining
- purchase_date, expiry_date, total_paid, status
```

**Relationships:**
- `students` ↔ `instructors` (Many-to-Many via assignments)
- `lesson_packages` ↔ `students` (Many-to-Many via student_packages)
- `users(admin)` → `instructor_student_assignments` (assignments)

---

### **2️⃣ DVLA THEORY TESTING MODULE** 🆕
**Purpose:** Official DVLA theory practice and mock testing system

**Tables:**
```sql
theory_categories (DVLA Categories)
- id, category_code ('HC', 'RS', 'VS'), category_name, description
- question_count, is_active, display_order

theory_questions (Official Question Bank)
- id, category_id, question_text, question_image, question_video
- question_type (multiple_choice, hazard_perception, case_study)
- options (JSON), correct_answer, explanation, difficulty_level
- dvla_reference, tags (JSON), is_active

mock_tests (Practice Sessions)
- id, student_id, test_type, test_name, total_questions, time_limit
- passing_score, status, score, percentage, time_taken, passed
- started_at, completed_at

mock_test_answers (Student Responses)
- id, test_id, question_id, student_answer, is_correct
- time_spent, answered_at

theory_progress (Learning Analytics)
- id, student_id, category_id, questions_attempted, questions_correct
- accuracy_percentage, average_time_per_question
- weak_areas (JSON), strong_areas (JSON), last_practiced
```

**Relationships:**
- `theory_categories` → `theory_questions` (One-to-Many)
- `students` → `mock_tests` (One-to-Many)
- `mock_tests` ↔ `theory_questions` (Many-to-Many via mock_test_answers)
- `students` ↔ `theory_categories` (Many-to-Many via theory_progress)

---

### **3️⃣ COMMUNITY PLATFORM MODULE** 🆕
**Purpose:** Social learning platform with forums and user-generated content

**Tables:**
```sql
community_forums (Discussion Categories)
- id, forum_name, description, forum_type
- is_public, requires_approval, moderator_ids (JSON)
- display_order, is_active

community_posts (User-Generated Content)
- id, forum_id, author_id, title, content, post_type
- is_pinned, is_approved, view_count, like_count, reply_count
- tags (JSON), attachments (JSON)

community_replies (Post Responses)
- id, post_id, author_id, parent_reply_id (nested replies)
- content, is_approved, like_count, is_solution
- attachments (JSON)

community_interactions (Social Engagement)
- id, user_id, target_type (post/reply), target_id
- interaction_type (like, dislike, report, bookmark)

user_achievements (Gamification)
- id, user_id, achievement_type, achievement_name, description
- points_awarded, badge_icon, earned_at
```

**Relationships:**
- `community_forums` → `community_posts` (One-to-Many)
- `community_posts` → `community_replies` (One-to-Many)
- `community_replies` → `community_replies` (Self-referencing for nested replies)
- `users` ↔ `community_posts/replies` (Many-to-Many via community_interactions)
- `users` → `user_achievements` (One-to-Many)

---

### **4️⃣ UPDATED BOOKING MODULE**
**Purpose:** Individual lessons with automatic recurring and package integration

**Tables:**
```sql
bookings (Individual Lessons Only)
- id, student_id, instructor_id, lesson_type, booking_date, start_time
- duration, status, location (simple text), notes
- package_id (if from package), is_recurring_generated

recurring_schedules (Automatic Scheduling)
- id, student_id, instructor_id, lesson_type
- recurrence_pattern (weekly, bi_weekly, monthly)
- day_of_week, time_slot, duration, start_date, end_date
- is_active, auto_confirm, max_advance_bookings

generated_bookings (Auto-created Bookings)
- id, recurring_schedule_id, booking_id, generation_date
- is_confirmed, student_notified, instructor_notified

lesson_feedback (Post-lesson Reviews)
- id, booking_id, instructor_feedback, student_feedback
- instructor_rating, student_rating, areas_improved
- next_focus_areas, created_at
```

**Relationships:**
- `students` + `instructors` → `bookings` (via assignments)
- `recurring_schedules` → `generated_bookings` → `bookings`
- `student_packages` → `bookings` (package lesson tracking)
- `bookings` → `lesson_feedback` (One-to-One)

---

### **5️⃣ USER MANAGEMENT MODULE (UPDATED)**
**Purpose:** Multi-role user system with platform-specific roles

**Tables:**
```sql
users (Base User System)
- id, email, password_hash, first_name, last_name, phone
- role (admin, instructor, student), email_verified, phone_verified
- avatar_url, is_active, last_login, preferences (JSON)

students (Extended Student Profile)
- id, user_id, license_type, experience_level, theory_test_passed
- practical_test_date, medical_conditions, emergency_contact
- preferred_areas (JSON), learning_goals, current_instructor_ids (JSON)

instructors (Extended Instructor Profile)
- id, user_id, license_number, specializations (JSON)
- hourly_rate, availability_schedule (JSON), bio
- vehicle_details (JSON), certifications (JSON)
- areas_covered (JSON), max_students_capacity

admins (Platform Administrators)
- id, user_id, permission_level, department
- can_assign_instructors, can_manage_packages, can_moderate_community
```

**Relationships:**
- `users` → `students/instructors/admins` (One-to-One inheritance)
- `instructor_student_assignments` connects students to instructors flexibly

---

### **6️⃣ COMMUNICATION MODULE (UPDATED)**
**Purpose:** Multi-channel notifications and community messaging

**Tables:**
```sql
messages (Internal Messaging + Community)
- id, sender_id, recipient_id, message_type
- subject, content, thread_id, read_at, is_system_message
- related_booking_id, related_community_post_id

notifications (Multi-channel System)
- id, user_id, notification_type, title, content
- channels (JSON: email, sms, whatsapp, push, internal)
- delivery_status (JSON), priority_level
- related_entity_type, related_entity_id
- scheduled_for, sent_at, read_at

notification_templates (Dynamic Templates)
- id, template_name, template_type, subject_template
- content_template, channels_enabled (JSON)
- variables (JSON), is_active
```

---

### **7️⃣ FINANCIAL MODULE (UPDATED)**
**Purpose:** Package-based payments and instructor earnings

**Tables:**
```sql
payments (Package & Lesson Payments)
- id, student_id, instructor_id, amount, payment_type
- payment_method, payment_status, currency
- package_id, booking_id, stripe_payment_intent_id
- metadata (JSON), processed_at

invoices (Automated Billing)
- id, student_id, instructor_id, invoice_number
- total_amount, tax_amount, discount_amount
- items (JSON), status, due_date, paid_at

instructor_earnings (Automated Calculations)
- id, instructor_id, period_start, period_end
- total_lessons, total_earnings, platform_fee
- package_earnings, individual_lesson_earnings
- payout_status, payout_date
```

---

### **8️⃣ ANALYTICS MODULE (UPDATED)**
**Purpose:** Platform-wide analytics including theory testing and community

**Tables:**
```sql
platform_analytics (Overall Metrics)
- id, metric_name, metric_value, metric_type
- date_recorded, additional_data (JSON)

student_progress (Comprehensive Tracking)
- id, student_id, total_lessons, theory_progress_percentage
- practical_skills_level, community_participation_score
- last_lesson_date, next_milestone, improvement_areas (JSON)

theory_analytics (DVLA Testing Metrics)
- id, student_id, category_id, total_attempts, best_score
- average_score, time_spent_studying, weak_topics (JSON)
- predicted_pass_probability, last_practice_date

community_analytics (Social Engagement)
- id, user_id, posts_created, replies_made, likes_received
- helpful_answers_count, reputation_score, badges_earned
- community_level, participation_streak_days
```

---

## 🔄 UPDATED KEY DATA FLOWS

### **📊 Student Journey Flow (Platform-as-a-Service)**
```
1. Student Registration → Admin Review → Account Activation
2. Admin assigns available instructor(s) → Assignment created
3. Student can book lessons with assigned instructor(s)
4. Option to purchase lesson packages (managed by admin)
5. Automatic recurring lessons + manual booking capability
6. Access to DVLA theory testing throughout journey
7. Community participation for peer learning
8. Progress tracking across practical + theory + community
```

### **📊 DVLA Theory Testing Flow**
```
1. Student accesses theory section
2. Selects category or full mock test
3. Questions served from official DVLA bank
4. Real-time scoring and time tracking
5. Results saved → Progress analytics updated
6. Weak areas identified → Study recommendations
7. Achievement badges for milestones
8. Community sharing of progress/tips
```

### **📊 Community Engagement Flow**
```
1. User creates post in relevant forum
2. Content moderation (if required)
3. Community interaction (likes, replies, bookmarks)
4. Points awarded for quality participation
5. Achievement system → Badge progression
6. Reputation building → Community status
7. Integration with learning progress
```

### **📊 Package Management Flow (Admin-Controlled)**
```
1. Admin creates lesson packages (backend only)
2. Packages displayed on frontend for students
3. Student purchases package → Payment processed
4. Package linked to assigned instructor
5. Lessons automatically deducted from package
6. Expiry and usage tracking
7. Renewal notifications when needed
```

---

## 🎯 CRITICAL IMPLEMENTATION NOTES

### **🔧 Platform Configuration**
- Multi-tenant settings stored in `platform_settings`
- JSON fields for flexible configuration
- Admin-controlled feature flags

### **🎯 Flexible Assignment System**
- Students can have multiple instructors
- Admin controls all assignments
- Priority-based scheduling
- Temporary assignments supported

### **📚 DVLA Integration**
- Official question categories and references
- Comprehensive progress tracking
- Adaptive learning recommendations
- Mock test simulation environment

### **👥 Community Features**
- Forum-based discussions
- Moderation system
- Gamification with achievements
- Social learning encouragement

### **🔄 Recurring Automation**
- Automatic lesson generation
- Configurable advance booking limits
- Manual override capabilities
- Smart conflict detection

---

**🚀 This updated design supports all your requirements plus the new DVLA and Community features!**

Ready to implement this comprehensive schema? The next step is creating the actual database schema file with all these tables and relationships! 🎯