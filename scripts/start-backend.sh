#!/usr/bin/env bash
set -e

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
mkdir -p "$DIR/logs"

echo "=========================================================="
echo "    Starting ApexCare Microservices Ecosystem (Java 21)   "
echo "=========================================================="

if [ ! -f "$DIR/backend/eureka-server/target/eureka-server-1.0.0.jar" ]; then
    echo "Compiling microservices packages..."
    mvn -f "$DIR/backend/pom.xml" package -DskipTests
fi

echo "[1/6] Launching Eureka Server (port 8761)..."
nohup java -jar "$DIR/backend/eureka-server/target/eureka-server-1.0.0.jar" > "$DIR/logs/eureka.log" 2>&1 &
echo $! > "$DIR/logs/eureka.pid"

echo "Waiting 6s for Eureka initialization..."
sleep 6

echo "[2/6] Launching Auth Service (port 8081)..."
nohup java -jar "$DIR/backend/auth-service/target/auth-service-1.0.0.jar" > "$DIR/logs/auth.log" 2>&1 &
echo $! > "$DIR/logs/auth.pid"

echo "[3/6] Launching Patient Service (port 8082)..."
nohup java -jar "$DIR/backend/patient-service/target/patient-service-1.0.0.jar" > "$DIR/logs/patient.log" 2>&1 &
echo $! > "$DIR/logs/patient.pid"

echo "[4/6] Launching Appointment Service (port 8083)..."
nohup java -jar "$DIR/backend/appointment-service/target/appointment-service-1.0.0.jar" > "$DIR/logs/appointment.log" 2>&1 &
echo $! > "$DIR/logs/appointment.pid"

echo "[5/6] Launching Billing Service (port 8084)..."
nohup java -jar "$DIR/backend/billing-service/target/billing-service-1.0.0.jar" > "$DIR/logs/billing.log" 2>&1 &
echo $! > "$DIR/logs/billing.pid"

echo "Waiting 6s before starting API Gateway..."
sleep 6

echo "[6/6] Launching Spring Cloud API Gateway (port 8080)..."
nohup java -jar "$DIR/backend/api-gateway/target/api-gateway-1.0.0.jar" > "$DIR/logs/gateway.log" 2>&1 &
echo $! > "$DIR/logs/gateway.pid"

echo ""
echo "=========================================================="
echo " ApexCare Backend started successfully in background!     "
echo " Logs available in $DIR/logs/                              "
echo " Eureka Dashboard: http://localhost:8761                  "
echo " API Gateway:      http://localhost:8080                  "
echo " Run ./scripts/stop-backend.sh to stop all services.      "
echo "=========================================================="
