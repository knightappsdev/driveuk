const { drizzle } = require('drizzle-orm/postgres-js');
const postgres = require('postgres');
const { ukTheoryCategories, ukTheoryQuestions, achievements } = require('../lib/db/schema');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

// Database connection
const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error('DATABASE_URL environment variable is required');
}

const client = postgres(connectionString);
const db = drizzle(client);

// Complete DVSA Theory Test Categories
const categories = [
  {
    categoryCode: 'ALERTNESS',
    categoryName: 'Alertness',
    description: 'Being aware of hazards and maintaining concentration while driving',
    totalQuestions: 50,
    passRequirement: 4,
    displayOrder: 1,
    isActive: true
  },
  {
    categoryCode: 'ATTITUDE',
    categoryName: 'Attitude',
    description: 'Showing consideration and courtesy to other road users',
    totalQuestions: 45,
    passRequirement: 4,
    displayOrder: 2,
    isActive: true
  },
  {
    categoryCode: 'SAFETY_AND_YOUR_VEHICLE',
    categoryName: 'Safety and Your Vehicle',
    description: 'Vehicle safety checks, fault recognition, and maintenance',
    totalQuestions: 55,
    passRequirement: 4,
    displayOrder: 3,
    isActive: true
  },
  {
    categoryCode: 'HAZARD_AWARENESS',
    categoryName: 'Hazard Awareness',
    description: 'Recognizing and responding to potential hazards',
    totalQuestions: 60,
    passRequirement: 5,
    displayOrder: 4,
    isActive: true
  },
  {
    categoryCode: 'VULNERABLE_ROAD_USERS',
    categoryName: 'Vulnerable Road Users',
    description: 'Sharing the road safely with pedestrians, cyclists, and motorcyclists',
    totalQuestions: 48,
    passRequirement: 4,
    displayOrder: 5,
    isActive: true
  },
  {
    categoryCode: 'OTHER_TYPES_OF_VEHICLE',
    categoryName: 'Other Types of Vehicle',
    description: 'Understanding the characteristics of different vehicle types',
    totalQuestions: 42,
    passRequirement: 4,
    displayOrder: 6,
    isActive: true
  },
  {
    categoryCode: 'VEHICLE_HANDLING',
    categoryName: 'Vehicle Handling',
    description: 'Safe vehicle control in various conditions',
    totalQuestions: 38,
    passRequirement: 3,
    displayOrder: 7,
    isActive: true
  },
  {
    categoryCode: 'MOTORWAY_RULES',
    categoryName: 'Motorway Rules',
    description: 'Safe driving on motorways and dual carriageways',
    totalQuestions: 35,
    passRequirement: 3,
    displayOrder: 8,
    isActive: true
  },
  {
    categoryCode: 'RULES_OF_THE_ROAD',
    categoryName: 'Rules of the Road',
    description: 'Traffic signs, road markings, and traffic regulations',
    totalQuestions: 52,
    passRequirement: 4,
    displayOrder: 9,
    isActive: true
  },
  {
    categoryCode: 'ROAD_AND_TRAFFIC_SIGNS',
    categoryName: 'Road and Traffic Signs',
    description: 'Understanding and responding to road signs and signals',
    totalQuestions: 58,
    passRequirement: 5,
    displayOrder: 10,
    isActive: true
  },
  {
    categoryCode: 'DOCUMENTS',
    categoryName: 'Documents',
    description: 'Legal requirements for driving licenses and vehicle documents',
    totalQuestions: 28,
    passRequirement: 2,
    displayOrder: 11,
    isActive: true
  },
  {
    categoryCode: 'INCIDENTS_ACCIDENTS_EMERGENCIES',
    categoryName: 'Incidents, Accidents and Emergencies',
    description: 'What to do in emergency situations and at accident scenes',
    totalQuestions: 44,
    passRequirement: 4,
    displayOrder: 12,
    isActive: true
  },
  {
    categoryCode: 'VEHICLE_LOADING',
    categoryName: 'Vehicle Loading',
    description: 'Safe loading and securing of passengers and cargo',
    totalQuestions: 25,
    passRequirement: 2,
    displayOrder: 13,
    isActive: true
  },
  {
    categoryCode: 'SAFETY_MARGINS',
    categoryName: 'Safety Margins and Environment',
    description: 'Reducing environmental impact and maintaining safe distances',
    totalQuestions: 30,
    passRequirement: 3,
    displayOrder: 14,
    isActive: true
  },
  {
    categoryCode: 'VEHICLE_SAFETY',
    categoryName: 'Vehicle Safety',
    description: 'Understanding braking distances and vehicle safety systems',
    totalQuestions: 20,
    passRequirement: 2,
    displayOrder: 15,
    isActive: true
  }
];

// Comprehensive DVSA Theory Questions (5-10 questions per category)
const comprehensiveQuestions = [
  // ================ ALERTNESS CATEGORY (10 questions) ================
  {
    categoryCode: 'ALERTNESS',
    questionType: 'multiple_choice',
    difficultyLevel: 'foundation',
    questionText: 'What should you do when you feel tired while driving?',
    optionA: 'Turn up the radio',
    optionB: 'Open the windows',
    optionC: 'Stop and rest',
    optionD: 'Drink coffee',
    correctAnswer: 'C',
    explanation: 'When you feel tired, the safest thing to do is to stop and rest. No amount of fresh air or stimulants can substitute for proper rest.',
    officialReference: 'HC Rule 91',
    isActive: true
  },
  {
    categoryCode: 'ALERTNESS',
    questionType: 'multiple_choice',
    difficultyLevel: 'intermediate',
    questionText: 'You are driving at night and are dazzled by the headlights of an oncoming vehicle. What should you do?',
    optionA: 'Flash your headlights',
    optionB: 'Slow down and look to the left',
    optionC: 'Close one eye',
    optionD: 'Brake hard',
    correctAnswer: 'B',
    explanation: 'When dazzled by oncoming headlights, slow down and look to the left side of the road to maintain your path while your eyes readjust.',
    officialReference: 'HC Rule 115',
    isActive: true
  },
  {
    categoryCode: 'ALERTNESS',
    questionType: 'multiple_choice',
    difficultyLevel: 'foundation',
    questionText: 'When should you use your hazard warning lights?',
    optionA: 'When parking on double yellow lines',
    optionB: 'When your vehicle has broken down',
    optionC: 'When reversing into a parking space',
    optionD: 'When driving slowly in traffic',
    correctAnswer: 'B',
    explanation: 'Hazard warning lights should be used when your vehicle is stationary and causing a temporary obstruction, such as when broken down.',
    officialReference: 'HC Rule 116',
    isActive: true
  },
  {
    categoryCode: 'ALERTNESS',
    questionType: 'multiple_choice',
    difficultyLevel: 'intermediate',
    questionText: 'You are driving behind a large goods vehicle. What should you do to improve your view ahead?',
    optionA: 'Move closer to the vehicle',
    optionB: 'Move to the left',
    optionC: 'Keep well back',
    optionD: 'Keep to the right',
    correctAnswer: 'C',
    explanation: 'Keeping well back from large vehicles improves your view of the road ahead and gives you more time to react to hazards.',
    officialReference: 'HC Rule 164',
    isActive: true
  },
  {
    categoryCode: 'ALERTNESS',
    questionType: 'multiple_choice',
    difficultyLevel: 'advanced',
    questionText: 'What does the term "lifesaver" mean to a motorcyclist?',
    optionA: 'Looking over their shoulder before changing direction',
    optionB: 'Wearing bright clothing',
    optionC: 'Using dipped headlights',
    optionD: 'Riding defensively',
    correctAnswer: 'A',
    explanation: 'The "lifesaver" is a final check over the shoulder before changing direction to spot any vehicles in the blind spot.',
    officialReference: 'HC Rule 88',
    isActive: true
  },
  {
    categoryCode: 'ALERTNESS',
    questionType: 'multiple_choice',
    difficultyLevel: 'foundation',
    questionText: 'You should switch on your hazard warning lights when:',
    optionA: 'You are double-parked on a two-way road',
    optionB: 'Your direction indicators are not working',
    optionC: 'You slow down quickly on a motorway because of a hazard ahead',
    optionD: 'You have just passed your driving test',
    correctAnswer: 'C',
    explanation: 'You may use hazard warning lights to warn drivers behind you of a hazard or obstruction ahead.',
    officialReference: 'HC Rule 116',
    isActive: true
  },
  {
    categoryCode: 'ALERTNESS',
    questionType: 'multiple_choice',
    difficultyLevel: 'intermediate',
    questionText: 'You are following a vehicle at a safe distance on a wet road. Another driver overtakes you and moves into the gap. What should you do?',
    optionA: 'Flash your headlights as a warning',
    optionB: 'Try to overtake safely as soon as you can',
    optionC: 'Drop back to regain a safe distance',
    optionD: 'Stay close to the other vehicle until it moves away',
    correctAnswer: 'C',
    explanation: 'Always maintain a safe following distance. If another vehicle moves into your safety gap, drop back to re-establish it.',
    officialReference: 'HC Rule 126',
    isActive: true
  },
  {
    categoryCode: 'ALERTNESS',
    questionType: 'multiple_choice',
    difficultyLevel: 'advanced',
    questionText: 'Which of these is LEAST likely to affect your concentration while driving?',
    optionA: 'Using a mobile phone',
    optionB: 'Thinking about work',
    optionC: 'Looking at road signs',
    optionD: 'Listening to loud music',
    correctAnswer: 'C',
    explanation: 'Looking at road signs is part of driving safely. All other options can dangerously distract your attention from driving.',
    officialReference: 'HC Rule 148',
    isActive: true
  },
  {
    categoryCode: 'ALERTNESS',
    questionType: 'multiple_choice',
    difficultyLevel: 'foundation',
    questionText: 'You are driving on a clear night. There is a steady stream of oncoming traffic. The national speed limit applies. Which lights should you use?',
    optionA: 'Full beam headlights',
    optionB: 'Sidelights',
    optionC: 'Dipped headlights',
    optionD: 'Fog lights',
    correctAnswer: 'C',
    explanation: 'Use dipped headlights when there is oncoming traffic to avoid dazzling other drivers.',
    officialReference: 'HC Rule 114',
    isActive: true
  },
  {
    categoryCode: 'ALERTNESS',
    questionType: 'multiple_choice',
    difficultyLevel: 'intermediate',
    questionText: 'You are driving in fog. Why should you keep well back from the vehicle in front?',
    optionA: 'In case it changes direction suddenly',
    optionB: 'In case its fog lights dazzle you',
    optionC: 'In case it stops suddenly',
    optionD: 'In case its brake lights are broken',
    correctAnswer: 'C',
    explanation: 'In fog, you cannot see as far ahead, so you need more distance to stop safely if the vehicle in front stops suddenly.',
    officialReference: 'HC Rule 235',
    isActive: true
  },

  // ================ ATTITUDE CATEGORY (8 questions) ================
  {
    categoryCode: 'ATTITUDE',
    questionType: 'multiple_choice',
    difficultyLevel: 'foundation',
    questionText: 'A driver pulls out of a side road in front of you. They clearly have not seen you. What should you do?',
    optionA: 'Flash your lights and sound your horn',
    optionB: 'Overtake as soon as possible',
    optionC: 'Drop back to regain a safe separation distance',
    optionD: 'Drive close behind and flash your lights',
    correctAnswer: 'C',
    explanation: 'The safest response is to drop back and regain a safe following distance. This shows consideration and reduces the risk of an accident.',
    officialReference: 'HC Rule 126',
    isActive: true
  },
  {
    categoryCode: 'ATTITUDE',
    questionType: 'multiple_choice',
    difficultyLevel: 'intermediate',
    questionText: 'You are in a line of traffic. The driver behind you is following very closely. What action should you take?',
    optionA: 'Ignore the following driver and continue to travel within the speed limit',
    optionB: 'Slow down, gradually increasing the gap between you and the vehicle in front',
    optionC: 'Signal left and wave the following driver past',
    optionD: 'Move over to a position just left of centre and speed up',
    correctAnswer: 'B',
    explanation: 'By increasing the gap in front, you give yourself more time to brake gently if needed, reducing the risk of the tailgating driver hitting you.',
    officialReference: 'HC Rule 126',
    isActive: true
  },
  {
    categoryCode: 'ATTITUDE',
    questionType: 'multiple_choice',
    difficultyLevel: 'foundation',
    questionText: 'You wish to turn right ahead. Why should you take up the correct position in good time?',
    optionA: 'To allow other drivers to pull out in front of you',
    optionB: 'To give a clear signal of your intentions',
    optionC: 'To help other drivers make up their minds',
    optionD: 'To allow drivers to pass you on the right',
    correctAnswer: 'B',
    explanation: 'Taking up the correct position early gives other road users clear warning of your intentions to turn right.',
    officialReference: 'HC Rule 179',
    isActive: true
  },
  {
    categoryCode: 'ATTITUDE',
    questionType: 'multiple_choice',
    difficultyLevel: 'intermediate',
    questionText: 'You are travelling at the legal speed limit. A vehicle comes up quickly behind, flashing its headlights. You should:',
    optionA: 'Accelerate to make a gap behind you',
    optionB: 'Touch the brakes sharply to show your brake lights',
    optionC: 'Maintain your speed and road position',
    optionD: 'Allow the vehicle to overtake',
    correctAnswer: 'D',
    explanation: 'Even if you are driving at the speed limit, you should allow faster traffic to overtake when safe to do so.',
    officialReference: 'HC Rule 168',
    isActive: true
  },
  {
    categoryCode: 'ATTITUDE',
    questionType: 'multiple_choice',
    difficultyLevel: 'advanced',
    questionText: 'You are driving at night on an unlit road behind another vehicle. You should:',
    optionA: 'Flash your headlights',
    optionB: 'Use dipped beam headlights',
    optionC: 'Switch off your headlights',
    optionD: 'Use full beam headlights',
    correctAnswer: 'B',
    explanation: 'Use dipped beam when following another vehicle to avoid dazzling the driver through their mirrors.',
    officialReference: 'HC Rule 115',
    isActive: true
  },
  {
    categoryCode: 'ATTITUDE',
    questionType: 'multiple_choice',
    difficultyLevel: 'foundation',
    questionText: 'A pelican crossing that crosses the road in a STRAIGHT line and has a central island is:',
    optionA: 'One crossing',
    optionB: 'Two separate crossings',
    optionC: 'A dangerous crossing',
    optionD: 'Not controlled by lights',
    correctAnswer: 'A',
    explanation: 'When a pelican crossing goes straight across the road, even with a central island, it counts as one crossing.',
    officialReference: 'HC Rule 196',
    isActive: true
  },
  {
    categoryCode: 'ATTITUDE',
    questionType: 'multiple_choice',
    difficultyLevel: 'intermediate',
    questionText: 'At a puffin crossing, which colour follows the green signal?',
    optionA: 'Steady red',
    optionB: 'Flashing amber',
    optionC: 'Steady amber',
    optionD: 'Flashing green',
    correctAnswer: 'C',
    explanation: 'At a puffin crossing, steady amber follows green, just like normal traffic lights.',
    officialReference: 'HC Rule 196',
    isActive: true
  },
  {
    categoryCode: 'ATTITUDE',
    questionType: 'multiple_choice',
    difficultyLevel: 'advanced',
    questionText: 'You should ONLY flash your headlights to:',
    optionA: 'Show that you are giving way',
    optionB: 'Show that you are about to turn',
    optionC: 'Tell other road users that you are there',
    optionD: 'Greet other road users that you know',
    correctAnswer: 'C',
    explanation: 'You should only flash your headlights to let other road users know that you are there.',
    officialReference: 'HC Rule 110',
    isActive: true
  },

  // ================ SAFETY AND YOUR VEHICLE CATEGORY (8 questions) ================
  {
    categoryCode: 'SAFETY_AND_YOUR_VEHICLE',
    questionType: 'multiple_choice',
    difficultyLevel: 'foundation',
    questionText: 'How often should you check your engine oil level?',
    optionA: 'Before every journey',
    optionB: 'Weekly',
    optionC: 'Monthly',
    optionD: 'Every 6 months',
    correctAnswer: 'B',
    explanation: 'You should check your engine oil level at least weekly, and always before long journeys.',
    officialReference: 'HC Rule 89',
    isActive: true
  },
  {
    categoryCode: 'SAFETY_AND_YOUR_VEHICLE',
    questionType: 'multiple_choice',
    difficultyLevel: 'intermediate',
    questionText: 'What is the legal minimum tread depth for car tyres?',
    optionA: '1.6mm',
    optionB: '2.0mm',
    optionC: '2.5mm',
    optionD: '3.0mm',
    correctAnswer: 'A',
    explanation: 'The legal minimum tread depth for car tyres is 1.6mm across the central three-quarters of the tyre width.',
    officialReference: 'Road Traffic Act',
    isActive: true
  },
  {
    categoryCode: 'SAFETY_AND_YOUR_VEHICLE',
    questionType: 'multiple_choice',
    difficultyLevel: 'foundation',
    questionText: 'Which of these, if allowed to get low, could cause you to have an accident?',
    optionA: 'Anti-freeze level',
    optionB: 'Brake fluid level',
    optionC: 'Battery water level',
    optionD: 'Radiator coolant level',
    correctAnswer: 'B',
    explanation: 'Low brake fluid can cause brake failure, which could result in a serious accident. Check it regularly.',
    officialReference: 'HC Rule 89',
    isActive: true
  },
  {
    categoryCode: 'SAFETY_AND_YOUR_VEHICLE',
    questionType: 'multiple_choice',
    difficultyLevel: 'intermediate',
    questionText: 'You are carrying two 13-year-old children and their parents in your car. Who is responsible for ensuring the children wear seat belts?',
    optionA: 'The children',
    optionB: 'The parents',
    optionC: 'You, the driver',
    optionD: 'The front seat passenger',
    correctAnswer: 'C',
    explanation: 'The driver is responsible for ensuring that children under 14 years wear seat belts or use an appropriate child restraint.',
    officialReference: 'HC Rule 99',
    isActive: true
  },
  {
    categoryCode: 'SAFETY_AND_YOUR_VEHICLE',
    questionType: 'multiple_choice',
    difficultyLevel: 'advanced',
    questionText: 'When should you check your tyre pressures?',
    optionA: 'After any lengthy journey',
    optionB: 'After travelling at high speed',
    optionC: 'When tyres are hot',
    optionD: 'When tyres are cold',
    correctAnswer: 'D',
    explanation: 'Tyre pressures should be checked when tyres are cold for an accurate reading. Hot tyres will give a higher pressure reading.',
    officialReference: 'HC Rule 89',
    isActive: true
  },
  {
    categoryCode: 'SAFETY_AND_YOUR_VEHICLE',
    questionType: 'multiple_choice',
    difficultyLevel: 'foundation',
    questionText: 'Which of these is most likely to dazzle the driver of a vehicle behind you?',
    optionA: 'A cracked rear windscreen',
    optionB: 'A rear windscreen with tinted glass',
    optionC: 'A rear windscreen with a heated element',
    optionD: 'A dirty rear windscreen',
    correctAnswer: 'A',
    explanation: 'A cracked windscreen can reflect and scatter light, potentially dazzling drivers behind you.',
    officialReference: 'HC Rule 89',
    isActive: true
  },
  {
    categoryCode: 'SAFETY_AND_YOUR_VEHICLE',
    questionType: 'multiple_choice',
    difficultyLevel: 'intermediate',
    questionText: 'Your vehicle pulls to the left when braking. You should:',
    optionA: 'Pump the pedal when braking',
    optionB: 'Use your parking brake at the same time',
    optionC: 'Consult your garage as soon as possible',
    optionD: 'Use cadence braking',
    correctAnswer: 'C',
    explanation: 'If your vehicle pulls to one side when braking, there may be a brake defect. Have it checked immediately by a qualified mechanic.',
    officialReference: 'HC Rule 89',
    isActive: true
  },
  {
    categoryCode: 'SAFETY_AND_YOUR_VEHICLE',
    questionType: 'multiple_choice',
    difficultyLevel: 'advanced',
    questionText: 'Anti-lock brakes prevent wheels from locking. This means the tyres are less likely to:',
    optionA: 'Aquaplane',
    optionB: 'Skid',
    optionC: 'Puncture',
    optionD: 'Wear',
    correctAnswer: 'B',
    explanation: 'Anti-lock brakes prevent wheel lock-up, which reduces the likelihood of skidding and helps maintain steering control.',
    officialReference: 'HC Rule 89',
    isActive: true
  },

  // ================ HAZARD AWARENESS CATEGORY (10 questions) ================
  {
    categoryCode: 'HAZARD_AWARENESS',
    questionType: 'multiple_choice',
    difficultyLevel: 'intermediate',
    questionText: 'You see a ball bouncing out from behind a parked car. What should you do?',
    optionA: 'Continue at the same speed',
    optionB: 'Slow down and be prepared to stop',
    optionC: 'Swerve around the ball',
    optionD: 'Sound your horn',
    correctAnswer: 'B',
    explanation: 'A ball bouncing into the road often means a child may follow. Slow down and be prepared to stop immediately.',
    officialReference: 'HC Rule 206',
    isActive: true
  },
  {
    categoryCode: 'HAZARD_AWARENESS',
    questionType: 'multiple_choice',
    difficultyLevel: 'foundation',
    questionText: 'What is the most common cause of skidding?',
    optionA: 'Worn tyres',
    optionB: 'Driver error',
    optionC: 'Other vehicles',
    optionD: 'Pedestrians',
    correctAnswer: 'B',
    explanation: 'Most skids are caused by driver error - driving too fast for the conditions, harsh braking, or sudden steering movements.',
    officialReference: 'HC Rule 119',
    isActive: true
  },
  {
    categoryCode: 'HAZARD_AWARENESS',
    questionType: 'multiple_choice',
    difficultyLevel: 'advanced',
    questionText: 'You are approaching a crossroads. The traffic lights have failed. What should you do?',
    optionA: 'Brake and stop only for large vehicles',
    optionB: 'Brake sharply to a stop before looking',
    optionC: 'Be prepared to brake sharply to a stop',
    optionD: 'Be prepared to stop for any traffic',
    correctAnswer: 'D',
    explanation: 'When traffic lights fail, treat the junction as an unmarked crossroads and be prepared to stop for any traffic.',
    officialReference: 'HC Rule 176',
    isActive: true
  },
  {
    categoryCode: 'HAZARD_AWARENESS',
    questionType: 'multiple_choice',
    difficultyLevel: 'intermediate',
    questionText: 'You are planning a long journey. Do you need to plan rest stops?',
    optionA: 'Yes, you should plan to stop every half an hour',
    optionB: 'Yes, regular stops help concentration',
    optionC: 'No, you will be less tired if you get there as soon as possible',
    optionD: 'No, only fuel stops will be needed',
    correctAnswer: 'B',
    explanation: 'Regular rest stops help maintain concentration and reduce driver fatigue, making the journey safer.',
    officialReference: 'HC Rule 91',
    isActive: true
  },
  {
    categoryCode: 'HAZARD_AWARENESS',
    questionType: 'multiple_choice',
    difficultyLevel: 'foundation',
    questionText: 'Your mobile phone rings while you are travelling. You should:',
    optionA: 'Stop immediately',
    optionB: 'Answer it immediately',
    optionC: 'Pull up in a suitable place',
    optionD: 'Pull up at the nearest kerb',
    correctAnswer: 'C',
    explanation: 'If you need to answer your phone, find a safe place to stop first. Using a phone while driving is dangerous and illegal.',
    officialReference: 'HC Rule 149',
    isActive: true
  },
  {
    categoryCode: 'HAZARD_AWARENESS',
    questionType: 'multiple_choice',
    difficultyLevel: 'advanced',
    questionText: 'You are following a slower-moving vehicle on a narrow country road. There is a junction just ahead on the right. You should:',
    optionA: 'Overtake after the junction',
    optionB: 'Overtake before the junction',
    optionC: 'Not overtake until well past the junction',
    optionD: 'Accelerate quickly to pass before the junction',
    correctAnswer: 'C',
    explanation: 'Do not overtake near junctions as vehicles may emerge unexpectedly. Wait until you are well past the junction.',
    officialReference: 'HC Rule 167',
    isActive: true
  },
  {
    categoryCode: 'HAZARD_AWARENESS',
    questionType: 'multiple_choice',
    difficultyLevel: 'intermediate',
    questionText: 'You see this sign ahead. You should expect the road to:',
    optionA: 'Go sharply to the right',
    optionB: 'Go sharply to the left',
    optionC: 'Become bumpy',
    optionD: 'Become slippery',
    correctAnswer: 'A',
    explanation: 'Warning signs showing arrows indicate the direction of a sharp bend or curve ahead.',
    officialReference: 'Know Your Traffic Signs',
    isActive: true
  },
  {
    categoryCode: 'HAZARD_AWARENESS',
    questionType: 'multiple_choice',
    difficultyLevel: 'foundation',
    questionText: 'In which of these situations should you avoid overtaking?',
    optionA: 'Just after a bend',
    optionB: 'In a one-way street',
    optionC: 'On a 30 mph road',
    optionD: 'Approaching a dip in the road',
    correctAnswer: 'D',
    explanation: 'Avoid overtaking when approaching a dip in the road as you cannot see oncoming vehicles that may be hidden.',
    officialReference: 'HC Rule 162',
    isActive: true
  },
  {
    categoryCode: 'HAZARD_AWARENESS',
    questionType: 'multiple_choice',
    difficultyLevel: 'advanced',
    questionText: 'What should you do when you see a horse and rider ahead?',
    optionA: 'Speed up to pass quickly',
    optionB: 'Sound your horn as a warning',
    optionC: 'Slow down and be prepared to stop',
    optionD: 'Rev your engine to warn them',
    correctAnswer: 'C',
    explanation: 'Horses can be unpredictable. Slow down, give them plenty of room, and be prepared to stop if necessary.',
    officialReference: 'HC Rule 215',
    isActive: true
  },
  {
    categoryCode: 'HAZARD_AWARENESS',
    questionType: 'multiple_choice',
    difficultyLevel: 'intermediate',
    questionText: 'You are about to go down a steep hill. To control the speed of your vehicle you should:',
    optionA: 'Select a high gear and use the brakes carefully',
    optionB: 'Select a high gear and use the brakes firmly',
    optionC: 'Select a low gear and use the brakes carefully',
    optionD: 'Select a low gear and avoid using the brakes',
    correctAnswer: 'C',
    explanation: 'Use a low gear to help control your speed down steep hills, and use brakes carefully to avoid overheating them.',
    officialReference: 'HC Rule 160',
    isActive: true
  },

  // ================ VULNERABLE ROAD USERS CATEGORY (8 questions) ================
  {
    categoryCode: 'VULNERABLE_ROAD_USERS',
    questionType: 'multiple_choice',
    difficultyLevel: 'foundation',
    questionText: 'You are approaching a roundabout. A cyclist is signalling to turn right. What should you do?',
    optionA: 'Overtake on the left',
    optionB: 'Give the cyclist plenty of room',
    optionC: 'Sound your horn',
    optionD: 'Assume the cyclist will give way',
    correctAnswer: 'B',
    explanation: 'Give cyclists plenty of room, especially when they are turning right at roundabouts. They may need to position themselves towards the centre of the lane.',
    officialReference: 'HC Rule 187',
    isActive: true
  },
  {
    categoryCode: 'VULNERABLE_ROAD_USERS',
    questionType: 'multiple_choice',
    difficultyLevel: 'intermediate',
    questionText: 'You want to turn left at a junction. A pedestrian is crossing the side road. You should:',
    optionA: 'Wave the pedestrian to stop',
    optionB: 'Wait for the pedestrian to cross',
    optionC: 'Sound your horn',
    optionD: 'Drive behind the pedestrian',
    correctAnswer: 'B',
    explanation: 'Always give way to pedestrians who are already crossing the road that you want to turn into.',
    officialReference: 'HC Rule 170',
    isActive: true
  },
  {
    categoryCode: 'VULNERABLE_ROAD_USERS',
    questionType: 'multiple_choice',
    difficultyLevel: 'advanced',
    questionText: 'You are following a cyclist. You wish to turn left just ahead. You should:',
    optionA: 'Overtake the cyclist before the junction',
    optionB: 'Pull alongside the cyclist and stay level until after the junction',
    optionC: 'Hold back until the cyclist has passed the junction',
    optionD: 'Go around the cyclist on the junction',
    correctAnswer: 'C',
    explanation: 'Hold back and let the cyclist go through or past the junction first to avoid cutting across their path.',
    officialReference: 'HC Rule 211',
    isActive: true
  },
  {
    categoryCode: 'VULNERABLE_ROAD_USERS',
    questionType: 'multiple_choice',
    difficultyLevel: 'foundation',
    questionText: 'What does this sign mean?',
    optionA: 'No route for pedestrians and cyclists',
    optionB: 'A route for pedestrians only',
    optionC: 'A route for cyclists only',
    optionD: 'A route for pedestrians and cyclists',
    correctAnswer: 'D',
    explanation: 'This sign indicates a shared route for both pedestrians and cyclists.',
    officialReference: 'Know Your Traffic Signs',
    isActive: true
  },
  {
    categoryCode: 'VULNERABLE_ROAD_USERS',
    questionType: 'multiple_choice',
    difficultyLevel: 'intermediate',
    questionText: 'The left-hand pavement is closed due to street repairs. What should you do?',
    optionA: 'Watch out for pedestrians walking in the road',
    optionB: 'Use your right-hand mirror more often',
    optionC: 'Speed up to get past the roadworks quicker',
    optionD: 'Position close to the left-hand kerb',
    correctAnswer: 'A',
    explanation: 'When pavements are closed, pedestrians may have to walk in the road. Be extra vigilant and watch out for them.',
    officialReference: 'HC Rule 206',
    isActive: true
  },
  {
    categoryCode: 'VULNERABLE_ROAD_USERS',
    questionType: 'multiple_choice',
    difficultyLevel: 'advanced',
    questionText: 'You are turning left from a main road into a side road. People are already crossing the side road. You should:',
    optionA: 'Continue, as you have priority',
    optionB: 'Give way to them',
    optionC: 'Sound your horn to warn them',
    optionD: 'Wave them to cross as quickly as possible',
    correctAnswer: 'B',
    explanation: 'You must give way to pedestrians who are already crossing the road you want to turn into.',
    officialReference: 'HC Rule 170',
    isActive: true
  },
  {
    categoryCode: 'VULNERABLE_ROAD_USERS',
    questionType: 'multiple_choice',
    difficultyLevel: 'foundation',
    questionText: 'You are driving past parked cars. You notice a ball bouncing out into the road ahead. What should you do?',
    optionA: 'Continue driving at the same speed and sound your horn',
    optionB: 'Continue driving at the same speed and flash your headlights',
    optionC: 'Slow down and be prepared to stop safely',
    optionD: 'Stop and wave the children to retrieve their ball',
    correctAnswer: 'C',
    explanation: 'A ball in the road often means children are nearby and may run out to retrieve it. Slow down and be ready to stop.',
    officialReference: 'HC Rule 206',
    isActive: true
  },
  {
    categoryCode: 'VULNERABLE_ROAD_USERS',
    questionType: 'multiple_choice',
    difficultyLevel: 'intermediate',
    questionText: 'Where would you expect to see these markers?',
    optionA: 'On a motorway sign',
    optionB: 'At the entrance to a narrow bridge',
    optionC: 'On a large goods vehicle',
    optionD: 'On a builder\'s skip placed on the road',
    correctAnswer: 'D',
    explanation: 'Red and white markers are used on temporary obstructions like skips to make them more visible to road users.',
    officialReference: 'Know Your Traffic Signs',
    isActive: true
  },

  // ================ OTHER TYPES OF VEHICLE CATEGORY (6 questions) ================
  {
    categoryCode: 'OTHER_TYPES_OF_VEHICLE',
    questionType: 'multiple_choice',
    difficultyLevel: 'intermediate',
    questionText: 'Why should you be especially careful when overtaking a large goods vehicle?',
    optionA: 'They are faster than they look',
    optionB: 'They have larger blind spots',
    optionC: 'They always indicate late',
    optionD: 'They brake more quickly',
    correctAnswer: 'B',
    explanation: 'Large goods vehicles have extensive blind spots where the driver cannot see other vehicles. Always ensure you can be seen before overtaking.',
    officialReference: 'HC Rule 164',
    isActive: true
  },
  {
    categoryCode: 'OTHER_TYPES_OF_VEHICLE',
    questionType: 'multiple_choice',
    difficultyLevel: 'foundation',
    questionText: 'You are following a long vehicle approaching a crossroads. The driver signals right but moves close to the left-hand kerb. What should you do?',
    optionA: 'Warn the driver of the wrong signal',
    optionB: 'Wait behind the long vehicle',
    optionC: 'Report the driver to the police',
    optionD: 'Overtake on the right-hand side',
    correctAnswer: 'B',
    explanation: 'Long vehicles often need to swing out to the left before turning right. Wait behind and do not overtake.',
    officialReference: 'HC Rule 221',
    isActive: true
  },
  {
    categoryCode: 'OTHER_TYPES_OF_VEHICLE',
    questionType: 'multiple_choice',
    difficultyLevel: 'advanced',
    questionText: 'You keep well back while following a large vehicle. Another car fills the gap. You should:',
    optionA: 'Sound your horn',
    optionB: 'Drop back further',
    optionC: 'Flash your headlights',
    optionD: 'Start to overtake',
    correctAnswer: 'B',
    explanation: 'If another vehicle moves into your safety gap, drop back further to re-establish a safe following distance.',
    officialReference: 'HC Rule 126',
    isActive: true
  },
  {
    categoryCode: 'OTHER_TYPES_OF_VEHICLE',
    questionType: 'multiple_choice',
    difficultyLevel: 'intermediate',
    questionText: 'You are about to overtake a slow-moving motorcyclist. Which one of these signs would make you take special care?',
    optionA: 'Left-hand bend',
    optionB: 'Road narrows',
    optionC: 'Traffic lights',
    optionD: 'Children crossing',
    correctAnswer: 'A',
    explanation: 'Motorcyclists may need to change position when cornering. A left-hand bend sign would require special care when overtaking.',
    officialReference: 'HC Rule 211',
    isActive: true
  },
  {
    categoryCode: 'OTHER_TYPES_OF_VEHICLE',
    questionType: 'multiple_choice',
    difficultyLevel: 'foundation',
    questionText: 'You are waiting to emerge left from a minor road. A large vehicle is approaching from the right. You have time to turn, but you should wait. Why?',
    optionA: 'The large vehicle can easily hide an overtaking vehicle',
    optionB: 'The large vehicle can turn suddenly',
    optionC: 'The large vehicle is difficult to steer in a straight line',
    optionD: 'The large vehicle can easily hide following traffic',
    correctAnswer: 'A',
    explanation: 'Large vehicles can hide other vehicles that may be overtaking. Wait until you can see clearly that it is safe.',
    officialReference: 'HC Rule 170',
    isActive: true
  },
  {
    categoryCode: 'OTHER_TYPES_OF_VEHICLE',
    questionType: 'multiple_choice',
    difficultyLevel: 'advanced',
    questionText: 'As you approach a pelican crossing the lights change to green. Elderly people are halfway across. You should:',
    optionA: 'Wave them to cross as quickly as possible',
    optionB: 'Rev the engine to make them hurry',
    optionC: 'Flash the headlights to make them hurry',
    optionD: 'Wait because they will take longer to cross',
    correctAnswer: 'D',
    explanation: 'Be patient with elderly pedestrians or those with mobility issues as they may take longer to cross safely.',
    officialReference: 'HC Rule 196',
    isActive: true
  },
];

  
  // ================ VEHICLE HANDLING CATEGORY (6 questions) ================
  {
    categoryCode: 'VEHICLE_HANDLING',
    questionType: 'multiple_choice',
    difficultyLevel: 'intermediate',
    questionText: 'In icy conditions, how should you brake?',
    optionA: 'Firmly and quickly',
    optionB: 'Gently and progressively',
    optionC: 'By pumping the brakes',
    optionD: 'Use the handbrake only',
    correctAnswer: 'B',
    explanation: 'In icy conditions, brake gently and progressively to avoid skidding. Sudden braking can cause loss of control.',
    officialReference: 'HC Rule 231',
    isActive: true
  },
  {
    categoryCode: 'VEHICLE_HANDLING',
    questionType: 'multiple_choice',
    difficultyLevel: 'foundation',
    questionText: 'When driving in fog, which lights should you use?',
    optionA: 'Dipped headlights and fog lights',
    optionB: 'Full beam headlights',
    optionC: 'Sidelights only',
    optionD: 'Hazard warning lights',
    correctAnswer: 'A',
    explanation: 'In fog, use dipped headlights and fog lights if visibility is seriously reduced (less than 100 metres).',
    officialReference: 'HC Rule 236',
    isActive: true
  },
  {
    categoryCode: 'VEHICLE_HANDLING',
    questionType: 'multiple_choice',
    difficultyLevel: 'advanced',
    questionText: 'You are driving on an icy road. How can you avoid wheel spin when moving off?',
    optionA: 'Use the handbrake and footbrake together',
    optionB: 'Select a higher gear than normal',
    optionC: 'Keep the engine revs high',
    optionD: 'Use a lower gear than normal',
    correctAnswer: 'B',
    explanation: 'Using a higher gear than normal reduces the torque to the wheels, helping to prevent wheel spin on icy surfaces.',
    officialReference: 'HC Rule 231',
    isActive: true
  },
  {
    categoryCode: 'VEHICLE_HANDLING',
    questionType: 'multiple_choice',
    difficultyLevel: 'intermediate',
    questionText: 'You are driving down a long steep hill. Your brakes begin to overheat. What should you do?',
    optionA: 'Continue using the brakes',
    optionB: 'Switch the engine off',
    optionC: 'Select a lower gear',
    optionD: 'Put the handbrake on',
    correctAnswer: 'C',
    explanation: 'Use a lower gear to help control speed and reduce brake usage, allowing them to cool down.',
    officialReference: 'HC Rule 160',
    isActive: true
  },
  {
    categoryCode: 'VEHICLE_HANDLING',
    questionType: 'multiple_choice',
    difficultyLevel: 'foundation',
    questionText: 'What should you do if your vehicle starts to aquaplane?',
    optionA: 'Brake immediately',
    optionB: 'Steer quickly to correct the skid',
    optionC: 'Ease off the accelerator',
    optionD: 'Increase your speed',
    correctAnswer: 'C',
    explanation: 'If aquaplaning occurs, ease off the accelerator and hold the steering wheel lightly until grip returns.',
    officialReference: 'HC Rule 227',
    isActive: true
  },
  {
    categoryCode: 'VEHICLE_HANDLING',
    questionType: 'multiple_choice',
    difficultyLevel: 'advanced',
    questionText: 'You are on a good, dry road surface and your vehicle has good brakes and tyres. What is the typical overall stopping distance at 50 mph?',
    optionA: '36 metres (118 feet)',
    optionB: '53 metres (175 feet)',
    optionC: '75 metres (245 feet)',
    optionD: '96 metres (315 feet)',
    correctAnswer: 'B',
    explanation: 'At 50 mph, the typical overall stopping distance is 53 metres, consisting of 15 metres thinking distance plus 38 metres braking distance.',
    officialReference: 'HC Rule 126',
    isActive: true
  },

  // ================ MOTORWAY RULES CATEGORY (6 questions) ================
  {
    categoryCode: 'MOTORWAY_RULES',
    questionType: 'multiple_choice',
    difficultyLevel: 'foundation',
    questionText: 'What is the national speed limit for cars on a motorway?',
    optionA: '60 mph',
    optionB: '70 mph',
    optionC: '80 mph',
    optionD: '90 mph',
    correctAnswer: 'B',
    explanation: 'The national speed limit for cars on motorways is 70 mph, unless signs indicate otherwise.',
    officialReference: 'HC Rule 261',
    isActive: true
  },
  {
    categoryCode: 'MOTORWAY_RULES',
    questionType: 'multiple_choice',
    difficultyLevel: 'intermediate',
    questionText: 'You are joining a motorway. Why is it important to make full use of the slip road?',
    optionA: 'Because there is space available',
    optionB: 'To allow you direct access to the overtaking lanes',
    optionC: 'To build up a speed similar to traffic on the motorway',
    optionD: 'Because you can continue on the hard shoulder',
    correctAnswer: 'C',
    explanation: 'Use the slip road to build up speed to match the traffic flow on the motorway before joining.',
    officialReference: 'HC Rule 259',
    isActive: true
  },
  {
    categoryCode: 'MOTORWAY_RULES',
    questionType: 'multiple_choice',
    difficultyLevel: 'advanced',
    questionText: 'You are in the right-hand lane of a three-lane motorway. There are red reflective studs on your left and white ones to your right. Where are you?',
    optionA: 'In the right-hand lane',
    optionB: 'In the middle lane',
    optionC: 'On the hard shoulder',
    optionD: 'In the left-hand lane',
    correctAnswer: 'A',
    explanation: 'Red studs mark the left edge of the carriageway, and white studs separate lanes. You are in the right-hand lane.',
    officialReference: 'HC Rule 132',
    isActive: true
  },
  {
    categoryCode: 'MOTORWAY_RULES',
    questionType: 'multiple_choice',
    difficultyLevel: 'foundation',
    questionText: 'What should you use the hard shoulder of a motorway for?',
    optionA: 'Stopping when tired',
    optionB: 'Joining the motorway',
    optionC: 'Emergency or breakdown only',
    optionD: 'Overtaking slow traffic',
    correctAnswer: 'C',
    explanation: 'The hard shoulder should only be used in emergencies or breakdowns. It is not for normal stopping or overtaking.',
    officialReference: 'HC Rule 270',
    isActive: true
  },
  {
    categoryCode: 'MOTORWAY_RULES',
    questionType: 'multiple_choice',
    difficultyLevel: 'intermediate',
    questionText: 'You are travelling on a motorway. You decide you need the next exit. It is some distance away. You should:',
    optionA: 'Concentrate on the exit and nothing else',
    optionB: 'Move to the left lane well before reaching the exit',
    optionC: 'Speed up to get to the exit quicker',
    optionD: 'Move to the left lane just before the exit',
    correctAnswer: 'B',
    explanation: 'Move to the left lane in good time before your exit to avoid last-minute lane changes.',
    officialReference: 'HC Rule 260',
    isActive: true
  },
  {
    categoryCode: 'MOTORWAY_RULES',
    questionType: 'multiple_choice',
    difficultyLevel: 'advanced',
    questionText: 'What do these motorway signs show?',
    optionA: 'They are countdown markers to a bridge',
    optionB: 'They are distance markers to the next telephone',
    optionC: 'They are countdown markers to the next exit',
    optionD: 'They warn of a police control ahead',
    correctAnswer: 'C',
    explanation: 'These signs are countdown markers showing 300, 200, and 100 yards to the next motorway exit.',
    officialReference: 'Know Your Traffic Signs',
    isActive: true
  },

  // ================ RULES OF THE ROAD CATEGORY (8 questions) ================
  {
    categoryCode: 'RULES_OF_THE_ROAD',
    questionType: 'multiple_choice',
    difficultyLevel: 'foundation',
    questionText: 'What does a solid white line along the centre of the road mean?',
    optionA: 'You may overtake if safe',
    optionB: 'No overtaking',
    optionC: 'Overtake only if no oncoming traffic',
    optionD: 'Two-way traffic',
    correctAnswer: 'B',
    explanation: 'A solid white line along the centre of the road means you must not cross or straddle it unless entering a side road or passing a stationary vehicle.',
    officialReference: 'HC Rule 128',
    isActive: true
  },
  {
    categoryCode: 'RULES_OF_THE_ROAD',
    questionType: 'multiple_choice',
    difficultyLevel: 'intermediate',
    questionText: 'You are approaching a mini-roundabout. The long vehicle in front is signalling left but positioned over to the right. You should:',
    optionA: 'Sound your horn',
    optionB: 'Overtake on the left',
    optionC: 'Follow the same course as the long vehicle',
    optionD: 'Keep well back',
    correctAnswer: 'D',
    explanation: 'Long vehicles may need to take a different course at mini-roundabouts. Keep well back and do not overtake.',
    officialReference: 'HC Rule 188',
    isActive: true
  },
  {
    categoryCode: 'RULES_OF_THE_ROAD',
    questionType: 'multiple_choice',
    difficultyLevel: 'foundation',
    questionText: 'At a junction you see this sign. It means:',
    optionA: 'Cars must stop',
    optionB: 'Trams must stop',
    optionC: 'Cars have priority over trams',
    optionD: 'Trams have priority over cars',
    correctAnswer: 'D',
    explanation: 'This sign indicates that trams have priority over other vehicles at this junction.',
    officialReference: 'Know Your Traffic Signs',
    isActive: true
  },
  {
    categoryCode: 'RULES_OF_THE_ROAD',
    questionType: 'multiple_choice',
    difficultyLevel: 'advanced',
    questionText: 'You are on a road that has no traffic signs. There are street lights. What is the speed limit?',
    optionA: '20 mph',
    optionB: '30 mph',
    optionC: '40 mph',
    optionD: '60 mph',
    correctAnswer: 'B',
    explanation: 'On roads with street lighting but no speed limit signs, the speed limit is usually 30 mph.',
    officialReference: 'HC Rule 124',
    isActive: true
  },
  {
    categoryCode: 'RULES_OF_THE_ROAD',
    questionType: 'multiple_choice',
    difficultyLevel: 'intermediate',
    questionText: 'You may drive over a footpath:',
    optionA: 'To overtake slow-moving traffic',
    optionB: 'When the pavement is very wide',
    optionC: 'If no pedestrians are near',
    optionD: 'To get lawful access to property',
    correctAnswer: 'D',
    explanation: 'You may only drive over a footpath to gain lawful access to property adjacent to the road.',
    officialReference: 'HC Rule 145',
    isActive: true
  },
  {
    categoryCode: 'RULES_OF_THE_ROAD',
    questionType: 'multiple_choice',
    difficultyLevel: 'foundation',
    questionText: 'You are waiting at a level crossing. A train has passed but the lights keep flashing. You must:',
    optionA: 'Carry on waiting',
    optionB: 'Phone the signal operator',
    optionC: 'Edge over the stop line and look for trains',
    optionD: 'Park and investigate',
    correctAnswer: 'A',
    explanation: 'Continue to wait until the lights stop flashing. Another train may be approaching.',
    officialReference: 'HC Rule 294',
    isActive: true
  },
  {
    categoryCode: 'RULES_OF_THE_ROAD',
    questionType: 'multiple_choice',
    difficultyLevel: 'advanced',
    questionText: 'You are driving along this road. The red van cuts in close in front of you. What should you do?',
    optionA: 'Accelerate to get closer to the red van',
    optionB: 'Give a long blast on the horn',
    optionC: 'Drop back to leave the correct separation distance',
    optionD: 'Flash your headlights several times',
    correctAnswer: 'C',
    explanation: 'If another vehicle cuts in front of you, drop back to re-establish a safe following distance.',
    officialReference: 'HC Rule 126',
    isActive: true
  },
  {
    categoryCode: 'RULES_OF_THE_ROAD',
    questionType: 'multiple_choice',
    difficultyLevel: 'intermediate',
    questionText: 'You are driving on a busy main road. You find a van in front going to your destination. You should:',
    optionA: 'Follow the van closely and safely',
    optionB: 'Keep a safe distance from the van',
    optionC: 'Flash your headlights at the van',
    optionD: 'Overtake the van immediately',
    correctAnswer: 'B',
    explanation: 'Always maintain a safe following distance, regardless of where the vehicle in front is going.',
    officialReference: 'HC Rule 126',
    isActive: true
  },

  // ================ ROAD AND TRAFFIC SIGNS CATEGORY (8 questions) ================
  {
    categoryCode: 'ROAD_AND_TRAFFIC_SIGNS',
    questionType: 'multiple_choice',
    difficultyLevel: 'foundation',
    questionText: 'What does a circular sign with a red border mean?',
    optionA: 'Warning',
    optionB: 'Information',
    optionC: 'Prohibition or restriction',
    optionD: 'Mandatory',
    correctAnswer: 'C',
    explanation: 'Circular signs with red borders indicate prohibitions or restrictions - things you must not do.',
    officialReference: 'HC Signs',
    isActive: true
  },
  {
    categoryCode: 'ROAD_AND_TRAFFIC_SIGNS',
    questionType: 'multiple_choice',
    difficultyLevel: 'intermediate',
    questionText: 'This sign means:',
    optionA: 'Multi-exit roundabout',
    optionB: 'Risk of ice',
    optionC: 'Six roads converge',
    optionD: 'Place of historical interest',
    correctAnswer: 'A',
    explanation: 'This sign warns of a roundabout ahead with multiple exits.',
    officialReference: 'Know Your Traffic Signs',
    isActive: true
  },
  {
    categoryCode: 'ROAD_AND_TRAFFIC_SIGNS',
    questionType: 'multiple_choice',
    difficultyLevel: 'advanced',
    questionText: 'You see this amber traffic light ahead. Which light(s) will come on next?',
    optionA: 'Red alone',
    optionB: 'Red and amber together',
    optionC: 'Green alone',
    optionD: 'Green and amber together',
    correctAnswer: 'A',
    explanation: 'After amber, red comes on alone. You must stop unless it would be unsafe to do so.',
    officialReference: 'HC Rule 109',
    isActive: true
  },
  {
    categoryCode: 'ROAD_AND_TRAFFIC_SIGNS',
    questionType: 'multiple_choice',
    difficultyLevel: 'foundation',
    questionText: 'What does this sign mean?',
    optionA: 'Bend to the left',
    optionB: 'Road narrows on the left',
    optionC: 'Road narrows on both sides',
    optionD: 'Road widens on the left',
    correctAnswer: 'B',
    explanation: 'This warning sign indicates that the road narrows on the left side ahead.',
    officialReference: 'Know Your Traffic Signs',
    isActive: true
  },
  {
    categoryCode: 'ROAD_AND_TRAFFIC_SIGNS',
    questionType: 'multiple_choice',
    difficultyLevel: 'intermediate',
    questionText: 'You are approaching traffic lights. Red and amber are showing. This means:',
    optionA: 'Pass the lights if the road is clear',
    optionB: 'There is a fault with the lights',
    optionC: 'Wait for the green light before proceeding',
    optionD: 'The lights are about to change to red',
    correctAnswer: 'C',
    explanation: 'Red and amber together means wait for green. Do not pass until the green light shows.',
    officialReference: 'HC Rule 109',
    isActive: true
  },
  {
    categoryCode: 'ROAD_AND_TRAFFIC_SIGNS',
    questionType: 'multiple_choice',
    difficultyLevel: 'advanced',
    questionText: 'What does this motorway sign mean?',
    optionA: 'Change to the lane on your left',
    optionB: 'Leave the motorway at the next exit',
    optionC: 'Change to the opposite carriageway',
    optionD: 'Pull up on the hard shoulder',
    correctAnswer: 'A',
    explanation: 'This sign indicates you should move to the lane shown by the arrow (left lane).',
    officialReference: 'Know Your Traffic Signs',
    isActive: true
  },
  {
    categoryCode: 'ROAD_AND_TRAFFIC_SIGNS',
    questionType: 'multiple_choice',
    difficultyLevel: 'foundation',
    questionText: 'Which sign means "no motor vehicles"?',
    optionA: 'A circular sign with a car symbol crossed out',
    optionB: 'A triangular sign with a car symbol',
    optionC: 'A rectangular sign with a car symbol',
    optionD: 'An octagonal sign with a car symbol',
    correctAnswer: 'A',
    explanation: 'A circular sign with a red border and crossed-out car symbol means no motor vehicles allowed.',
    officialReference: 'Know Your Traffic Signs',
    isActive: true
  },
  {
    categoryCode: 'ROAD_AND_TRAFFIC_SIGNS',
    questionType: 'multiple_choice',
    difficultyLevel: 'intermediate',
    questionText: 'You see this sign at a crossroads. You should:',
    optionA: 'Maintain the same speed',
    optionB: 'Carry on with great care',
    optionC: 'Find another route',
    optionD: 'Stop and apply the handbrake',
    correctAnswer: 'B',
    explanation: 'This sign warns of a crossroads ahead where extra care is needed due to the layout or visibility.',
    officialReference: 'Know Your Traffic Signs',
    isActive: true
  },

  // ================ DOCUMENTS CATEGORY (5 questions) ================
  {
    categoryCode: 'DOCUMENTS',
    questionType: 'multiple_choice',
    difficultyLevel: 'foundation',
    questionText: 'For how long is a provisional driving licence valid?',
    optionA: '1 year',
    optionB: '5 years',
    optionC: '10 years',
    optionD: '15 years',
    correctAnswer: 'C',
    explanation: 'A provisional driving licence is valid for 10 years from the date of issue.',
    officialReference: 'DVLA Guidelines',
    isActive: true
  },
  {
    categoryCode: 'DOCUMENTS',
    questionType: 'multiple_choice',
    difficultyLevel: 'intermediate',
    questionText: 'You have just passed your driving test. You must not drive a car on your own until:',
    optionA: 'You have taken a further driving test',
    optionB: 'You have received your full licence',
    optionC: 'You have taken out insurance',
    optionD: 'The licence arrives from DVLA',
    correctAnswer: 'B',
    explanation: 'You cannot drive alone until you receive your full driving licence, even though you have passed the test.',
    officialReference: 'DVLA Guidelines',
    isActive: true
  },
  {
    categoryCode: 'DOCUMENTS',
    questionType: 'multiple_choice',
    difficultyLevel: 'advanced',
    questionText: 'Your vehicle needs a current MOT certificate. You do not have one. Until you do have one you will not be able to renew your:',
    optionA: 'Driving licence',
    optionB: 'Vehicle insurance',
    optionC: 'Vehicle registration document',
    optionD: 'Vehicle excise licence (tax disc)',
    correctAnswer: 'D',
    explanation: 'You cannot renew your vehicle excise licence (road tax) without a valid MOT certificate.',
    officialReference: 'DVLA Guidelines',
    isActive: true
  },
  {
    categoryCode: 'DOCUMENTS',
    questionType: 'multiple_choice',
    difficultyLevel: 'foundation',
    questionText: 'A police officer asks to see your documents. You do not have them with you. You may produce them at a police station within:',
    optionA: '5 days',
    optionB: '7 days',
    optionC: '14 days',
    optionD: '21 days',
    correctAnswer: 'B',
    explanation: 'If you do not have your documents with you, you have 7 days to produce them at a police station.',
    officialReference: 'Road Traffic Act',
    isActive: true
  },
  {
    categoryCode: 'DOCUMENTS',
    questionType: 'multiple_choice',
    difficultyLevel: 'intermediate',
    questionText: 'Which document may the police ask you to produce?',
    optionA: 'Vehicle handbook',
    optionB: 'Driving licence',
    optionC: 'Theory test certificate',
    optionD: 'Vehicle registration document',
    correctAnswer: 'B',
    explanation: 'Police can ask to see your driving licence, insurance certificate, and MOT certificate.',
    officialReference: 'Road Traffic Act',
    isActive: true
  },

  // ================ INCIDENTS, ACCIDENTS AND EMERGENCIES CATEGORY (7 questions) ================
  {
    categoryCode: 'INCIDENTS_ACCIDENTS_EMERGENCIES',
    questionType: 'multiple_choice',
    difficultyLevel: 'intermediate',
    questionText: 'At the scene of an accident, what is your first priority?',
    optionA: 'Get the traffic moving',
    optionB: 'Take photos for insurance',
    optionC: 'Ensure the safety of everyone',
    optionD: 'Clear the vehicles from the road',
    correctAnswer: 'C',
    explanation: 'Your first priority at any accident scene is to ensure the safety of everyone involved. This includes making the area safe and calling emergency services if needed.',
    officialReference: 'HC Rule 283',
    isActive: true
  },
  {
    categoryCode: 'INCIDENTS_ACCIDENTS_EMERGENCIES',
    questionType: 'multiple_choice',
    difficultyLevel: 'foundation',
    questionText: 'You are the first to arrive at the scene of a crash. Which of these should you do?',
    optionA: 'Leave as soon as another motorist arrives',
    optionB: 'Make sure engines are switched off',
    optionC: 'Drag all casualties away from the vehicles',
    optionD: 'Go to the nearest house to phone for help',
    correctAnswer: 'B',
    explanation: 'Switch off engines to reduce fire risk, but do not move casualties unless they are in immediate danger.',
    officialReference: 'HC Rule 283',
    isActive: true
  },
  {
    categoryCode: 'INCIDENTS_ACCIDENTS_EMERGENCIES',
    questionType: 'multiple_choice',
    difficultyLevel: 'advanced',
    questionText: 'You arrive at the scene of a motorcycle crash. The rider is injured. When should the helmet be removed?',
    optionA: 'Only when it is essential',
    optionB: 'Always straight away',
    optionC: 'Only when the motorcyclist asks',
    optionD: 'Always, unless they are unconscious',
    correctAnswer: 'A',
    explanation: 'Only remove a motorcyclist\'s helmet if it is essential - for example, if they have stopped breathing.',
    officialReference: 'HC Rule 286',
    isActive: true
  },
  {
    categoryCode: 'INCIDENTS_ACCIDENTS_EMERGENCIES',
    questionType: 'multiple_choice',
    difficultyLevel: 'intermediate',
    questionText: 'You are on a motorway. There has been a crash further ahead. You see people on the carriageway. What should you do?',
    optionA: 'Stop and offer help',
    optionB: 'Switch on your hazard warning lights',
    optionC: 'Switch on your headlights',
    optionD: 'Leave the motorway at the next exit',
    correctAnswer: 'B',
    explanation: 'Switch on hazard warning lights to warn traffic behind of the danger ahead.',
    officialReference: 'HC Rule 283',
    isActive: true
  },
  {
    categoryCode: 'INCIDENTS_ACCIDENTS_EMERGENCIES',
    questionType: 'multiple_choice',
    difficultyLevel: 'foundation',
    questionText: 'You have broken down on a two-way road. You have a warning triangle. You should place the warning triangle at least how far from your vehicle?',
    optionA: '5 metres (16 feet)',
    optionB: '25 metres (82 feet)',
    optionC: '45 metres (147 feet)',
    optionD: '100 metres (328 feet)',
    correctAnswer: 'C',
    explanation: 'Place a warning triangle at least 45 metres (147 feet) behind your vehicle on the same side of the road.',
    officialReference: 'HC Rule 274',
    isActive: true
  },
  {
    categoryCode: 'INCIDENTS_ACCIDENTS_EMERGENCIES',
    questionType: 'multiple_choice',
    difficultyLevel: 'advanced',
    questionText: 'You are involved in a collision. Someone is injured. Your vehicle is damaged. Which FOUR things should you find out?',
    optionA: 'Whether the driver owns the other vehicle',
    optionB: 'The other driver\'s name, address and telephone number',
    optionC: 'The make and registration number of the other vehicle',
    optionD: 'The details of the other driver\'s vehicle insurance',
    correctAnswer: 'B',
    explanation: 'You should exchange names, addresses, telephone numbers, and insurance details. Also note vehicle makes and registration numbers.',
    officialReference: 'HC Rule 286',
    isActive: true
  },
  {
    categoryCode: 'INCIDENTS_ACCIDENTS_EMERGENCIES',
    questionType: 'multiple_choice',
    difficultyLevel: 'intermediate',
    questionText: 'You break down on a level crossing. The lights have not yet begun to flash. Which THREE things should you do?',
    optionA: 'Telephone the signal operator',
    optionB: 'Leave your vehicle and get everyone clear',
    optionC: 'Walk down the track and signal the train driver',
    optionD: 'Stay in your vehicle and rev the engine',
    correctAnswer: 'A',
    explanation: 'Telephone the signal operator immediately, get everyone clear of the vehicle and crossing, and follow the operator\'s instructions.',
    officialReference: 'HC Rule 299',
    isActive: true
  },

  // ================ VEHICLE LOADING CATEGORY (5 questions) ================
  {
    categoryCode: 'VEHICLE_LOADING',
    questionType: 'multiple_choice',
    difficultyLevel: 'foundation',
    questionText: 'When loading your vehicle, where should you place the heaviest items?',
    optionA: 'On the roof',
    optionB: 'In the boot',
    optionC: 'On the back seat',
    optionD: 'As low as possible',
    correctAnswer: 'D',
    explanation: 'Heavy items should be placed as low as possible in the vehicle to keep the centre of gravity low and maintain stability.',
    officialReference: 'HC Rule 98',
    isActive: true
  },
  {
    categoryCode: 'VEHICLE_LOADING',
    questionType: 'multiple_choice',
    difficultyLevel: 'intermediate',
    questionText: 'You are planning to tow a trailer. As a car driver which licence do you need?',
    optionA: 'A car licence',
    optionB: 'A trailer licence',
    optionC: 'A car and trailer licence',
    optionD: 'A heavy goods vehicle licence',
    correctAnswer: 'A',
    explanation: 'For most trailers, a standard car licence is sufficient, though there are weight restrictions that may require additional categories.',
    officialReference: 'DVLA Guidelines',
    isActive: true
  },
  {
    categoryCode: 'VEHICLE_LOADING',
    questionType: 'multiple_choice',
    difficultyLevel: 'advanced',
    questionText: 'You are towing a small trailer on a busy three-lane motorway. All the lanes are open. You must:',
    optionA: 'Use only the left and centre lanes',
    optionB: 'Use only the left lane',
    optionC: 'Use any lane',
    optionD: 'Use only the right lane',
    correctAnswer: 'A',
    explanation: 'When towing a trailer on a three-lane motorway, you must not use the right-hand lane.',
    officialReference: 'HC Rule 265',
    isActive: true
  },
  {
    categoryCode: 'VEHICLE_LOADING',
    questionType: 'multiple_choice',
    difficultyLevel: 'foundation',
    questionText: 'Any load that is carried on a roof rack should be:',
    optionA: 'Securely fastened when driving',
    optionB: 'Loaded towards the rear',
    optionC: 'Visible in your mirrors',
    optionD: 'Covered with plastic sheeting',
    correctAnswer: 'A',
    explanation: 'Any load carried on a roof rack must be securely fastened to prevent it from falling off and causing danger.',
    officialReference: 'HC Rule 98',
    isActive: true
  },
  {
    categoryCode: 'VEHICLE_LOADING',
    questionType: 'multiple_choice',
    difficultyLevel: 'intermediate',
    questionText: 'You are carrying a child in your car. They are under three years of age. Which of these is a suitable restraint?',
    optionA: 'A child seat',
    optionB: 'An adult holding a child',
    optionC: 'An adult seat belt',
    optionD: 'A lap belt',
    correctAnswer: 'A',
    explanation: 'Children under three must be secured in an appropriate child restraint (car seat) for their age and weight.',
    officialReference: 'HC Rule 101',
    isActive: true
  },

  // ================ SAFETY MARGINS CATEGORY (6 questions) ================
  {
    categoryCode: 'SAFETY_MARGINS',
    questionType: 'multiple_choice',
    difficultyLevel: 'foundation',
    questionText: 'How can you reduce fuel consumption while driving?',
    optionA: 'Accelerate quickly',
    optionB: 'Drive at higher speeds',
    optionC: 'Plan your route',
    optionD: 'Use air conditioning continuously',
    correctAnswer: 'C',
    explanation: 'Planning your route helps reduce fuel consumption by avoiding traffic jams and finding the most efficient path to your destination.',
    officialReference: 'HC Rule 123',
    isActive: true
  },
  {
    categoryCode: 'SAFETY_MARGINS',
    questionType: 'multiple_choice',
    difficultyLevel: 'intermediate',
    questionText: 'You are following a vehicle on a wet road. You should leave a time gap of at least:',
    optionA: 'One second',
    optionB: 'Two seconds',
    optionC: 'Three seconds',
    optionD: 'Four seconds',
    correctAnswer: 'D',
    explanation: 'In wet conditions, you should leave at least a four-second gap between you and the vehicle in front.',
    officialReference: 'HC Rule 126',
    isActive: true
  },
  {
    categoryCode: 'SAFETY_MARGINS',
    questionType: 'multiple_choice',
    difficultyLevel: 'advanced',
    questionText: 'In very hot weather the road surface can become soft. Which TWO things should you do?',
    optionA: 'Reduce your tyre pressure',
    optionB: 'Select a lower gear',
    optionC: 'Avoid heavy braking',
    optionD: 'Use your air conditioning',
    correctAnswer: 'C',
    explanation: 'In hot weather, avoid harsh braking and acceleration as the road surface becomes softer and more likely to cause skidding.',
    officialReference: 'HC Rule 237',
    isActive: true
  },
  {
    categoryCode: 'SAFETY_MARGINS',
    questionType: 'multiple_choice',
    difficultyLevel: 'foundation',
    questionText: 'What is the safest way to use a mobile phone in your vehicle?',
    optionA: 'Use hands-free equipment',
    optionB: 'Find a suitable place to stop',
    optionC: 'Drive slowly on a quiet road',
    optionD: 'Direct your call through the operator',
    correctAnswer: 'B',
    explanation: 'The safest way to use a mobile phone is to stop in a safe place before making or receiving calls.',
    officialReference: 'HC Rule 149',
    isActive: true
  },
  {
    categoryCode: 'SAFETY_MARGINS',
    questionType: 'multiple_choice',
    difficultyLevel: 'intermediate',
    questionText: 'You are driving in heavy rain. Your steering suddenly becomes very light. You should:',
    optionA: 'Steer towards the side of the road',
    optionB: 'Apply gentle acceleration',
    optionC: 'Brake firmly to reduce speed',
    optionD: 'Ease off the accelerator',
    correctAnswer: 'D',
    explanation: 'Light steering indicates aquaplaning. Ease off the accelerator and hold the steering wheel lightly until grip returns.',
    officialReference: 'HC Rule 227',
    isActive: true
  },
  {
    categoryCode: 'SAFETY_MARGINS',
    questionType: 'multiple_choice',
    difficultyLevel: 'advanced',
    questionText: 'The sequence of traffic lights showing to traffic is red, red and amber, green, amber. What follows the amber light?',
    optionA: 'Red',
    optionB: 'Red and amber',
    optionC: 'Green',
    optionD: 'Green and amber',
    correctAnswer: 'A',
    explanation: 'The sequence is: Red → Red and Amber → Green → Amber → Red (and the cycle repeats).',
    officialReference: 'HC Rule 109',
    isActive: true
  },

  // ================ VEHICLE SAFETY CATEGORY (5 questions) ================
  {
    categoryCode: 'VEHICLE_SAFETY',
    questionType: 'multiple_choice',
    difficultyLevel: 'intermediate',
    questionText: 'What is the typical stopping distance at 70 mph in good conditions?',
    optionA: '53 metres (175 feet)',
    optionB: '73 metres (240 feet)',
    optionC: '96 metres (315 feet)',
    optionD: '120 metres (394 feet)',
    correctAnswer: 'C',
    explanation: 'At 70 mph, the typical stopping distance is 96 metres (315 feet). This includes thinking distance of 21 metres and braking distance of 75 metres.',
    officialReference: 'HC Rule 126',
    isActive: true
  },
  {
    categoryCode: 'VEHICLE_SAFETY',
    questionType: 'multiple_choice',
    difficultyLevel: 'foundation',
    questionText: 'Anti-lock brakes reduce the chances of a skid occurring particularly when:',
    optionA: 'Driving down steep hills',
    optionB: 'Braking during normal driving',
    optionC: 'Braking in an emergency',
    optionD: 'Driving on good road surfaces',
    correctAnswer: 'C',
    explanation: 'Anti-lock brakes are particularly effective during emergency braking, preventing wheel lock-up and maintaining steering control.',
    officialReference: 'HC Vehicle Safety',
    isActive: true
  },
  {
    categoryCode: 'VEHICLE_SAFETY',
    questionType: 'multiple_choice',
    difficultyLevel: 'advanced',
    questionText: 'Vehicle lights should be switched on when visibility is seriously reduced, generally when you cannot see for more than:',
    optionA: '100 metres (328 feet)',
    optionB: '200 metres (656 feet)',
    optionC: '300 metres (984 feet)',
    optionD: '400 metres (1312 feet)',
    correctAnswer: 'A',
    explanation: 'Switch on your lights when visibility is seriously reduced, generally when you cannot see for more than 100 metres.',
    officialReference: 'HC Rule 226',
    isActive: true
  },
  {
    categoryCode: 'VEHICLE_SAFETY',
    questionType: 'multiple_choice',
    difficultyLevel: 'intermediate',
    questionText: 'Driving with under-inflated tyres can affect:',
    optionA: 'Engine temperature',
    optionB: 'Fuel consumption',
    optionC: 'Braking and steering',
    optionD: 'All of the above',
    correctAnswer: 'D',
    explanation: 'Under-inflated tyres can cause overheating, increase fuel consumption, and reduce braking and steering effectiveness.',
    officialReference: 'HC Rule 89',
    isActive: true
  },
  {
    categoryCode: 'VEHICLE_SAFETY',
    questionType: 'multiple_choice',
    difficultyLevel: 'foundation',
    questionText: 'You service your own vehicle. How should you dispose of old engine oil?',
    optionA: 'Put it in your dustbin',
    optionB: 'Pour it down a drain',
    optionC: 'Take it to a local authority site',
    optionD: 'Pour it onto the ground',
    correctAnswer: 'C',
    explanation: 'Used engine oil must be disposed of properly at a local authority recycling site or garage that accepts it.',
    officialReference: 'Environmental Protection',
    isActive: true
  }
];

async function seedDatabase() {
  try {
    console.log('🌱 Starting comprehensive DVSA Theory Test database seeding...');
    
    // Check existing categories
    console.log('📚 Checking existing theory test categories...');
    const existingCategories = await db.select().from(ukTheoryCategories);
    console.log(`Found ${existingCategories.length} existing categories`);
    
    let categoryMap = {};
    
    if (existingCategories.length === 0) {
      // Insert categories only if none exist
      console.log('🏗️ Seeding theory test categories...');
      const insertedCategories = await db.insert(ukTheoryCategories).values(categories).returning();
      console.log(`✅ Successfully seeded ${insertedCategories.length} categories`);
      
      // Create category map from newly inserted categories
      insertedCategories.forEach(cat => {
        categoryMap[cat.categoryCode] = cat.id;
      });
    } else {
      // Use existing categories and create category map
      console.log('📋 Using existing categories...');
      existingCategories.forEach(cat => {
        categoryMap[cat.categoryCode] = cat.id;
      });
      
      // Check if we need to update categories (in case new ones were added)
      const existingCodes = existingCategories.map(cat => cat.categoryCode);
      const newCategories = categories.filter(cat => !existingCodes.includes(cat.categoryCode));
      
      if (newCategories.length > 0) {
        console.log(`🔄 Adding ${newCategories.length} new categories...`);
        const insertedCategories = await db.insert(ukTheoryCategories).values(newCategories).returning();
        insertedCategories.forEach(cat => {
          categoryMap[cat.categoryCode] = cat.id;
        });
      }
    }
    
    // Check existing questions
    console.log('❓ Checking existing theory test questions...');
    const existingQuestions = await db.select().from(ukTheoryQuestions);
    console.log(`Found ${existingQuestions.length} existing questions`);
    
    // Always add new questions (they have unique content)
    console.log('💾 Seeding comprehensive theory test questions...');
    const questionsWithCategoryIds = comprehensiveQuestions.map(question => ({
      ...question,
      categoryId: categoryMap[question.categoryCode]
    }));
    
    // Filter out questions that might already exist (based on question text)
    const existingQuestionTexts = existingQuestions.map(q => q.questionText);
    const newQuestions = questionsWithCategoryIds.filter(q => 
      !existingQuestionTexts.includes(q.questionText)
    );
    
    if (newQuestions.length > 0) {
      const insertedQuestions = await db.insert(ukTheoryQuestions).values(newQuestions).returning();
      console.log(`✅ Successfully seeded ${insertedQuestions.length} new questions`);
    } else {
      console.log('📋 All questions already exist, skipping...');
    }
    
    // Get final counts
    const finalCategories = await db.select().from(ukTheoryCategories);
    const finalQuestions = await db.select().from(ukTheoryQuestions);
    
    console.log('\n🎉 Comprehensive database seeding completed successfully!');
    console.log(`
    📊 Final Summary:
    - ${finalCategories.length} Theory Categories available
    - ${finalQuestions.length} Total questions ready for practice
    - Questions per category: ${Math.floor(finalQuestions.length / finalCategories.length)} average
    
    🚀 Your comprehensive DVSA Theory Test system is now ready!
    - Visit /theory to start practicing with full question bank
    - Visit /admin/theory to manage the comprehensive question database
    
    📈 System Features:
    - 15 Official DVSA categories
    - ${finalQuestions.length} practice questions with explanations
    - Progress tracking and performance analytics
    - Gamification with achievements and points
    `);
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  } finally {
    await client.end();
  }
}

// Run the comprehensive seeding
seedDatabase().catch(console.error);