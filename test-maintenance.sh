#!/bin/bash

# Test Maintenance Mode Functionality

echo "🧪 Testing Maintenance Mode System"
echo "=================================="
echo

# Test 1: Check maintenance status endpoint
echo "1. Testing maintenance status API endpoint..."
curl -s http://localhost:3001/api/admin/settings/maintenance-status | jq '.'
echo

# Test 2: Test maintenance page accessibility
echo "2. Testing maintenance page accessibility..."
STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3001/maintenance)
if [ $STATUS -eq 200 ]; then
    echo "✅ Maintenance page is accessible (HTTP $STATUS)"
else
    echo "❌ Maintenance page returned HTTP $STATUS"
fi
echo

# Test 3: Check if admin settings page loads
echo "3. Testing admin settings page..."
STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3001/admin/settings)
if [ $STATUS -eq 200 ]; then
    echo "✅ Admin settings page is accessible (HTTP $STATUS)"
else
    echo "❌ Admin settings page returned HTTP $STATUS"
fi
echo

echo "🎉 Maintenance Mode System Test Complete!"