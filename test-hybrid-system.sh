#!/bin/bash

# Test script for the complete hybrid signal collection system
# Tests: TradingView → Vercel → Cloudflare Tunnel → Local Collector

echo "🧪 Mathematricks Capital - Hybrid System Test"
echo "=============================================="
echo ""

WEBHOOK_URL="https://mathematricks-website.vercel.app"
LOCAL_URL="http://localhost:8888"

# Function to send test signal
send_test_signal() {
    local test_name="$1"
    local ticker="$2"
    local action="$3"
    local price="$4"
    local url="$5"

    echo "🔄 $test_name"

    # Generate current timestamp
    TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%S.%3NZ" 2>/dev/null || date -u -Iseconds)

    # Send signal
    RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$url" \
        -H "Content-Type: application/json" \
        -d "{
            \"passphrase\": \"yahoo123\",
            \"timestamp\": \"$TIMESTAMP\",
            \"signal\": {
                \"ticker\": \"$ticker\",
                \"price\": $price,
                \"action\": \"$action\",
                \"volume_24h\": 50000000
            }
        }")

    # Extract response body and status code
    BODY=$(echo "$RESPONSE" | head -n -1)
    STATUS=$(echo "$RESPONSE" | tail -n 1)

    if [ "$STATUS" = "200" ]; then
        echo "✅ Success: $ticker $action at $price"
        echo "📝 Response: $BODY"
    else
        echo "❌ Failed: HTTP $STATUS"
        echo "📝 Response: $BODY"
    fi

    echo ""
}

# Function to check service status
check_service() {
    local name="$1"
    local url="$2"

    echo -n "🔍 Checking $name: "

    if curl -s -f "$url" > /dev/null 2>&1; then
        echo "🟢 ONLINE"
    else
        echo "🔴 OFFLINE"
    fi
}

# Pre-flight checks
echo "🔍 Pre-flight System Checks"
echo "----------------------------"
check_service "Vercel Webhook" "$WEBHOOK_URL"
check_service "Local Collector" "$LOCAL_URL"
echo ""

# Test 1: Direct signal to Vercel (should be stored and forwarded)
send_test_signal "Test 1: Production Signal (Vercel → Tunnel → Local)" "AAPL" "BUY" "150.25" "$WEBHOOK_URL/api/webhook"

# Wait a moment for forwarding
echo "⏳ Waiting 3 seconds for signal forwarding..."
sleep 3
echo ""

# Test 2: Direct signal to local collector (bypass webhook)
send_test_signal "Test 2: Direct Local Signal (bypass webhook)" "TSLA" "SELL" "245.75" "$LOCAL_URL"

# Test 3: Check stored signals in Vercel
echo "🔄 Test 3: Checking Stored Signals in Vercel"
echo ""

SIGNALS_RESPONSE=$(curl -s "$WEBHOOK_URL/api/signals")
SIGNAL_COUNT=$(echo "$SIGNALS_RESPONSE" | grep -o '"total_signals":[0-9]*' | cut -d':' -f2 || echo "0")

echo "📊 Stored signals in Vercel: $SIGNAL_COUNT"
echo "📝 Response: $SIGNALS_RESPONSE"
echo ""

# Test 4: Simulate forwarded signal (as Cloudflare would send)
echo "🔄 Test 4: Simulated Forwarded Signal"
TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%S.%3NZ" 2>/dev/null || date -u -Iseconds)

FORWARDED_RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$LOCAL_URL" \
    -H "Content-Type: application/json" \
    -d "{
        \"source\": \"vercel_forwarded\",
        \"forwarded_at\": \"$TIMESTAMP\",
        \"original_signal\": {
            \"passphrase\": \"yahoo123\",
            \"timestamp\": \"$TIMESTAMP\",
            \"signal\": {
                \"ticker\": \"ETH\",
                \"price\": 2500.50,
                \"action\": \"BUY\",
                \"volume_24h\": 25000000
            }
        }
    }")

BODY=$(echo "$FORWARDED_RESPONSE" | head -n -1)
STATUS=$(echo "$FORWARDED_RESPONSE" | tail -n 1)

if [ "$STATUS" = "200" ]; then
    echo "✅ Success: Forwarded signal processed"
    echo "📝 Response: $BODY"
else
    echo "❌ Failed: HTTP $STATUS"
    echo "📝 Response: $BODY"
fi

echo ""

# Summary
echo "📋 Test Summary"
echo "==============="
echo ""
echo "✅ Tests completed. Check your local collector terminal for signal processing logs."
echo ""
echo "🔍 What to verify:"
echo "1. Local collector should show signals with proper timing analysis"
echo "2. Check for both 🚨 LIVE and 📡 forwarded signal types"
echo "3. Verify catch-up functionality on next collector restart"
echo ""
echo "📊 Next Steps:"
echo "1. Monitor the status line in your collector: '🌐 Webhook: 🟢 ONLINE | 📡 Tunnel: 🟢 LISTENING'"
echo "2. Test with real TradingView signals"
echo "3. Verify signal persistence in collected_signals.json"
echo ""
echo "🔧 Troubleshooting:"
echo "- If signals aren't forwarded, check Vercel LOCAL_COLLECTOR_URL environment variable"
echo "- If tunnel is offline, restart: cloudflared tunnel --config ~/.cloudflared/config.yml run"
echo "- If collector is offline, restart: python signal-collector.py"