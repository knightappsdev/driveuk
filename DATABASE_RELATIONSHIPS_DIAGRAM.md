# 🎨 VISUAL DATABASE RELATIONSHIP DIAGRAM

## 📊 ENTITY RELATIONSHIP DIAGRAM (ERD)

```
                    🏢 SYSTEM CORE
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  👤 users                                                   │
│  ├── id (PK)                 ┌─────────────────────────┐    │
│  ├── email                   │  🔧 user_preferences    │    │
│  ├── role                    │  ├── user_id (FK)       │    │
│  ├── first_name              │  ├── email_notifications│    │
│  ├── last_name               │  ├── sms_notifications  │    │
│  └── ...                     │  └── ...                │    │
│      │                       └─────────────────────────┘    │
│      │                                                      │
│      ├─────────────────┬─────────────────┬─────────────────┤
│      │                 │                 │                 │
│      ▼                 ▼                 ▼                 │
│  👨‍🏫 instructors      👨‍🎓 students        📱 user_devices    │
│  ├── user_id (FK)      ├── user_id (FK)  ├── user_id (FK)  │
│  ├── license_number    ├── license_type  ├── device_id     │
│  ├── hourly_rate       ├── test_dates    ├── push_endpoint │
│  └── ...               └── ...           └── ...           │
│                                                             │
└─────────────────────────────────────────────────────────────┘

                    📅 BOOKING SYSTEM
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  📋 bookings (Central Hub)                                  │
│  ├── id (PK)                                               │
│  ├── student_id (FK) ──────────────┐                       │
│  ├── instructor_id (FK) ────────┐   │                       │
│  ├── booking_date               │   │                       │
│  ├── status                     │   │                       │
│  └── ...                        │   │                       │
│      │                          │   │                       │
│      ▼                          │   │                       │
│  📖 lessons                     │   │                       │
│  ├── booking_id (FK)            │   │                       │
│  ├── instructor_id (FK) ────────┘   │                       │
│  ├── student_id (FK) ───────────────┘                       │
│  ├── lesson_notes                                           │
│  ├── progress_data                                          │
│  └── ...                                                    │
│      │                                                      │
│      ▼                                                      │
│  📊 lesson_progress                                         │
│  ├── lesson_id (FK)                                        │
│  ├── skill_category                                        │
│  ├── progress_rating                                       │
│  └── ...                                                    │
│                                                             │
└─────────────────────────────────────────────────────────────┘

                    💳 FINANCIAL SYSTEM
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  💰 payments                                                │
│  ├── id (PK)                                               │
│  ├── booking_id (FK) ──────┐                               │
│  ├── student_id (FK)       │                               │
│  ├── amount                │                               │
│  ├── status                │                               │
│  └── ...                   │                               │
│      │                     │                               │
│      ▼                     │                               │
│  🧾 invoices               │                               │
│  ├── payment_id (FK)       │                               │
│  ├── invoice_number        │                               │
│  ├── pdf_path              │                               │
│  └── ...                   │                               │
│                             │                               │
│  📋 booking_packages ◄──────┘                               │
│  ├── booking_id (FK)                                       │
│  ├── package_type                                          │
│  ├── lessons_included                                      │
│  └── ...                                                    │
│                                                             │
└─────────────────────────────────────────────────────────────┘

                    💬 COMMUNICATION LAYER
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  💌 messages                                                │
│  ├── id (PK)                                               │
│  ├── sender_id (FK)                                        │
│  ├── thread_id                                             │
│  ├── content                                               │
│  ├── message_type                                          │
│  └── ...                                                    │
│      │                                                      │
│      ▼                                                      │
│  👥 message_participants                                    │
│  ├── message_id (FK)                                       │
│  ├── user_id (FK)                                          │
│  ├── is_read                                               │
│  └── ...                                                    │
│                                                             │
│  🔔 notifications                                           │
│  ├── id (PK)                                               │
│  ├── user_id (FK)                                          │
│  ├── type                                                  │
│  ├── title                                                 │
│  ├── content                                               │
│  ├── channels (email/sms/push)                             │
│  └── ...                                                    │
│      │                                                      │
│      ▼                                                      │
│  📨 notification_deliveries                                │
│  ├── notification_id (FK)                                  │
│  ├── channel                                               │
│  ├── status                                                │
│  ├── delivered_at                                          │
│  └── ...                                                    │
│                                                             │
└─────────────────────────────────────────────────────────────┘

                    📅 CALENDAR & SCHEDULING
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  🗓️ calendar_events                                         │
│  ├── id (PK)                                               │
│  ├── owner_id (FK) → users                                 │
│  ├── booking_id (FK) → bookings (optional)                 │
│  ├── title                                                 │
│  ├── start_time                                            │
│  ├── end_time                                              │
│  ├── event_type                                            │
│  └── ...                                                    │
│      │                                                      │
│      ▼                                                      │
│  👥 event_participants                                      │
│  ├── event_id (FK)                                         │
│  ├── user_id (FK)                                          │
│  ├── participation_status                                  │
│  └── ...                                                    │
│                                                             │
│  ⏰ instructor_availability                                 │
│  ├── instructor_id (FK)                                    │
│  ├── day_of_week                                           │
│  ├── start_time                                            │
│  ├── end_time                                              │
│  ├── is_available                                          │
│  └── ...                                                    │
│                                                             │
└─────────────────────────────────────────────────────────────┘

                    📊 CRM & ANALYTICS
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  💼 crm_contacts                                            │
│  ├── id (PK)                                               │
│  ├── user_id (FK) → users                                  │
│  ├── contact_type                                          │
│  ├── lead_status                                           │
│  ├── lifetime_value                                        │
│  └── ...                                                    │
│      │                                                      │
│      ▼                                                      │
│  📝 crm_interactions                                        │
│  ├── contact_id (FK)                                       │
│  ├── staff_user_id (FK)                                    │
│  ├── interaction_type                                      │
│  ├── interaction_date                                      │
│  ├── notes                                                 │
│  └── ...                                                    │
│                                                             │
│  📈 analytics_events                                        │
│  ├── id (PK)                                               │
│  ├── user_id (FK)                                          │
│  ├── event_type                                            │
│  ├── event_data (JSON)                                     │
│  ├── timestamp                                             │
│  └── ...                                                    │
│                                                             │
└─────────────────────────────────────────────────────────────┘

                    🎯 SKILL TRACKING
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  🎓 skill_categories                                        │
│  ├── id (PK)                                               │
│  ├── category_name                                         │
│  ├── description                                           │
│  ├── skill_order                                           │
│  └── ...                                                    │
│      │                                                      │
│      ▼                                                      │
│  📊 student_progress                                        │
│  ├── student_id (FK)                                       │
│  ├── skill_category_id (FK)                                │
│  ├── current_level                                         │
│  ├── progress_percentage                                   │
│  ├── last_assessed                                         │
│  └── ...                                                    │
│                                                             │
│  📋 lesson_skill_progress                                   │
│  ├── lesson_id (FK)                                        │
│  ├── skill_category_id (FK)                                │
│  ├── skill_rating                                          │
│  ├── instructor_notes                                      │
│  └── ...                                                    │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## 🔗 KEY RELATIONSHIP SUMMARY

### **Primary Keys (PK) & Foreign Keys (FK)**

| Table | Primary Key | Key Foreign Keys |
|-------|-------------|------------------|
| `users` | `id` | None (root table) |
| `instructors` | `id` | `user_id` → users |
| `students` | `id` | `user_id` → users |
| `bookings` | `id` | `student_id` → students, `instructor_id` → instructors |
| `lessons` | `id` | `booking_id` → bookings, `student_id` → students, `instructor_id` → instructors |
| `payments` | `id` | `booking_id` → bookings, `student_id` → students |
| `messages` | `id` | `sender_id` → users |
| `notifications` | `id` | `user_id` → users |
| `calendar_events` | `id` | `owner_id` → users, `booking_id` → bookings |

### **Many-to-Many Relationships**

| Relationship | Junction Table | Purpose |
|--------------|----------------|---------|
| `messages` ↔ `users` | `message_participants` | Multi-user conversations |
| `calendar_events` ↔ `users` | `event_participants` | Event attendees |
| `lessons` ↔ `skill_categories` | `lesson_skill_progress` | Skills practiced in lessons |
| `notifications` ↔ `channels` | `notification_deliveries` | Multi-channel delivery |

### **One-to-One Special Relationships**

| Parent | Child | Purpose |
|--------|-------|---------|
| `users` | `instructors` | Professional instructor profile |
| `users` | `students` | Learning journey profile |
| `users` | `user_preferences` | Personal settings |
| `bookings` | `calendar_events` | Calendar integration |
| `payments` | `invoices` | Billing records |

---

## 🎯 CRITICAL DECISION POINTS

### **🤔 Please Review & Decide:**

1. **Student-Instructor Relationship:**
   - Option A: One student = One primary instructor (`students.current_instructor_id`)
   - Option B: Many-to-many relationship (students can learn from multiple instructors)
   - **Recommendation:** Option A for simplicity, Option B for flexibility

2. **Lesson Packages:**
   - Option A: JSON field in instructor rates
   - Option B: Separate `lesson_packages` table with detailed package management
   - **Recommendation:** Option B for better tracking and reporting

3. **Location Management:**
   - Option A: Simple text fields for pickup locations
   - Option B: Dedicated `locations` table with coordinates, areas, etc.
   - **Recommendation:** Option A initially, Option B for scaling

4. **Group Lessons:**
   - Option A: One-to-one lessons only
   - Option B: Support multiple students per lesson
   - **Recommendation:** Option A initially (easier to implement)

5. **Recurring Bookings:**
   - Option A: Individual bookings only
   - Option B: Support for recurring lesson schedules
   - **Recommendation:** Option B for better user experience

6. **File Storage:**
   - Option A: Simple file paths in lesson attachments
   - Option B: Comprehensive document management system
   - **Recommendation:** Option A initially

---

**🚀 Ready to proceed? Please let me know:**
- Any changes to the relationship structure?
- Which options you prefer for the decision points?
- Any additional tables or relationships needed?
- Any concerns about performance or complexity?

Once approved, I'll create the complete, error-free schema implementation! ✨