#!/bin/bash

# Test script for TradingView webhook

echo "Testing TradingView Webhook..."
echo "Webhook URL: http://localhost:8080"
echo ""

# Test 1: Valid payload
echo "Test 1: Valid BUY signal"
curl -X POST "http://localhost:8080" \
  -H "Content-Type: application/json" \
  -d '{
    "passphrase": "test123",
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
curl -X POST "http://localhost:8080" \
  -H "Content-Type: application/json" \
  -d '{
    "passphrase": "test123",
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
curl -X POST "http://localhost:8080" \
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

# Test 4: Missing passphrase
echo "Test 4: Missing passphrase (should fail)"
curl -X POST "http://localhost:8080" \
  -H "Content-Type: application/json" \
  -d '{
    "timestamp": "2024-01-15T12:15:00Z",
    "signal": {
      "ticker": "ETH",
      "price": 2500,
      "action": "BUY",
      "volume_24h": 800000
    }
  }'

echo -e "\n\n"

# Test 5: Wrong HTTP method
echo "Test 5: GET request (should fail)"
curl -X GET "http://localhost:8080"

echo -e "\n\nWebhook testing complete!"