-- Create custom course settings table
CREATE TABLE IF NOT EXISTS "custom_course_settings" (
  "id" serial PRIMARY KEY NOT NULL,
  "title" varchar(200) DEFAULT 'Custom Course' NOT NULL,
  "description" text DEFAULT 'Build your personalized driving course',
  "hourly_rate" numeric(6, 2) DEFAULT '30.00' NOT NULL,
  "min_hours" integer DEFAULT 1,
  "max_hours" integer DEFAULT 10,
  "is_active" boolean DEFAULT true,
  "card_color" varchar(50) DEFAULT 'orange',
  "card_icon" varchar(50) DEFAULT 'settings',
  "created_at" timestamp DEFAULT now(),
  "updated_at" timestamp DEFAULT now()
);

-- Create custom course skills table
CREATE TABLE IF NOT EXISTS "custom_course_skills" (
  "id" serial PRIMARY KEY NOT NULL,
  "skill_id" varchar(100) NOT NULL,
  "name" varchar(200) NOT NULL,
  "category" varchar(50) NOT NULL,
  "description" text NOT NULL,
  "is_active" boolean DEFAULT true,
  "display_order" integer DEFAULT 0,
  "created_at" timestamp DEFAULT now(),
  "updated_at" timestamp DEFAULT now(),
  CONSTRAINT "custom_course_skills_skill_id_unique" UNIQUE("skill_id")
);

-- Insert default custom course settings
INSERT INTO "custom_course_settings" (
  "title", 
  "description", 
  "hourly_rate", 
  "min_hours", 
  "max_hours", 
  "is_active", 
  "card_color", 
  "card_icon"
) VALUES (
  'Custom Course',
  'Build your personalized driving course with the skills you need most',
  '30.00',
  1,
  10,
  true,
  'orange',
  'settings'
) ON CONFLICT DO NOTHING;

-- Insert UK practical driving skills
INSERT INTO "custom_course_skills" ("skill_id", "name", "category", "description", "is_active", "display_order") VALUES
('mirrors', 'Mirror Usage', 'safety', 'Proper use of mirrors for observation', true, 1),
('signals', 'Signalling', 'safety', 'Correct timing and positioning of signals', true, 2),
('position', 'Road Position', 'control', 'Maintaining correct position on the road', true, 3),
('speed', 'Speed Control', 'control', 'Appropriate speed for conditions', true, 4),
('following', 'Following Distance', 'safety', 'Safe following distances', true, 5),
('progress', 'Making Progress', 'control', 'Driving at appropriate speed and making progress', true, 6),
('junctions', 'Junctions', 'manoeuvres', 'Approach, observation, and negotiation of junctions', true, 7),
('roundabouts', 'Roundabouts', 'manoeuvres', 'Safe navigation of roundabouts', true, 8),
('dual-carriageways', 'Dual Carriageways', 'manoeuvres', 'Joining and leaving dual carriageways', true, 9),
('pedestrian-crossings', 'Pedestrian Crossings', 'safety', 'Approach and behaviour at crossings', true, 10),
('vulnerable-users', 'Vulnerable Road Users', 'safety', 'Awareness of cyclists, pedestrians, motorcyclists', true, 11),
('independent-driving', 'Independent Driving', 'navigation', 'Following directions or sat nav', true, 12),
('parallel-parking', 'Parallel Parking', 'manoeuvres', 'Reversing into a parking space', true, 13),
('bay-parking', 'Bay Parking', 'manoeuvres', 'Forward or reverse bay parking', true, 14),
('pull-up-right', 'Pull Up on Right', 'manoeuvres', 'Pulling up on the right and reversing', true, 15),
('emergency-stop', 'Emergency Stop', 'safety', 'Stopping quickly and safely in an emergency', true, 16),
('hill-starts', 'Hill Starts', 'control', 'Starting on an uphill gradient', true, 17),
('clutch-control', 'Clutch Control', 'control', 'Smooth operation of clutch (manual cars)', true, 18),
('steering', 'Steering Control', 'control', 'Smooth and controlled steering', true, 19),
('hazard-awareness', 'Hazard Awareness', 'safety', 'Identifying and responding to hazards', true, 20)
ON CONFLICT ("skill_id") DO NOTHING;