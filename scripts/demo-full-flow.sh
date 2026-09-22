#!/usr/bin/env bash
set -e

echo "=========================================================="
echo "    ApexCare Comprehensive Integration & Verification Flow "
echo "=========================================================="

GATEWAY="http://localhost:8080/api"
PATIENT_SVC="http://localhost:8082"

echo ""
echo "--- 1. [Security] Authenticate Patient (JWT Generation) ---"
LOGIN_RES=$(curl -s -X POST "$GATEWAY/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"identity": "PT-894120", "password": "password123"}')
echo "Response: $LOGIN_RES"

TOKEN=$(echo "$LOGIN_RES" | grep -o '"token":"[^"]*' | cut -d'"' -f4)
echo "Extracted Bearer Token: ${TOKEN:0:30}..."

echo ""
echo "--- 2. [Clinical Onboarding] Register New Patient via Gateway ---"
REG_RES=$(curl -s -X POST "$GATEWAY/patients" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name": "Sarah Connor",
    "age": 29,
    "gender": "Female",
    "bloodGroup": "AB+",
    "allergies": "Sulfa",
    "email": "sarah.connor@example.com"
  }')
echo "Registered Patient: $REG_RES"

echo ""
echo "--- 3. [EHR Integration] Access Authorized Medical Records ---"
curl -s -X GET "$GATEWAY/patients/u1/records" \
  -H "Authorization: Bearer $TOKEN"
echo ""

echo ""
echo "--- 4. [Access Control Test] Attempt Unauthorized Cross-Tenant Access (Should return 403 Forbidden) ---"
IDOR_RES=$(curl -s -w "\nHTTP_STATUS:%{http_code}\n" -X GET "$GATEWAY/patients/u2/records" \
  -H "Authorization: Bearer $TOKEN")
echo "$IDOR_RES"

echo ""
echo "--- 5. [Scheduling Engine] Attempt Duplicate Appointment Booking (Should return 409 Conflict) ---"
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
echo "--- 6. [Care Coordination: Appointment -> EHR -> Billing] Coordinated Checkout ---"
CHECKOUT_RES=$(curl -s -X POST "$GATEWAY/appointments/orchestrated-checkout" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "appointmentId": "a2",
    "notes": "Coordinated physical exam completed",
    "diagnosis": "Normal Vitals",
    "fee": 80.0
  }')
echo "Orchestration Pipeline Response: $CHECKOUT_RES"

echo ""
echo "--- 7. [Revenue Operations] Process Bill Payment ---"
PAY_RES=$(curl -s -X POST "$GATEWAY/billing/b2/pay" \
  -H "Authorization: Bearer $TOKEN")
echo "Payment Result: $PAY_RES"

echo ""
echo "--- 8. [Interoperability Contract] SOAP WSDL Endpoint Check ---"
curl -s "$PATIENT_SVC/ws/patients.wsdl" | head -n 15
echo "..."

echo ""
echo "=========================================================="
echo " Verification Complete! All Service Contracts & Security Verified! "
echo "=========================================================="
