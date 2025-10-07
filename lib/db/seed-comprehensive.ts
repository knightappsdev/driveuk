import { db } from './drizzle';
import { 
  users, 
  instructors, 
  students, 
  courses, 
  bookings, 
  lessons, 
  activityLogs, 
  settings, 
  coursePurchases,
  roleEnum,
  bookingStatusEnum,
  lessonStatusEnum
} from './comprehensive-schema';
import { hashPassword } from '@/lib/auth/session';

// Sample data arrays
const sampleUsers = [
  // Admin users
  {
    name: 'System Administrator',
    email: 'admin@driveschool.com',
    password: 'admin123',
    role: 'admin' as const,
    phone: '07700900123',
    avatar: 'https://placehold.co/100x100/3B82F6/FFFFFF?text=SA'
  },
  {
    name: 'Emily Watson',
    email: 'emily.watson@driveschool.com',
    password: 'admin123',
    role: 'admin' as const,
    phone: '07700900124',
    avatar: 'https://placehold.co/100x100/10B981/FFFFFF?text=EW'
  },
  
  // Instructor users
  {
    name: 'Sarah Jones',
    email: 'sarah.jones@instructor.com',
    password: 'instructor123',
    role: 'instructor' as const,
    phone: '07700900200',
    avatar: 'https://placehold.co/100x100/E5E7EB/374151?text=SJ'
  },
  {
    name: 'Mike Chen',
    email: 'mike.chen@instructor.com',
    password: 'instructor123',
    role: 'instructor' as const,
    phone: '07700900201',
    avatar: 'https://placehold.co/100x100/E5E7EB/374151?text=MC'
  },
  {
    name: 'Emma Wilson',
    email: 'emma.wilson@instructor.com',
    password: 'instructor123',
    role: 'instructor' as const,
    phone: '07700900202',
    avatar: 'https://placehold.co/100x100/E5E7EB/374151?text=EW'
  },
  {
    name: 'James Taylor',
    email: 'james.taylor@instructor.com',
    password: 'instructor123',
    role: 'instructor' as const,
    phone: '07700900203',
    avatar: 'https://placehold.co/100x100/E5E7EB/374151?text=JT'
  },
  {
    name: 'Lisa Rodriguez',
    email: 'lisa.rodriguez@instructor.com',
    password: 'instructor123',
    role: 'instructor' as const,
    phone: '07700900204',
    avatar: 'https://placehold.co/100x100/E5E7EB/374151?text=LR'
  },
  
  // Student users
  {
    name: 'John Smith',
    email: 'john.smith@student.com',
    password: 'student123',
    role: 'student' as const,
    phone: '07700900300',
    avatar: 'https://placehold.co/100x100/EFF6FF/1E40AF?text=JS'
  },
  {
    name: 'Alice Johnson',
    email: 'alice.johnson@student.com',
    password: 'student123',
    role: 'student' as const,
    phone: '07700900301',
    avatar: 'https://placehold.co/100x100/F0FDF4/16A34A?text=AJ'
  },
  {
    name: 'Robert Brown',
    email: 'robert.brown@student.com',
    password: 'student123',
    role: 'student' as const,
    phone: '07700900302',
    avatar: 'https://placehold.co/100x100/FEF7FF/A21CAF?text=RB'
  },
  {
    name: 'Sophie Davis',
    email: 'sophie.davis@student.com',
    password: 'student123',
    role: 'student' as const,
    phone: '07700900303',
    avatar: 'https://placehold.co/100x100/FFF7ED/EA580C?text=SD'
  },
  {
    name: 'Michael Wilson',
    email: 'michael.wilson@student.com',
    password: 'student123',
    role: 'student' as const,
    phone: '07700900304',
    avatar: 'https://placehold.co/100x100/FAFAFA/525252?text=MW'
  },
  {
    name: 'Emma Thompson',
    email: 'emma.thompson@student.com',
    password: 'student123',
    role: 'student' as const,
    phone: '07700900305',
    avatar: 'https://placehold.co/100x100/ECFDF5/059669?text=ET'
  },
  {
    name: 'David Garcia',
    email: 'david.garcia@student.com',
    password: 'student123',
    role: 'student' as const,
    phone: '07700900306',
    avatar: 'https://placehold.co/100x100/FDF2F8/BE185D?text=DG'
  },
  {
    name: 'Jessica Lee',
    email: 'jessica.lee@student.com',
    password: 'student123',
    role: 'student' as const,
    phone: '07700900307',
    avatar: 'https://placehold.co/100x100/F0F9FF/0284C7?text=JL'
  }
];

const instructorProfiles = [
  {
    licenseNumber: 'ADI-001234',
    experience: 8,
    specialties: ['Nervous Drivers', 'Intensive Courses', 'Test Preparation'],
    transmissionTypes: ['manual', 'automatic'],
    pricePerHour: '35.00',
    location: 'City Centre',
    bio: 'Patient and understanding instructor with 8 years of experience specializing in nervous drivers and intensive courses.',
    availability: {
      monday: { start: '09:00', end: '17:00', available: true },
      tuesday: { start: '09:00', end: '17:00', available: true },
      wednesday: { start: '09:00', end: '17:00', available: true },
      thursday: { start: '09:00', end: '17:00', available: true },
      friday: { start: '09:00', end: '17:00', available: true },
      saturday: { start: '09:00', end: '15:00', available: true },
      sunday: { start: '10:00', end: '14:00', available: false }
    },
    languages: ['English', 'French'],
    nationality: 'British',
    religion: 'Christian',
    ethnicity: 'White British',
    gender: 'Female' as const,
    isApproved: true
  },
  {
    licenseNumber: 'ADI-001235',
    experience: 12,
    specialties: ['Manual Transmission', 'Advanced Driving', 'Refresher Courses'],
    transmissionTypes: ['manual'],
    pricePerHour: '38.00',
    location: 'North London',
    bio: 'Experienced manual transmission specialist with advanced driving qualifications and 12 years of teaching experience.',
    availability: {
      monday: { start: '08:00', end: '16:00', available: true },
      tuesday: { start: '08:00', end: '16:00', available: true },
      wednesday: { start: '08:00', end: '16:00', available: true },
      thursday: { start: '08:00', end: '16:00', available: true },
      friday: { start: '08:00', end: '16:00', available: true },
      saturday: { start: '09:00', end: '17:00', available: true },
      sunday: { start: '10:00', end: '14:00', available: false }
    },
    languages: ['English', 'Mandarin'],
    nationality: 'British Chinese',
    religion: 'Buddhist',
    ethnicity: 'Asian British',
    gender: 'Male' as const,
    isApproved: true
  },
  {
    licenseNumber: 'ADI-001236',
    experience: 6,
    specialties: ['Automatic Transmission', 'Female Instructors', 'Elderly Learners'],
    transmissionTypes: ['automatic'],
    pricePerHour: '33.00',
    location: 'South London',
    bio: 'Female instructor specializing in automatic transmission and providing comfortable learning environment for female and elderly learners.',
    availability: {
      monday: { start: '10:00', end: '18:00', available: true },
      tuesday: { start: '10:00', end: '18:00', available: true },
      wednesday: { start: '10:00', end: '18:00', available: true },
      thursday: { start: '10:00', end: '18:00', available: true },
      friday: { start: '10:00', end: '18:00', available: true },
      saturday: { start: '08:00', end: '16:00', available: true },
      sunday: { start: '10:00', end: '14:00', available: false }
    },
    languages: ['English'],
    nationality: 'British',
    religion: 'Christian',
    ethnicity: 'White British',
    gender: 'Female' as const,
    isApproved: true
  },
  {
    licenseNumber: 'ADI-001237',
    experience: 15,
    specialties: ['Pass Plus', 'Motorway Driving', 'Advanced Maneuvers'],
    transmissionTypes: ['manual', 'automatic'],
    pricePerHour: '42.00',
    location: 'East London',
    bio: 'Senior instructor with 15 years experience, Pass Plus qualified, specializing in advanced driving skills and motorway instruction.',
    availability: {
      monday: { start: '07:00', end: '19:00', available: true },
      tuesday: { start: '07:00', end: '19:00', available: true },
      wednesday: { start: '07:00', end: '19:00', available: true },
      thursday: { start: '07:00', end: '19:00', available: true },
      friday: { start: '07:00', end: '19:00', available: true },
      saturday: { start: '08:00', end: '18:00', available: true },
      sunday: { start: '09:00', end: '17:00', available: true }
    },
    languages: ['English'],
    nationality: 'British',
    religion: 'Christian',
    ethnicity: 'White British',
    gender: 'Male' as const,
    isApproved: true
  },
  {
    licenseNumber: 'ADI-001238',
    experience: 4,
    specialties: ['Young Drivers', 'Intensive Courses', 'Multi-lingual Instruction'],
    transmissionTypes: ['manual', 'automatic'],
    pricePerHour: '30.00',
    location: 'West London',
    bio: 'Energetic instructor specializing in young drivers and intensive courses. Fluent in multiple languages.',
    availability: {
      monday: { start: '11:00', end: '19:00', available: true },
      tuesday: { start: '11:00', end: '19:00', available: true },
      wednesday: { start: '11:00', end: '19:00', available: true },
      thursday: { start: '11:00', end: '19:00', available: true },
      friday: { start: '11:00', end: '19:00', available: true },
      saturday: { start: '09:00', end: '17:00', available: true },
      sunday: { start: '12:00', end: '16:00', available: false }
    },
    languages: ['English', 'Spanish', 'Portuguese'],
    nationality: 'Spanish',
    religion: 'Catholic',
    ethnicity: 'Hispanic',
    gender: 'Female' as const,
    isApproved: true
  }
];

const studentProfiles = [
  {
    dateOfBirth: new Date('1995-03-15'),
    address: '123 High Street, London, SW1A 1AA',
    emergencyContact: '07700900400',
    licenseStatus: 'provisional' as const,
    medicalConditions: null
  },
  {
    dateOfBirth: new Date('1998-07-22'),
    address: '456 Park Road, Manchester, M1 1AA',
    emergencyContact: '07700900401',
    licenseStatus: 'provisional' as const,
    medicalConditions: null
  },
  {
    dateOfBirth: new Date('1992-11-08'),
    address: '789 Church Lane, Birmingham, B1 1AA',
    emergencyContact: '07700900402',
    licenseStatus: 'none' as const,
    medicalConditions: null
  },
  {
    dateOfBirth: new Date('2000-01-30'),
    address: '321 Queen Street, Edinburgh, EH1 1AA',
    emergencyContact: '07700900403',
    licenseStatus: 'provisional' as const,
    medicalConditions: null
  },
  {
    dateOfBirth: new Date('1988-05-12'),
    address: '654 King Road, Cardiff, CF1 1AA',
    emergencyContact: '07700900404',
    licenseStatus: 'provisional' as const,
    medicalConditions: 'Requires glasses for driving'
  },
  {
    dateOfBirth: new Date('1996-09-18'),
    address: '987 Victoria Street, Belfast, BT1 1AA',
    emergencyContact: '07700900405',
    licenseStatus: 'provisional' as const,
    medicalConditions: null
  }
];

const courseData = [
  {
    title: 'Absolute Beginner',
    description: 'Perfect for those who have never been behind the wheel',
    level: 'absolute-beginner' as const,
    totalHours: 40,
    price: '1200.00',
    features: [
      'Complete introduction to vehicle controls and safety',
      'Dual-control vehicle for maximum safety',
      'Patient, experienced instructors specializing in new drivers',
      'Theory test preparation and mock tests',
      'Basic road positioning and traffic awareness',
      'Introduction to Highway Code',
      'Parking fundamentals',
      'Build confidence step by step'
    ],
    color: 'green',
    isRecommended: false,
    isActive: true
  },
  {
    title: 'Beginner',
    description: 'Build on existing basic knowledge',
    level: 'beginner' as const,
    totalHours: 30,
    price: '900.00',
    features: [
      'Building on existing basic knowledge',
      'Focus on practical driving skills development',
      'Urban and suburban driving practice',
      'Traffic navigation and road positioning',
      'Roundabout and junction handling',
      'Parking skills improvement (parallel, bay, reverse)',
      'Theory test support and practice',
      'Mock driving test preparation'
    ],
    color: 'blue',
    isRecommended: true,
    isActive: true
  },
  {
    title: 'Intermediate',
    description: 'Advance your skills with more complex driving scenarios',
    level: 'intermediate' as const,
    totalHours: 20,
    price: '600.00',
    features: [
      'Advanced junction and roundabout navigation',
      'Dual carriageway and motorway preparation',
      'Complex parking maneuvers mastery',
      'Night driving and adverse weather conditions',
      'Advanced hazard awareness and anticipation',
      'Independent driving route planning',
      'Mock test practice in test conditions',
      'Advanced vehicle control techniques'
    ],
    color: 'orange',
    isRecommended: false,
    isActive: true
  },
  {
    title: 'Advanced',
    description: 'Master advanced techniques and prepare for your test',
    level: 'advanced' as const,
    totalHours: 15,
    price: '450.00',
    features: [
      'Test-standard driving practice',
      'Advanced maneuvering techniques',
      'Motorway driving instruction (Pass Plus preparation)',
      'Defensive driving strategies',
      'Advanced parking in challenging spaces',
      'Test route familiarization',
      'Last-minute test preparation',
      'Post-test advanced skills development'
    ],
    color: 'red',
    isRecommended: false,
    isActive: true
  },
  {
    title: 'Intensive Course',
    description: 'Fast-track your learning with our intensive program',
    level: 'intermediate' as const,
    totalHours: 25,
    price: '750.00',
    features: [
      'Accelerated learning program',
      'Multiple lessons per week',
      'Fast-track to test readiness',
      'Experienced intensive course instructors',
      'Flexible scheduling options',
      'Theory and practical test preparation',
      'High pass rate success',
      'Suitable for motivated learners'
    ],
    color: 'purple',
    isRecommended: false,
    isActive: true
  }
];

const systemSettings = [
  {
    key: 'booking_advance_days',
    value: '30',
    category: 'booking',
    description: 'Maximum number of days in advance bookings can be made'
  },
  {
    key: 'cancellation_hours',
    value: '24',
    category: 'booking',
    description: 'Minimum hours before lesson for free cancellation'
  },
  {
    key: 'max_lessons_per_day',
    value: '8',
    category: 'scheduling',
    description: 'Maximum lessons an instructor can have per day'
  },
  {
    key: 'payment_methods',
    value: 'card,paypal,bank_transfer',
    category: 'payment',
    description: 'Accepted payment methods'
  },
  {
    key: 'school_name',
    value: 'DriveSchool Pro',
    category: 'general',
    description: 'Name of the driving school'
  },
  {
    key: 'contact_email',
    value: 'info@driveschool.com',
    category: 'contact',
    description: 'Main contact email address'
  },
  {
    key: 'contact_phone',
    value: '0800-123-4567',
    category: 'contact',
    description: 'Main contact phone number'
  }
];

async function seedComprehensive() {
  try {
    console.log('🌱 Starting comprehensive database seeding...');

    // 1. Clear existing data (optional - comment out if you want to keep existing data)
    console.log('🧹 Clearing existing data...');
    await db.delete(activityLogs);
    await db.delete(lessons);
    await db.delete(bookings);
    await db.delete(coursePurchases);
    await db.delete(courses);
    await db.delete(instructors);
    await db.delete(students);
    await db.delete(settings);
    await db.delete(users);

    // 2. Seed Users
    console.log('👥 Seeding users...');
    const createdUsers = [];
    for (const user of sampleUsers) {
      const passwordHash = await hashPassword(user.password);
      const [createdUser] = await db.insert(users).values({
        name: user.name,
        email: user.email,
        passwordHash,
        role: user.role,
        phone: user.phone,
        avatar: user.avatar,
        isActive: true
      }).returning();
      createdUsers.push(createdUser);
    }
    console.log(`✅ Created ${createdUsers.length} users`);

    // 3. Seed Courses
    console.log('📚 Seeding courses...');
    const createdCourses = [];
    for (const course of courseData) {
      const [createdCourse] = await db.insert(courses).values(course).returning();
      createdCourses.push(createdCourse);
    }
    console.log(`✅ Created ${createdCourses.length} courses`);

    // 4. Seed Instructors
    console.log('👨‍🏫 Seeding instructors...');
    const instructorUsers = createdUsers.filter(u => u.role === 'instructor');
    const createdInstructors = [];
    for (let i = 0; i < instructorUsers.length; i++) {
      const [createdInstructor] = await db.insert(instructors).values({
        userId: instructorUsers[i].id,
        ...instructorProfiles[i]
      }).returning();
      createdInstructors.push(createdInstructor);
    }
    console.log(`✅ Created ${createdInstructors.length} instructors`);

    // 5. Seed Students
    console.log('👨‍🎓 Seeding students...');
    const studentUsers = createdUsers.filter(u => u.role === 'student');
    const createdStudents = [];
    for (let i = 0; i < studentUsers.length && i < studentProfiles.length; i++) {
      const [createdStudent] = await db.insert(students).values({
        userId: studentUsers[i].id,
        ...studentProfiles[i]
      }).returning();
      createdStudents.push(createdStudent);
    }
    console.log(`✅ Created ${createdStudents.length} students`);

    // 6. Seed Bookings
    console.log('📅 Seeding bookings...');
    const createdBookings = [];
    const bookingStatuses = ['pending', 'confirmed', 'completed', 'cancelled'];
    
    for (let i = 0; i < Math.min(createdStudents.length, 10); i++) {
      const student = createdStudents[i % createdStudents.length];
      const instructor = createdInstructors[i % createdInstructors.length];
      const course = createdCourses[i % createdCourses.length];
      
      // Create booking for next week
      const scheduledDate = new Date();
      scheduledDate.setDate(scheduledDate.getDate() + 7 + i);
      
      const [booking] = await db.insert(bookings).values({
        studentId: student.id,
        instructorId: instructor.id,
        courseId: course.id,
        status: bookingStatuses[i % bookingStatuses.length],
        scheduledDate,
        duration: 120, // 2 hours
        totalCost: instructor.pricePerHour,
        notes: `Test booking ${i + 1} - ${course.title} course with ${instructorUsers[i % instructorUsers.length].name}`
      }).returning();
      
      createdBookings.push(booking);
    }
    console.log(`✅ Created ${createdBookings.length} bookings`);

    // 7. Seed Lessons
    console.log('📖 Seeding lessons...');
    const createdLessons = [];
    const lessonStatuses = ['scheduled', 'completed', 'cancelled', 'no-show'];
    
    for (let i = 0; i < createdBookings.length; i++) {
      const booking = createdBookings[i];
      const instructor = createdInstructors.find(inst => inst.id === booking.instructorId);
      const student = createdStudents.find(stud => stud.id === booking.studentId);
      
      if (instructor && student) {
        const [lesson] = await db.insert(lessons).values({
          bookingId: booking.id,
          studentId: student.id,
          instructorId: instructor.id,
          lessonDate: booking.scheduledDate,
          startTime: '10:00:00',
          endTime: '12:00:00',
          status: lessonStatuses[i % lessonStatuses.length],
          studentProgress: i % 2 === 0 ? 'Good progress with parallel parking. Needs work on roundabouts.' : 'Excellent observation skills. Ready for independent driving practice.',
          instructorNotes: i % 2 === 0 ? 'Student is building confidence. Recommend more city center practice.' : 'Very capable learner. Focus on test preparation in next lessons.',
          skills: ['parking', 'roundabouts', 'traffic_lights', 'observations']
        }).returning();
        
        createdLessons.push(lesson);
      }
    }
    console.log(`✅ Created ${createdLessons.length} lessons`);

    // 8. Seed Settings
    console.log('⚙️ Seeding system settings...');
    for (const setting of systemSettings) {
      await db.insert(settings).values(setting);
    }
    console.log(`✅ Created ${systemSettings.length} settings`);

    // 9. Seed Activity Logs
    console.log('📊 Seeding activity logs...');
    const activities = ['SIGN_UP', 'SIGN_IN', 'BOOKING_CREATED', 'LESSON_COMPLETED', 'UPDATE_ACCOUNT'];
    for (let i = 0; i < 20; i++) {
      const user = createdUsers[i % createdUsers.length];
      const activity = activities[i % activities.length];
      
      const logTime = new Date();
      logTime.setHours(logTime.getHours() - (i * 2));
      
      await db.insert(activityLogs).values({
        userId: user.id,
        action: activity as any,
        timestamp: logTime,
        ipAddress: `192.168.1.${100 + i}`,
        metadata: {
          userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          action: activity,
          details: `User ${user.name} performed ${activity.toLowerCase().replace('_', ' ')}`
        }
      });
    }
    console.log(`✅ Created 20 activity logs`);

    // 10. Seed Course Purchases (for statistics)
    console.log('🛒 Seeding course purchases...');
    const purchaseCount = 25;
    for (let i = 0; i < purchaseCount; i++) {
      const course = createdCourses[i % createdCourses.length];
      const student = createdStudents[i % createdStudents.length];
      const studentUser = studentUsers[i % studentUsers.length];
      
      const purchaseTime = new Date();
      purchaseTime.setHours(purchaseTime.getHours() - (i * 3));
      
      await db.insert(coursePurchases).values({
        courseId: course.id,
        studentName: studentUser.name,
        studentEmail: studentUser.email,
        location: ['City Centre', 'North London', 'South London', 'East London', 'West London'][i % 5],
        purchaseAmount: course.price,
        isRealPurchase: true,
        metadata: {
          userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          ipAddress: `192.168.1.${200 + i}`,
          referrer: 'https://google.com'
        }
      });
    }
    console.log(`✅ Created ${purchaseCount} course purchases`);

    // Summary
    console.log('\n🎉 COMPREHENSIVE SEEDING COMPLETED!');
    console.log('📈 Summary of created data:');
    console.log(`   👥 Users: ${createdUsers.length}`);
    console.log(`   👨‍🏫 Instructors: ${createdInstructors.length}`);
    console.log(`   👨‍🎓 Students: ${createdStudents.length}`);
    console.log(`   📚 Courses: ${createdCourses.length}`);
    console.log(`   📅 Bookings: ${createdBookings.length}`);
    console.log(`   📖 Lessons: ${createdLessons.length}`);
    console.log(`   ⚙️ Settings: ${systemSettings.length}`);
    console.log(`   📊 Activity Logs: 20`);
    console.log(`   🛒 Course Purchases: ${purchaseCount}`);
    
    console.log('\n🔐 Test Account Credentials:');
    console.log('   Admin: admin@driveschool.com / admin123');
    console.log('   Instructor: sarah.jones@instructor.com / instructor123');
    console.log('   Student: john.smith@student.com / student123');

  } catch (error) {
    console.error('❌ Comprehensive seeding failed:', error);
    throw error;
  }
}

// Run if called directly
if (require.main === module) {
  seedComprehensive()
    .then(() => {
      console.log('✨ Database seeding completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Database seeding failed:', error);
      process.exit(1);
    });
}

export default seedComprehensive;