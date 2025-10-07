# POST /api/admin/instructors API Documentation

## Overview
This endpoint creates new instructors in the system. It supports two modes of operation:

1. **Full Instructor Creation**: Creates both a user account and complete instructor profile
2. **User-Only Creation**: Creates just a user account (backwards compatibility)

## Endpoint
```
POST /api/admin/instructors
```

## Request Formats

### 1. Full Instructor Creation
Creates a complete instructor profile with ADI details, vehicle information, and all professional details.

#### Required Fields
```json
{
  "email": "instructor@example.com",
  "firstName": "John",
  "lastName": "Smith",
  "adiBadgeNumber": "ADI123456",
  "adiGrade": "grade_6",
  "yearsExperience": 5,
  "hourlyRate": 45.00,
  "baseCity": "London",
  "specialties": ["manual", "automatic", "intensive"]
}
```

#### Optional Fields
```json
{
  "phone": "+44 7123 456789",
  "city": "London",
  "instructorSummary": "Experienced driving instructor...",
  "qualifications": "ADI qualified since 2019...",
  "weeklyAvailability": {
    "monday": ["09:00-17:00"],
    "tuesday": ["09:00-17:00"]
  },
  "availability": "Monday to Friday, 9 AM - 5 PM",
  "businessAddress": "123 Main Street, London",
  "businessPostcode": "SW1A 1AA",
  "whatsappNumber": "+44 7123 456789",
  "vehicleDetails": "Clean, modern vehicle with dual controls",
  "carMake": "Toyota",
  "carModel": "Corolla",
  "carYear": 2022,
  "carType": "manual",
  "carFuelType": "petrol",
  "vehicleRegistration": "AB12 CDE",
  "transmissionTypes": ["manual", "automatic"],
  "insuranceCompany": "Direct Line",
  "insurancePolicyNumber": "POL123456789",
  "ethnicity": "British",
  "religion": "Christian",
  "bio": "Passionate about road safety...",
  "teachingExpertise": "Nervous drivers",
  "adiNumber": "123456"
}
```

### 2. User-Only Creation (Backwards Compatibility)
Creates just a user account without instructor profile.

```json
{
  "email": "user@example.com",
  "firstName": "Jane",
  "lastName": "Doe",
  "phone": "+44 7987 654321",
  "role": "instructor",
  "city": "Manchester"
}
```

## Field Specifications

### ADI Grade Values
- `"grade_4"`: Grade 4 ADI
- `"grade_5"`: Grade 5 ADI
- `"grade_6"`: Grade 6 ADI (highest)
- `"trainee"`: Trainee instructor

### Car Type Values
- `"manual"`: Manual transmission
- `"automatic"`: Automatic transmission

### Fuel Type Values
- `"petrol"`: Petrol engine
- `"diesel"`: Diesel engine
- `"electric"`: Electric vehicle
- `"hybrid"`: Hybrid vehicle

## Response Formats

### Success Response (Full Instructor)
```json
{
  "success": true,
  "data": {
    "id": 1,
    "userId": 123,
    "userName": "John Smith",
    "userEmail": "instructor@example.com",
    "userPhone": "+44 7123 456789",
    "userIsActive": true,
    "userCreatedAt": "2025-10-06T12:00:00Z",
    "adiBadgeNumber": "ADI123456",
    "adiGrade": "grade_6",
    "yearsExperience": 5,
    "hourlyRate": "45.00",
    "specialties": ["manual", "automatic", "intensive"],
    "baseCity": "London",
    "isActive": true,
    "createdAt": "2025-10-06T12:00:00Z",
    "updatedAt": "2025-10-06T12:00:00Z"
  }
}
```

### Success Response (User Only)
```json
{
  "success": true,
  "data": {
    "id": 123,
    "email": "user@example.com",
    "firstName": "Jane",
    "lastName": "Doe",
    "phone": "+44 7987 654321",
    "role": "instructor",
    "city": "Manchester",
    "isActive": true,
    "isEmailVerified": false,
    "createdAt": "2025-10-06T12:00:00Z",
    "updatedAt": "2025-10-06T12:00:00Z"
  }
}
```

### Error Responses

#### Email Already Exists
```json
{
  "success": false,
  "error": "User with this email already exists"
}
```

#### ADI Badge Already Exists
```json
{
  "success": false,
  "error": "ADI badge number already exists"
}
```

#### Missing Required Fields
```json
{
  "success": false,
  "error": "Missing required instructor fields: adiBadgeNumber, adiGrade, yearsExperience, hourlyRate, and baseCity are required"
}
```

## Database Operations

### What Gets Created

#### Full Instructor Creation
1. **User Record**: Created in `users` table with role `'instructor'`
2. **Instructor Profile**: Created in `instructors` table with all professional details
3. **Password**: Auto-generated temporary password: `TempPassword123!`

#### User-Only Creation
1. **User Record**: Created in `users` table with specified role
2. **Password**: Auto-generated temporary password: `TempPassword123!`

### Validation

- ✅ **Email Uniqueness**: Checked across all users
- ✅ **ADI Badge Uniqueness**: Checked across all instructors
- ✅ **Required Field Validation**: All required fields validated
- ✅ **Data Sanitization**: All string fields trimmed and normalized
- ✅ **Role Assignment**: Auto-assigned 'instructor' role for full creation

## Example Usage

### cURL Example (Full Instructor)
```bash
curl -X POST http://localhost:3000/api/admin/instructors \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.smith@example.com",
    "firstName": "John",
    "lastName": "Smith",
    "phone": "+44 7123 456789",
    "adiBadgeNumber": "ADI123456",
    "adiGrade": "grade_6",
    "yearsExperience": 8,
    "hourlyRate": 50,
    "baseCity": "London",
    "specialties": ["manual", "automatic", "pass_plus"],
    "carMake": "Toyota",
    "carModel": "Corolla",
    "carType": "manual",
    "vehicleRegistration": "AB12 CDE"
  }'
```

### JavaScript Example
```javascript
const response = await fetch('/api/admin/instructors', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email: 'instructor@example.com',
    firstName: 'John',
    lastName: 'Smith',
    adiBadgeNumber: 'ADI789012',
    adiGrade: 'grade_6',
    yearsExperience: 10,
    hourlyRate: 55,
    baseCity: 'Birmingham',
    specialties: ['nervous_drivers', 'intensive_courses'],
  }),
});

const result = await response.json();
console.log(result);
```

## Status Codes

- **201**: Instructor/User created successfully
- **400**: Bad request (validation errors)
- **409**: Conflict (email or ADI badge already exists)
- **500**: Internal server error

## Notes

- All instructors are created with `isActive: true`
- Default password is `TempPassword123!` (should be changed on first login)
- Email addresses are normalized to lowercase
- All string fields are trimmed of whitespace
- Instructor profiles include both user and professional details
- The API automatically detects whether to create full instructor or user-only based on presence of ADI fields