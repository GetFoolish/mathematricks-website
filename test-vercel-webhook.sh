#!/bin/bash

# Test script for Vercel webhook deployment

echo "Testing Mathematricks Capital Vercel Webhook..."
echo ""

# Set webhook URL (update this after Vercel deployment)
WEBHOOK_URL="https://your-project.vercel.app"

if [ "$1" ]; then
    WEBHOOK_URL="$1"
fi

echo "Webhook URL: $WEBHOOK_URL"
echo ""

# Test 1: Valid BUY signal
echo "Test 1: Valid BUY signal"
curl -X POST "$WEBHOOK_URL" \
  -H "Content-Type: application/json" \
  -d '{
    "passphrase": "yahoo123",
    "timestamp": "2024-01-15T10:30:00Z",
    "signal": {
      "ticker": "AAPL",
      "price": 150.25,
      "action": "BUY",
      "volume_24h": 50000000
    }
  }'

echo -e "\n\n"

# Test 2: Valid SELL signal
echo "Test 2: Valid SELL signal"
curl -X POST "$WEBHOOK_URL" \
  -H "Content-Type: application/json" \
  -d '{
    "passphrase": "yahoo123",
    "timestamp": "2024-01-15T11:45:00Z",
    "signal": {
      "ticker": "TSLA",
      "price": 245.75,
      "action": "SELL",
      "volume_24h": 75000000
    }
  }'

echo -e "\n\n"

# Test 3: Invalid passphrase
echo "Test 3: Invalid passphrase (should fail)"
curl -X POST "$WEBHOOK_URL" \
  -H "Content-Type: application/json" \
  -d '{
    "passphrase": "wrong123",
    "timestamp": "2024-01-15T12:00:00Z",
    "signal": {
      "ticker": "BTC",
      "price": 42000,
      "action": "BUY",
      "volume_24h": 1000000
    }
  }'

echo -e "\n\n"

# Test 4: GET request (webhook info)
echo "Test 4: GET request (webhook info)"
curl -X GET "$WEBHOOK_URL"

echo -e "\n\nWebhook testing complete!"
echo ""
echo "Usage: $0 [webhook-url]"
echo "Example: $0 https://mathematricks-webhook.vercel.app"