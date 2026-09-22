#!/usr/bin/env bash

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

echo "Stopping ApexCare Microservices..."

for pidfile in "$DIR"/logs/*.pid; do
    if [ -f "$pidfile" ]; then
        PID=$(cat "$pidfile")
        if kill -0 "$PID" 2>/dev/null; then
            echo "Killing process $PID ($(basename "$pidfile" .pid))..."
            kill "$PID" || true
        fi
        rm -f "$pidfile"
    fi
done

echo "All ApexCare backend services stopped."
