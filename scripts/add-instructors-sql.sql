-- Add 10 more instructors using direct SQL
-- First, let's create some additional users for the instructors

-- Insert additional users (starting from ID 11 if previous users exist)
INSERT INTO users (email, first_name, last_name, user_type, phone, city, postcode, is_verified, created_at, updated_at) VALUES
('john.smith@driveuk.com', 'John', 'Smith', 'instructor', '+44 7123 456789', 'Manchester', 'M1 1AA', true, NOW(), NOW()),
('sarah.johnson@driveuk.com', 'Sarah', 'Johnson', 'instructor', '+44 7234 567890', 'Birmingham', 'B1 1AB', true, NOW(), NOW()),
('david.williams@driveuk.com', 'David', 'Williams', 'instructor', '+44 7345 678901', 'Leeds', 'LS1 1AC', true, NOW(), NOW()),
('emma.brown@driveuk.com', 'Emma', 'Brown', 'instructor', '+44 7456 789012', 'Sheffield', 'S1 1AD', true, NOW(), NOW()),
('michael.davis@driveuk.com', 'Michael', 'Davis', 'instructor', '+44 7567 890123', 'Bristol', 'BS1 1AE', true, NOW(), NOW()),
('lisa.miller@driveuk.com', 'Lisa', 'Miller', 'instructor', '+44 7678 901234', 'Newcastle', 'NE1 1AF', true, NOW(), NOW()),
('james.wilson@driveuk.com', 'James', 'Wilson', 'instructor', '+44 7789 012345', 'Liverpool', 'L1 1AG', true, NOW(), NOW()),
('jennifer.moore@driveuk.com', 'Jennifer', 'Moore', 'instructor', '+44 7890 123456', 'Leicester', 'LE1 1AH', true, NOW(), NOW()),
('robert.taylor@driveuk.com', 'Robert', 'Taylor', 'instructor', '+44 7901 234567', 'Coventry', 'CV1 1AI', true, NOW(), NOW()),
('amanda.anderson@driveuk.com', 'Amanda', 'Anderson', 'instructor', '+44 7012 345678', 'Hull', 'HU1 1AJ', true, NOW(), NOW());

-- Now insert the corresponding instructor records
-- Note: Adjust user_id values based on your actual user IDs
INSERT INTO instructors (
    user_id, adi_badge_number, adi_grade, years_experience, hourly_rate, specialties,
    instructor_summary, base_city, business_postcode, whatsapp_number,
    car_make, car_model, car_year, car_type, car_fuel_type, vehicle_registration,
    transmission_types, ethnicity, religion, is_active, is_approved, bio,
    teaching_expertise, adi_number, created_at, updated_at
) VALUES
-- John Smith - Manchester
((SELECT id FROM users WHERE email = 'john.smith@driveuk.com'), 'ADI12345', 'Grade A', 8, 35.00, 
 '["nervous_learners", "pass_plus", "intensive_courses"]'::json,
 'Experienced instructor specializing in nervous learners and intensive courses.',
 'Manchester', 'M1 1AA', '+44 7123 456789',
 'Ford', 'Focus', 2020, 'Manual', 'Petrol', 'MN20 ABC',
 '["Manual", "Automatic"]'::json, 'White British', 'Christian', true, true,
 'Friendly and patient instructor with 8 years of experience. I specialize in helping nervous learners build confidence.',
 'Nervous Learners', 'ADI12345', NOW(), NOW()),

-- Sarah Johnson - Birmingham  
((SELECT id FROM users WHERE email = 'sarah.johnson@driveuk.com'), 'ADI23456', 'Grade A', 6, 32.00,
 '["automatic_only", "elderly_learners", "refresher_courses"]'::json,
 'Specialist in automatic transmission and refresher courses.',
 'Birmingham', 'B1 1AB', '+44 7234 567890',
 'Toyota', 'Corolla', 2019, 'Automatic', 'Hybrid', 'BM19 DEF',
 '["Automatic"]'::json, 'Asian British', 'Hindu', true, true,
 'Calm and encouraging instructor who loves helping people regain their driving confidence.',
 'Automatic Specialist', 'ADI23456', NOW(), NOW()),

-- David Williams - Leeds
((SELECT id FROM users WHERE email = 'david.williams@driveuk.com'), 'ADI34567', 'Grade A', 12, 38.00,
 '["advanced_driving", "motorway_lessons", "pass_plus"]'::json,
 'Advanced driving instructor with motorway expertise.',
 'Leeds', 'LS1 1AC', '+44 7345 678901',
 'BMW', '1 Series', 2021, 'Manual', 'Diesel', 'LD21 GHI',
 '["Manual"]'::json, 'White British', 'Atheist', true, true,
 'Experienced instructor specializing in advanced driving techniques and motorway lessons.',
 'Advanced Driving', 'ADI34567', NOW(), NOW()),

-- Emma Brown - Sheffield
((SELECT id FROM users WHERE email = 'emma.brown@driveuk.com'), 'ADI45678', 'Grade B', 4, 30.00,
 '["young_drivers", "theory_test_help", "budget_lessons"]'::json,
 'Young, energetic instructor perfect for teenage learners.',
 'Sheffield', 'S1 1AD', '+44 7456 789012',
 'Vauxhall', 'Corsa', 2018, 'Manual', 'Petrol', 'SF18 JKL',
 '["Manual"]'::json, 'Mixed Race', 'Christian', true, true,
 'Young and enthusiastic instructor who connects well with teenage learners.',
 'Young Drivers', 'ADI45678', NOW(), NOW()),

-- Michael Davis - Bristol
((SELECT id FROM users WHERE email = 'michael.davis@driveuk.com'), 'ADI56789', 'Grade A', 10, 36.00,
 '["intensive_courses", "test_preparation", "city_driving"]'::json,
 'Intensive course specialist with high first-time pass rates.',
 'Bristol', 'BS1 1AE', '+44 7567 890123',
 'Volkswagen', 'Golf', 2020, 'Manual', 'Petrol', 'BS20 MNO',
 '["Manual", "Automatic"]'::json, 'White British', 'Christian', true, true,
 'Results-focused instructor with excellent first-time pass rates in intensive courses.',
 'Intensive Courses', 'ADI56789', NOW(), NOW()),

-- Lisa Miller - Newcastle
((SELECT id FROM users WHERE email = 'lisa.miller@driveuk.com'), 'ADI67890', 'Grade A', 7, 33.00,
 '["female_instructor", "nervous_learners", "mature_learners"]'::json,
 'Female instructor specializing in nervous and mature learners.',
 'Newcastle', 'NE1 1AF', '+44 7678 901234',
 'Nissan', 'Micra', 2019, 'Automatic', 'Petrol', 'NE19 PQR',
 '["Automatic"]'::json, 'White British', 'Christian', true, true,
 'Patient female instructor who specializes in building confidence in nervous learners.',
 'Female Instructor', 'ADI67890', NOW(), NOW()),

-- James Wilson - Liverpool
((SELECT id FROM users WHERE email = 'james.wilson@driveuk.com'), 'ADI78901', 'Grade B', 5, 31.00,
 '["manual_specialist", "clutch_control", "hill_starts"]'::json,
 'Manual transmission expert, great for mastering clutch control.',
 'Liverpool', 'L1 1AG', '+44 7789 012345',
 'Ford', 'Fiesta', 2018, 'Manual', 'Petrol', 'LV18 STU',
 '["Manual"]'::json, 'White British', 'Catholic', true, true,
 'Manual driving specialist who excels at teaching clutch control and hill starts.',
 'Manual Specialist', 'ADI78901', NOW(), NOW()),

-- Jennifer Moore - Leicester
((SELECT id FROM users WHERE email = 'jennifer.moore@driveuk.com'), 'ADI89012', 'Grade A', 9, 34.00,
 '["eco_driving", "fuel_efficient", "environmental"]'::json,
 'Eco-driving specialist focusing on fuel efficiency and environmental awareness.',
 'Leicester', 'LE1 1AH', '+44 7890 123456',
 'Toyota', 'Prius', 2020, 'Automatic', 'Hybrid', 'LE20 VWX',
 '["Automatic"]'::json, 'White British', 'Buddhist', true, true,
 'Environmentally conscious instructor specializing in eco-friendly driving techniques.',
 'Eco Driving', 'ADI89012', NOW(), NOW()),

-- Robert Taylor - Coventry
((SELECT id FROM users WHERE email = 'robert.taylor@driveuk.com'), 'ADI90123', 'Grade A', 15, 40.00,
 '["experienced_instructor", "all_weather", "night_driving"]'::json,
 'Highly experienced instructor offering all-weather and night driving lessons.',
 'Coventry', 'CV1 1AI', '+44 7901 234567',
 'Audi', 'A3', 2021, 'Manual', 'Diesel', 'CV21 YZA',
 '["Manual", "Automatic"]'::json, 'White British', 'Christian', true, true,
 'Highly experienced instructor with 15 years of teaching. Offers specialized all-weather training.',
 'All Weather Driving', 'ADI90123', NOW(), NOW()),

-- Amanda Anderson - Hull
((SELECT id FROM users WHERE email = 'amanda.anderson@driveuk.com'), 'ADI01234', 'Grade B', 3, 28.00,
 '["new_instructor", "patient_teaching", "affordable_rates"]'::json,
 'New instructor with competitive rates and patient teaching style.',
 'Hull', 'HU1 1AJ', '+44 7012 345678',
 'Skoda', 'Fabia', 2017, 'Manual', 'Petrol', 'HU17 BCD',
 '["Manual"]'::json, 'White British', 'Christian', true, true,
 'Newly qualified instructor offering competitive rates with a patient and supportive approach.',
 'Patient Teaching', 'ADI01234', NOW(), NOW());