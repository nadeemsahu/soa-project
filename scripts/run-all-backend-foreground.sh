#!/usr/bin/env bash
set -e
DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

trap 'kill $(jobs -p) 2>/dev/null' EXIT

echo "[1/6] Launching Eureka Server (port 8761)..."
java -jar "$DIR/backend/eureka-server/target/eureka-server-1.0.0.jar" &
sleep 5

echo "[2/6] Launching Auth Service (port 8081)..."
java -jar "$DIR/backend/auth-service/target/auth-service-1.0.0.jar" &

echo "[3/6] Launching Patient Service (port 8082)..."
java -jar "$DIR/backend/patient-service/target/patient-service-1.0.0.jar" &

echo "[4/6] Launching Appointment Service (port 8083)..."
java -jar "$DIR/backend/appointment-service/target/appointment-service-1.0.0.jar" &

echo "[5/6] Launching Billing Service (port 8084)..."
java -jar "$DIR/backend/billing-service/target/billing-service-1.0.0.jar" &
sleep 6

echo "[6/6] Launching Spring Cloud API Gateway (port 8080)..."
java -jar "$DIR/backend/api-gateway/target/api-gateway-1.0.0.jar"
