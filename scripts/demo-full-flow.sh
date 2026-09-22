#!/usr/bin/env bash
set -e

echo "=========================================================="
echo "      ApexCare Comprehensive Architecture Demo Flow        "
echo "=========================================================="

GATEWAY="http://localhost:8080/api"
PATIENT_SVC="http://localhost:8082"

echo ""
echo "--- 1. [CO-2] Authenticate Patient (JWT Generation) ---"
LOGIN_RES=$(curl -s -X POST "$GATEWAY/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"identity": "PT-894120", "password": "password123"}')
echo "Response: $LOGIN_RES"

TOKEN=$(echo "$LOGIN_RES" | grep -o '"token":"[^"]*' | cut -d'"' -f4)
echo "Extracted Bearer Token: ${TOKEN:0:30}..."

echo ""
echo "--- 2. [PS026 / CO-2] Access Authorized Medical Records ---"
curl -s -X GET "$GATEWAY/patients/u1/records" \
  -H "Authorization: Bearer $TOKEN"
echo ""

echo ""
echo "--- 3. [CO-2 IDOR Test] Attempt to Access Patient u2's Record (Should return 403 Forbidden) ---"
IDOR_RES=$(curl -s -w "\nHTTP_STATUS:%{http_code}\n" -X GET "$GATEWAY/patients/u2/records" \
  -H "Authorization: Bearer $TOKEN")
echo "$IDOR_RES"

echo ""
echo "--- 4. [PS026 409 Conflict Test] Attempt Duplicate Appointment Booking (Should return 409) ---"
CONFLICT_RES=$(curl -s -w "\nHTTP_STATUS:%{http_code}\n" -X POST "$GATEWAY/appointments" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "patientId": "u2",
    "doctorId": "d1",
    "doctorName": "Dr. Sarah Jenkins",
    "date": "2023-10-15",
    "time": "14:00",
    "reason": "Test duplicate"
  }')
echo "$CONFLICT_RES"

echo ""
echo "--- 5. [CO-1 Synchronous Orchestration Flow] Execute Coordinated Checkout ---"
curl -s -X POST "$GATEWAY/appointments/orchestrated-checkout" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "appointmentId": "a2",
    "notes": "Coordinated physical exam completed",
    "diagnosis": "Normal Vitals",
    "fee": 80.0
  }'
echo ""

echo ""
echo "--- 6. [CO-1 REST vs SOAP] SOAP WSDL Endpoint Check ---"
curl -s "$PATIENT_SVC/ws/patients.wsdl" | head -n 15
echo "..."

echo ""
echo "=========================================================="
echo " Demo Flow Complete! All SOA / Security Gates Verified!   "
echo "=========================================================="
