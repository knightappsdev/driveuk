# 🇬🇧 UK DVSA THEORY TESTING & DRIVING SIMULATOR SCHEMA
## Complete Database Design for UK Driving Platform

### 📚 OFFICIAL UK DVSA THEORY TEST TOPICS

#### **1️⃣ Core Theory Categories (Official DVSA)**
```sql
theory_categories:
- 'ALERTNESS' → Awareness and anticipation
- 'ATTITUDE' → Courtesy, consideration, and road rage
- 'SAFETY_AND_YOUR_VEHICLE' → Fault detection, defects, safety equipment, emissions
- 'SAFETY_MARGINS' → Stopping distances, speed limits, weather conditions
- 'HAZARD_AWARENESS' → Static and developing hazards, environmental factors
- 'VULNERABLE_ROAD_USERS' → Pedestrians, cyclists, motorcyclists, horse riders
- 'OTHER_TYPES_OF_VEHICLE' → Motorcycles, lorries, buses, emergency vehicles
- 'VEHICLE_SAFETY' → Seat belts, head restraints, children in vehicles
- 'VEHICLE_LOADING' → Principles of loading, roof racks, trailers
- 'INCIDENTS_ACCIDENTS_EMERGENCIES' → Breakdowns, accidents, first aid
- 'VEHICLE_HANDLING' → Weather conditions, time of day, vehicle characteristics
- 'MOTORWAY_RULES' → Speed limits, lane discipline, stopping, parking
- 'RULES_OF_THE_ROAD' → Speed limits, stopping procedures, lighting requirements
- 'ROAD_AND_TRAFFIC_SIGNS' → Warning signs, regulatory signs, information signs
- 'DOCUMENTS' → Licence requirements, insurance, MOT, registration documents
```

#### **2️⃣ Hazard Perception Test Components**
```sql
hazard_perception_categories:
- 'DEVELOPING_HAZARDS' → Situations that may require driver response
- 'STATIC_HAZARDS' → Parked cars, road works, sharp bends
- 'MOVING_HAZARDS' → Other vehicles, pedestrians, cyclists
- 'ENVIRONMENTAL_HAZARDS' → Weather, road surface, visibility
- 'BEHAVIORAL_HAZARDS' → Aggressive drivers, impaired drivers
```

#### **3️⃣ Active Driving Simulator Scenarios**
```sql
simulator_scenarios:
- 'URBAN_DRIVING' → City center navigation, pedestrian areas
- 'RURAL_DRIVING' → Country roads, single track roads, farm vehicles  
- 'MOTORWAY_DRIVING' → Joining, leaving, lane changing, services
- 'NIGHT_DRIVING' → Reduced visibility, headlight use, fatigue
- 'ADVERSE_WEATHER' → Rain, snow, ice, fog, wind
- 'EMERGENCY_SITUATIONS' → Breakdown procedures, accident response
- 'PARKING_MANEUVERS' → Parallel, bay, reverse, hill starts
- 'ROUNDABOUTS' → Mini, large, multi-lane, traffic lights
- 'DUAL_CARRIAGEWAYS' → Overtaking, slip roads, speed management
- 'SCHOOL_ZONES' → Speed limits, crossing patrols, children
```

---

## 🚗 UK-SPECIFIC INSTRUCTOR DATABASE SCHEMA

### **Enhanced Instructors Table (UK-Focused)**
```sql
instructors (UK Driving Instructors):
- id (PK)
- user_id (FK) → users
- adi_badge_number (VARCHAR) → Approved Driving Instructor number
- adi_grade (ENUM) → 'grade_4', 'grade_5', 'grade_6' (DVSA grading)
- years_experience (INTEGER) → Total teaching years
- hourly_rate (DECIMAL) → £ per hour
- specialities (JSON) → ['manual', 'automatic', 'intensive', 'test_prep', 'refresher', 'nervous_drivers', 'elderly_drivers']
- instructor_summary (TEXT) → Professional bio/description
- weekly_availability (JSON) → Detailed schedule per day
- base_city (VARCHAR) → Primary operating city
- coverage_areas (JSON) → Array of postcodes/areas covered
- whatsapp_number (VARCHAR) → WhatsApp contact
- ethnicity (VARCHAR) → For matching preferences
- religion (VARCHAR) → For cultural considerations  
- car_make (VARCHAR) → Vehicle manufacturer
- car_model (VARCHAR) → Vehicle model
- car_year (INTEGER) → Vehicle year
- car_transmission (ENUM) → 'manual', 'automatic', 'both'
- car_fuel_type (ENUM) → 'petrol', 'diesel', 'hybrid', 'electric'
- dual_controls (BOOLEAN) → Safety equipment
- vehicle_registration (VARCHAR) → UK reg number
- insurance_valid_until (DATE) → Coverage expiry
- mot_valid_until (DATE) → MOT certificate expiry
- is_female_instructor (BOOLEAN) → For student preferences
- languages_spoken (JSON) → ['english', 'urdu', 'hindi', 'polish', etc.]
- emergency_contact (JSON) → Name, phone, relationship
```

---

## 📅 COMPREHENSIVE CALENDAR & DIARY SYSTEM

### **1️⃣ Instructor Calendar Tables**
```sql
instructor_calendars (Master Calendar):
- id (PK)
- instructor_id (FK) → instructors
- calendar_name (VARCHAR) → "Main Schedule", "Holiday Calendar"
- is_default (BOOLEAN)
- timezone (VARCHAR) → 'Europe/London'
- color_code (VARCHAR) → UI calendar color
- is_public (BOOLEAN) → Student visibility
- created_at, updated_at

instructor_availability_templates (Weekly Templates):
- id (PK)
- instructor_id (FK) → instructors
- template_name (VARCHAR) → "Summer Schedule", "Winter Schedule"
- monday_start (TIME), monday_end (TIME), monday_available (BOOLEAN)
- tuesday_start (TIME), tuesday_end (TIME), tuesday_available (BOOLEAN)
- wednesday_start (TIME), wednesday_end (TIME), wednesday_available (BOOLEAN)
- thursday_start (TIME), thursday_end (TIME), thursday_available (BOOLEAN)
- friday_start (TIME), friday_end (TIME), friday_available (BOOLEAN)
- saturday_start (TIME), saturday_end (TIME), saturday_available (BOOLEAN)
- sunday_start (TIME), sunday_end (TIME), sunday_available (BOOLEAN)
- break_times (JSON) → Array of lunch/break periods
- is_active (BOOLEAN)

instructor_availability_overrides (Specific Date Changes):
- id (PK)
- instructor_id (FK) → instructors
- override_date (DATE)
- is_available (BOOLEAN)
- start_time (TIME)
- end_time (TIME)
- reason (VARCHAR) → 'holiday', 'sick', 'training', 'personal'
- notes (TEXT)

instructor_time_blocks (Detailed Time Management):
- id (PK)
- instructor_id (FK) → instructors
- block_date (DATE)
- start_time (TIME)
- end_time (TIME)
- block_type (ENUM) → 'lesson', 'break', 'admin', 'travel', 'unavailable'
- booking_id (FK) → bookings (if lesson)
- status (ENUM) → 'available', 'booked', 'blocked', 'tentative'
- location (VARCHAR) → Pickup/lesson location
- notes (TEXT)
```

### **2️⃣ Time Tracking System**
```sql
instructor_time_logs (Comprehensive Time Tracking):
- id (PK)
- instructor_id (FK) → instructors
- log_date (DATE)
- activity_type (ENUM) → 'lesson', 'admin', 'travel', 'marketing', 'training'
- start_time (TIMESTAMP)
- end_time (TIMESTAMP)
- duration_minutes (INTEGER) → Auto-calculated
- booking_id (FK) → bookings (if lesson-related)
- student_id (FK) → students (if applicable)
- location_from (VARCHAR) → Starting location
- location_to (VARCHAR) → Ending location
- mileage (DECIMAL) → For expense tracking
- fuel_cost (DECIMAL) → Travel expenses
- activity_description (TEXT)
- billable_time (INTEGER) → Actual teaching time
- break_time (INTEGER) → Rest periods during activity
- is_verified (BOOLEAN) → Confirmed by system/student

instructor_daily_summaries (Daily Analytics):
- id (PK)
- instructor_id (FK) → instructors
- summary_date (DATE)
- total_lessons (INTEGER)
- total_teaching_hours (DECIMAL)
- total_travel_time (INTEGER) → Minutes
- total_admin_time (INTEGER) → Minutes
- total_earnings (DECIMAL) → £ for the day
- total_mileage (DECIMAL)
- total_fuel_cost (DECIMAL)
- lessons_completed (INTEGER)
- lessons_cancelled (INTEGER)
- no_shows (INTEGER)
- student_satisfaction_avg (DECIMAL) → Average rating for day
- notes (TEXT) → End of day notes

instructor_working_patterns (Pattern Analysis):
- id (PK)
- instructor_id (FK) → instructors
- pattern_period (ENUM) → 'weekly', 'monthly', 'quarterly'
- period_start (DATE)
- period_end (DATE)
- average_hours_per_day (DECIMAL)
- busiest_day_of_week (VARCHAR)
- busiest_time_of_day (TIME)
- peak_season_months (JSON) → Array of busy months
- preferred_lesson_duration (INTEGER) → Most common lesson length
- travel_efficiency_score (DECIMAL) → Mileage vs earnings ratio
- student_retention_rate (DECIMAL) → Percentage
- cancellation_rate (DECIMAL) → Percentage
```

---

## 🧪 ENHANCED UK DVSA THEORY TESTING SYSTEM

### **Theory Questions with UK Specifics**
```sql
uk_theory_questions (Official DVSA Question Bank):
- id (PK)
- category_id (FK) → theory_categories
- question_text (TEXT)
- question_image (VARCHAR) → UK road signs, scenarios
- question_video (VARCHAR) → Hazard perception clips
- question_type (ENUM) → 'multiple_choice', 'hazard_perception', 'case_study'
- uk_specific_context (BOOLEAN) → UK laws/rules specific
- difficulty_level (ENUM) → 'foundation', 'intermediate', 'advanced'
- dvsa_reference_code (VARCHAR) → Official DVSA reference
- highway_code_reference (VARCHAR) → Rule numbers
- last_updated (DATE) → For keeping current with law changes
- pass_rate_percentage (DECIMAL) → Historical success rate
- common_wrong_answers (JSON) → Most selected incorrect options
- explanation_text (TEXT) → Why the answer is correct
- related_topics (JSON) → Connected subject areas
- scenario_location (VARCHAR) → 'urban', 'rural', 'motorway', 'residential'

hazard_perception_videos (UK Driving Scenarios):
- id (PK)
- video_file_path (VARCHAR)
- scenario_type (ENUM) → 'urban', 'rural', 'motorway', 'residential', 'weather'
- hazard_count (INTEGER) → Number of hazards in clip
- passing_score_min (INTEGER) → Minimum points to pass
- passing_score_max (INTEGER) → Maximum points possible
- duration_seconds (INTEGER)
- location_description (VARCHAR) → Where scenario takes place
- weather_conditions (VARCHAR) → 'clear', 'rain', 'fog', 'snow'
- time_of_day (VARCHAR) → 'morning', 'afternoon', 'evening', 'night'
- traffic_density (VARCHAR) → 'light', 'moderate', 'heavy'
- key_hazards (JSON) → Description of main hazards to spot

hazard_perception_responses (Student Interactions):
- id (PK)
- test_id (FK) → mock_tests
- video_id (FK) → hazard_perception_videos
- student_id (FK) → students
- click_timestamps (JSON) → Array of when student clicked
- score (INTEGER) → Points achieved for this clip
- max_possible_score (INTEGER)
- hazards_identified (INTEGER) → How many hazards spotted
- false_clicks (INTEGER) → Incorrect clicks
- response_pattern (VARCHAR) → 'early', 'perfect', 'late', 'missed'
```

### **Active Driving Simulator Integration**
```sql
simulator_sessions (Virtual Driving Practice):
- id (PK)
- student_id (FK) → students
- instructor_id (FK) → instructors (if supervised)
- scenario_id (FK) → simulator_scenarios
- session_start (TIMESTAMP)
- session_end (TIMESTAMP)
- total_duration (INTEGER) → Minutes
- session_type (ENUM) → 'practice', 'assessment', 'lesson'
- weather_simulation (VARCHAR) → Applied weather conditions
- traffic_density (VARCHAR) → Simulated traffic level
- completion_percentage (DECIMAL) → How much of scenario completed
- overall_score (INTEGER) → 0-100 performance score
- safety_violations (INTEGER) → Number of rule breaks
- collision_count (INTEGER) → Virtual accidents
- speed_violations (INTEGER) → Times over speed limit
- signal_violations (INTEGER) → Missed indicators/signals
- positioning_score (INTEGER) → Lane discipline, parking
- observation_score (INTEGER) → Mirror checks, hazard awareness
- vehicle_control_score (INTEGER) → Smooth operation
- decision_making_score (INTEGER) → Appropriate responses
- confidence_level (ENUM) → 'nervous', 'cautious', 'confident', 'overconfident'
- areas_for_improvement (JSON) → Specific skills to work on
- session_notes (TEXT) → Instructor/system feedback

simulator_scenarios (UK Driving Situations):
- id (PK)
- scenario_name (VARCHAR)
- scenario_category (ENUM) → 'urban', 'rural', 'motorway', 'test_routes'
- difficulty_level (ENUM) → 'beginner', 'intermediate', 'advanced', 'test_standard'
- estimated_duration (INTEGER) → Expected minutes to complete
- uk_location_type (VARCHAR) → 'city_center', 'suburb', 'village', 'industrial'
- road_types_included (JSON) → Types of roads in scenario
- traffic_situations (JSON) → Roundabouts, traffic lights, pedestrian crossings
- weather_options (JSON) → Available weather conditions
- time_of_day_options (JSON) → Dawn, day, dusk, night options
- key_learning_objectives (JSON) → Skills this scenario teaches
- prerequisite_skills (JSON) → What student should know first
- success_criteria (JSON) → How success is measured
- common_mistakes (JSON) → Typical errors students make
- real_world_equivalent (VARCHAR) → Actual UK locations this represents
```

---

## 🎯 UK POSTCODE & LOCATION SYSTEM

### **UK Geographic Coverage**
```sql
uk_postcodes (UK Address System):
- id (PK)
- postcode (VARCHAR) → Full UK postcode
- postcode_area (VARCHAR) → First part (e.g., 'M', 'B', 'SW')
- postcode_district (VARCHAR) → First part + digit (e.g., 'M1', 'B15')
- city (VARCHAR) → Major city/town
- county (VARCHAR) → Administrative county
- region (VARCHAR) → 'North West', 'West Midlands', 'London', etc.
- latitude (DECIMAL)
- longitude (DECIMAL)
- is_urban (BOOLEAN)
- population_density (VARCHAR) → 'low', 'medium', 'high'
- driving_difficulty (ENUM) → 'easy', 'moderate', 'challenging'
- test_center_nearby (BOOLEAN) → DVSA test center in area

instructor_coverage_areas (Service Areas):
- id (PK)
- instructor_id (FK) → instructors
- postcode_id (FK) → uk_postcodes
- travel_time_minutes (INTEGER) → Time to reach from base
- travel_cost (DECIMAL) → Additional charge if any
- priority_area (BOOLEAN) → Preferred coverage zone
- last_lesson_date (DATE) → When last taught in this area
- lesson_count (INTEGER) → Total lessons given in area
```

---

## 📚 STUDY REMINDER & TEST READINESS SYSTEM

### **Study Reminder Engine**
```sql
study_reminders (Personalized Study Alerts):
- id (PK)
- student_id (FK) → students
- reminder_type (ENUM) → 'daily_practice', 'weak_area_focus', 'test_countdown', 'streak_motivation'
- category_id (FK) → theory_categories (specific topic)
- reminder_frequency (ENUM) → 'daily', 'every_2_days', 'weekly', 'custom'
- custom_schedule (JSON) → Custom timing pattern
- time_of_day (TIME) → Preferred study time
- days_of_week (JSON) → ['monday', 'tuesday', etc.]
- is_active (BOOLEAN)
- last_sent (TIMESTAMP)
- next_due (TIMESTAMP)
- success_count (INTEGER) → Times student responded positively
- skip_count (INTEGER) → Times student dismissed
- effectiveness_score (DECIMAL) → How well this reminder works
- personalized_message (TEXT) → Custom message for student
- created_at, updated_at

student_study_streaks (Motivation Tracking):
- id (PK)
- student_id (FK) → students
- current_streak_days (INTEGER) → Consecutive study days
- longest_streak_days (INTEGER) → Personal best
- last_study_date (DATE)
- streak_start_date (DATE)
- total_study_sessions (INTEGER) → All-time count
- average_session_minutes (INTEGER)
- streak_rewards_earned (JSON) → Achievements unlocked
- streak_broken_count (INTEGER) → Times streak was lost
- motivation_level (ENUM) → 'low', 'medium', 'high', 'excellent'

study_session_analytics (Learning Pattern Analysis):
- id (PK)
- student_id (FK) → students
- session_date (DATE)
- session_start (TIMESTAMP)
- session_end (TIMESTAMP)
- total_minutes (INTEGER)
- questions_attempted (INTEGER)
- questions_correct (INTEGER)
- categories_studied (JSON) → Topics covered in session
- improvement_rate (DECIMAL) → Progress during session
- focus_score (INTEGER) → How concentrated the study was
- break_count (INTEGER) → Rest periods taken
- difficulty_preference (VARCHAR) → What level they chose
- study_method (ENUM) → 'random', 'category_focus', 'weak_areas', 'mock_test'
- session_quality (ENUM) → 'poor', 'average', 'good', 'excellent'
- notes (TEXT) → Student's session notes
```

### **Test Readiness Calculator**
```sql
test_readiness_assessments (AI-Powered Readiness Analysis):
- id (PK)
- student_id (FK) → students
- assessment_date (DATE)
- overall_readiness_score (INTEGER) → 0-100 percentage
- theory_knowledge_score (INTEGER) → Multiple choice readiness
- hazard_perception_score (INTEGER) → HP test readiness
- confidence_level (ENUM) → 'not_ready', 'needs_work', 'nearly_ready', 'test_ready'
- estimated_pass_probability (DECIMAL) → AI prediction
- recommended_study_hours (INTEGER) → Hours needed before test
- weak_categories (JSON) → Topics needing attention
- strong_categories (JSON) → Mastered topics
- study_consistency_score (INTEGER) → How regular their study is
- mock_test_performance (DECIMAL) → Average mock test scores
- improvement_trend (VARCHAR) → 'declining', 'stable', 'improving', 'excellent'
- last_assessment_score (INTEGER) → Previous readiness score
- days_since_last_study (INTEGER) → Study recency
- total_practice_hours (INTEGER) → Cumulative study time
- recommendation_priority (JSON) → Ordered list of focus areas
- test_booking_recommendation (ENUM) → 'not_yet', 'consider_booking', 'ready_to_book', 'book_now'
- custom_study_plan (JSON) → Personalized preparation plan

readiness_factors (Detailed Analysis Components):
- id (PK)
- assessment_id (FK) → test_readiness_assessments
- factor_name (VARCHAR) → 'knowledge_breadth', 'speed_accuracy', 'hazard_timing'
- factor_score (INTEGER) → 0-100 for this specific factor
- weight_percentage (DECIMAL) → How much this affects overall score
- improvement_potential (VARCHAR) → 'low', 'medium', 'high'
- specific_recommendations (TEXT) → Detailed advice for this factor
- benchmark_comparison (VARCHAR) → How they compare to successful students
```

### **Suggestion Board System**
```sql
suggestion_board (Community Learning Hub):
- id (PK)
- suggestion_type (ENUM) → 'study_tip', 'test_experience', 'instructor_review', 'app_improvement'
- title (VARCHAR) → Clear suggestion title
- content (TEXT) → Detailed suggestion content
- author_id (FK) → users (can be anonymous)
- author_type (ENUM) → 'student', 'instructor', 'admin', 'anonymous'
- category_tags (JSON) → Relevant theory categories
- is_anonymous (BOOLEAN) → Hide author identity
- upvotes (INTEGER) → Community approval count
- downvotes (INTEGER) → Community disapproval count
- helpful_count (INTEGER) → "Helpful" reactions
- view_count (INTEGER) → How many times viewed
- status (ENUM) → 'pending', 'approved', 'featured', 'archived'
- moderator_notes (TEXT) → Admin feedback
- implementation_status (ENUM) → 'suggested', 'under_review', 'planned', 'implemented'
- priority_level (INTEGER) → 1-5 importance ranking
- created_at, updated_at

suggestion_interactions (Community Engagement):
- id (PK)
- suggestion_id (FK) → suggestion_board
- user_id (FK) → users
- interaction_type (ENUM) → 'upvote', 'downvote', 'helpful', 'bookmark', 'report'
- comment (TEXT) → Optional feedback
- created_at

suggestion_comments (Discussion Threads):
- id (PK)
- suggestion_id (FK) → suggestion_board
- author_id (FK) → users
- parent_comment_id (FK) → suggestion_comments (for replies)
- comment_text (TEXT)
- is_anonymous (BOOLEAN)
- upvotes (INTEGER)
- is_moderator_response (BOOLEAN)
- is_featured (BOOLEAN) → Highlighted by moderators
- created_at, updated_at
```

---

## 🚨 EMERGENCY LESSON CANCELLATION & AUTO-REBOOKING

### **Emergency Cancellation System**
```sql
emergency_cancellations (Crisis Management):
- id (PK)
- booking_id (FK) → bookings
- cancellation_reason (ENUM) → 'instructor_sick', 'student_emergency', 'vehicle_breakdown', 'weather', 'traffic_accident', 'family_emergency', 'covid_symptoms'
- cancelled_by (FK) → users (who cancelled)
- cancellation_time (TIMESTAMP)
- original_lesson_datetime (TIMESTAMP)
- notice_period_hours (INTEGER) → How much advance notice
- severity_level (ENUM) → 'minor', 'moderate', 'major', 'critical'
- auto_rebook_eligible (BOOLEAN) → Can system auto-rebook?
- student_notified (BOOLEAN)
- instructor_notified (BOOLEAN)
- admin_notified (BOOLEAN)
- compensation_required (BOOLEAN) → Student deserves credit/refund
- alternative_options_provided (JSON) → Other time slots offered
- cancellation_notes (TEXT) → Detailed explanation
- resolution_status (ENUM) → 'pending', 'rebooking_in_progress', 'resolved', 'escalated'

auto_rebooking_queue (Intelligent Rescheduling):
- id (PK)
- cancellation_id (FK) → emergency_cancellations
- student_id (FK) → students
- instructor_id (FK) → instructors
- original_datetime (TIMESTAMP)
- priority_score (INTEGER) → Booking priority (1-100)
- student_preferences (JSON) → Preferred times/days
- instructor_availability (JSON) → Available slots
- earliest_acceptable_date (DATE) → Student's minimum date
- latest_acceptable_date (DATE) → Student's maximum date
- preferred_time_ranges (JSON) → Morning, afternoon, evening preferences
- auto_confirm_enabled (BOOLEAN) → Skip student confirmation
- rebooking_attempts (INTEGER) → How many times system tried
- last_attempt_time (TIMESTAMP)
- success_probability (DECIMAL) → AI prediction of successful rebooking
- alternative_instructors (JSON) → Backup instructor options
- status (ENUM) → 'queued', 'processing', 'options_found', 'confirmed', 'failed'

rebooking_notifications (Communication Management):
- id (PK)
- rebooking_id (FK) → auto_rebooking_queue
- notification_type (ENUM) → 'cancellation_alert', 'options_available', 'booking_confirmed', 'manual_action_needed'
- recipient_id (FK) → users
- recipient_type (ENUM) → 'student', 'instructor', 'admin'
- channel (ENUM) → 'email', 'sms', 'whatsapp', 'push', 'in_app'
- message_content (TEXT)
- sent_at (TIMESTAMP)
- read_at (TIMESTAMP)
- response_required (BOOLEAN)
- response_deadline (TIMESTAMP)
- response_received (TEXT) → User's reply
```

---

## 💬 GROUP CHAT FOR THEORY TEST STUDENTS

### **Theory Student Group Chats**
```sql
theory_study_groups (Learning Communities):
- id (PK)
- group_name (VARCHAR) → "March 2024 Test Takers"
- group_type (ENUM) → 'test_date_cohort', 'topic_focus', 'study_buddies', 'mock_test_group'
- target_test_date (DATE) → When group members plan to take test
- focus_categories (JSON) → Theory topics this group studies
- max_members (INTEGER) → Group size limit
- current_member_count (INTEGER)
- is_private (BOOLEAN) → Invitation only
- requires_approval (BOOLEAN) → Admin approval for joining
- study_schedule (JSON) → Group study times
- group_leader_id (FK) → users (optional group leader)
- moderator_ids (JSON) → Users with moderation rights
- group_description (TEXT) → Purpose and rules
- activity_level (ENUM) → 'inactive', 'low', 'moderate', 'high', 'very_active'
- success_rate (DECIMAL) → Percentage of members who passed
- created_at, updated_at

theory_group_memberships (Group Participation):
- id (PK)
- group_id (FK) → theory_study_groups
- student_id (FK) → students
- joined_at (TIMESTAMP)
- role (ENUM) → 'member', 'moderator', 'leader'
- is_active (BOOLEAN)
- last_activity (TIMESTAMP)
- messages_sent (INTEGER)
- helpful_responses (INTEGER) → Messages marked as helpful
- study_contributions (INTEGER) → Shared resources, tips
- group_reputation_score (INTEGER) → Community standing
- notification_preferences (JSON) → When to get alerts
- left_at (TIMESTAMP) → If they left the group

group_chat_messages (Real-time Communication):
- id (PK)
- group_id (FK) → theory_study_groups
- sender_id (FK) → users
- message_type (ENUM) → 'text', 'image', 'file', 'study_resource', 'mock_test_share', 'voice_note'
- message_content (TEXT)
- attachment_url (VARCHAR) → File/image path
- reply_to_message_id (FK) → group_chat_messages (threaded replies)
- is_pinned (BOOLEAN) → Important message
- is_study_tip (BOOLEAN) → Educational content
- category_tags (JSON) → Relevant theory topics
- reactions (JSON) → Emoji reactions from members
- mentions (JSON) → @username mentions
- is_moderated (BOOLEAN) → Checked by moderator
- edited_at (TIMESTAMP)
- deleted_at (TIMESTAMP)
- sent_at (TIMESTAMP)

group_study_sessions (Collaborative Learning):
- id (PK)
- group_id (FK) → theory_study_groups
- session_name (VARCHAR) → "Hazard Perception Practice"
- session_type (ENUM) → 'group_mock_test', 'topic_discussion', 'study_party', 'q_and_a'
- scheduled_start (TIMESTAMP)
- scheduled_end (TIMESTAMP)
- actual_start (TIMESTAMP)
- actual_end (TIMESTAMP)
- organizer_id (FK) → users
- max_participants (INTEGER)
- current_participants (JSON) → Array of user IDs
- session_description (TEXT) → What the session covers
- study_materials (JSON) → Resources used in session
- session_notes (TEXT) → Key points discussed
- recording_url (VARCHAR) → If session was recorded
- follow_up_actions (JSON) → What to do after session
- effectiveness_rating (DECIMAL) → Participant feedback average

group_achievements (Collective Milestones):
- id (PK)
- group_id (FK) → theory_study_groups
- achievement_type (ENUM) → 'first_pass', 'group_streak', 'study_milestone', 'helping_community'
- achievement_name (VARCHAR) → "5 Members Passed This Month"
- description (TEXT)
- earned_at (TIMESTAMP)
- participant_ids (JSON) → Members who contributed
- celebration_message (TEXT) → Congratulatory message
- badge_icon (VARCHAR) → Visual representation
```

### **Advanced Group Features**
```sql
group_study_resources (Shared Learning Materials):
- id (PK)
- group_id (FK) → theory_study_groups
- uploader_id (FK) → users
- resource_type (ENUM) → 'pdf_guide', 'video_explanation', 'practice_questions', 'mnemonics', 'real_test_experience'
- resource_title (VARCHAR)
- resource_description (TEXT)
- file_url (VARCHAR)
- file_size (INTEGER) → In bytes
- download_count (INTEGER)
- helpful_votes (INTEGER)
- category_tags (JSON) → Theory topics covered
- difficulty_level (ENUM) → 'beginner', 'intermediate', 'advanced'
- is_verified (BOOLEAN) → Checked for accuracy
- moderator_approved (BOOLEAN)
- upload_date (TIMESTAMP)

group_leaderboards (Friendly Competition):
- id (PK)
- group_id (FK) → theory_study_groups
- leaderboard_type (ENUM) → 'study_streak', 'mock_test_scores', 'helpful_contributions', 'overall_progress'
- period (ENUM) → 'weekly', 'monthly', 'all_time'
- rankings (JSON) → Ordered list of member rankings
- last_updated (TIMESTAMP)
- is_active (BOOLEAN)
```

---

## 🎯 UPDATED COMPREHENSIVE FEATURES

This enhanced UK-specific database design now includes:

1. ✅ **Enhanced UK Instructor Database** with all requested fields
2. ✅ **Complete DVSA Theory Test Topics** (all 15 official categories)  
3. ✅ **Comprehensive Calendar & Diary System** for instructors
4. ✅ **Detailed Time Tracking** with analytics
5. ✅ **Active Driving Simulator** integration
6. ✅ **UK Postcode System** for location management
7. ✅ **Hazard Perception Testing** with video scenarios
8. ✅ **🆕 Study Reminder Engine** with personalized alerts
9. ✅ **🆕 AI Test Readiness Calculator** with pass probability
10. ✅ **🆕 Community Suggestion Board** with voting system
11. ✅ **🆕 Emergency Cancellation System** with auto-rebooking
12. ✅ **🆕 Theory Student Group Chats** with collaborative features

**🚀 Ready to implement this comprehensive UK driving platform?** 🇬🇧