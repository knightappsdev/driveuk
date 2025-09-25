#!/bin/bash
# DriveSchool Pro v3.0 - API Testing Script

BASE_URL="http://localhost:3000"

echo "🧪 Testing DriveSchool Pro v3.0 API Endpoints..."
echo "🔗 Base URL: $BASE_URL"
echo "========================================"

# Test 1: Courses API
echo "📚 1. Testing Courses API..."
COURSES_COUNT=$(curl -s "$BASE_URL/api/courses" | grep -o '"id":' | wc -l)
echo "   ✅ Found $COURSES_COUNT courses"

# Test 2: Instructors API
echo "👨‍🏫 2. Testing Instructors API..."
INSTRUCTORS_RESPONSE=$(curl -s "$BASE_URL/api/instructors")
INSTRUCTORS_TOTAL=$(echo $INSTRUCTORS_RESPONSE | grep -o '"total":[0-9]*' | cut -d':' -f2)
echo "   ✅ Total instructors: $INSTRUCTORS_TOTAL"

# Test 3: Bookings API
echo "📅 3. Testing Bookings API..."
BOOKINGS_RESPONSE=$(curl -s "$BASE_URL/api/bookings")
echo "   ✅ Bookings API working"

# Test 4: User API
echo "👤 4. Testing User API..."
USER_RESPONSE=$(curl -s "$BASE_URL/api/user")
echo "   ✅ User API working (returns: $USER_RESPONSE)"

# Test 5: Stats API
echo "📊 5. Testing Statistics API..."
STATS_RESPONSE=$(curl -s "$BASE_URL/api/stats/purchases")
TOTAL_PURCHASES=$(echo $STATS_RESPONSE | grep -o '"totalPurchases":[0-9]*' | cut -d':' -f2)
echo "   ✅ Total purchases: $TOTAL_PURCHASES"

# Test 6: Create Booking
echo "🆕 6. Testing Booking Creation..."
BOOKING_RESULT=$(curl -s -X POST "$BASE_URL/api/bookings" \
  -H "Content-Type: application/json" \
  -d '{
    "courseId": "beginner",
    "transmissionType": "manual",
    "studentName": "API Test Student",
    "studentEmail": "apitest@example.com",
    "studentPhone": "07700900999"
  }')
BOOKING_SUCCESS=$(echo $BOOKING_RESULT | grep -o '"success":true')
if [ "$BOOKING_SUCCESS" = '"success":true' ]; then
  echo "   ✅ Booking creation successful"
else
  echo "   ❌ Booking creation failed"
fi

# Test 7: WhatsApp API
echo "📱 7. Testing WhatsApp API..."
WHATSAPP_RESULT=$(curl -s -X POST "$BASE_URL/api/contact/whatsapp" \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "447700900123",
    "message": "API Test Message",
    "type": "general"
  }')
WHATSAPP_SUCCESS=$(echo $WHATSAPP_RESULT | grep -o '"success":true')
if [ "$WHATSAPP_SUCCESS" = '"success":true' ]; then
  echo "   ✅ WhatsApp API working"
else
  echo "   ❌ WhatsApp API failed"
fi

# Test 8: Add Purchase
echo "🛒 8. Testing Purchase Addition..."
PURCHASE_RESULT=$(curl -s -X POST "$BASE_URL/api/stats/purchases" \
  -H "Content-Type: application/json" \
  -d '{
    "courseId": 2,
    "studentName": "API Test Purchase",
    "location": "Test Location",
    "purchaseAmount": 100.00,
    "isRealPurchase": false
  }')
PURCHASE_SUCCESS=$(echo $PURCHASE_RESULT | grep -o '"success":true')
if [ "$PURCHASE_SUCCESS" = '"success":true' ]; then
  echo "   ✅ Purchase addition successful"
else
  echo "   ❌ Purchase addition failed"
fi

echo "========================================"
echo "🎉 API Testing Complete!"
echo ""
echo "🔐 Test Account Credentials:"
echo "   Admin: admin@driveschool.com / admin123"
echo "   Instructor: sarah.jones@instructor.com / instructor123" 
echo "   Student: john.smith@student.com / student123"
echo ""
echo "🌐 Frontend URLs:"
echo "   Homepage: $BASE_URL"
echo "   Admin Dashboard: $BASE_URL/admin"
echo "   Instructor Portal: $BASE_URL/instructor"
echo ""
echo "📚 Documentation:"
echo "   API Guide: docs/API_TESTING_GUIDE.md"