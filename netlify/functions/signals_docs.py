import json
from datetime import datetime

def create_response(status_code, content_type, body):
    """Create Netlify Function response"""
    return {
        'statusCode': status_code,
        'headers': {
            'Content-Type': content_type,
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type'
        },
        'body': body
    }

def generate_html_docs():
    """Generate HTML documentation page"""
    return f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mathematricks Fund - Signal API Documentation</title>
    <style>
        * {{
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }}

        body {{
            font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
            line-height: 1.6;
            color: #333;
            background: #f8f9fa;
        }}

        .container {{
            max-width: 1000px;
            margin: 0 auto;
            padding: 20px;
        }}

        .header {{
            background: #1a1a1a;
            color: white;
            padding: 2rem;
            border-radius: 8px;
            margin-bottom: 2rem;
        }}

        .logo {{
            font-size: 1.8rem;
            font-weight: bold;
            color: #4CAF50;
            margin-bottom: 0.5rem;
        }}

        .section {{
            background: white;
            padding: 2rem;
            border-radius: 8px;
            margin-bottom: 1.5rem;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }}

        .section h2 {{
            color: #4CAF50;
            margin-bottom: 1rem;
            border-bottom: 2px solid #4CAF50;
            padding-bottom: 0.5rem;
        }}

        .code-block {{
            background: #f4f4f4;
            border: 1px solid #ddd;
            border-radius: 4px;
            padding: 1rem;
            margin: 1rem 0;
            overflow-x: auto;
            font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
        }}

        .download-links {{
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 1rem;
            margin: 1rem 0;
        }}

        .download-item {{
            background: #4CAF50;
            color: white;
            padding: 1rem;
            border-radius: 8px;
            text-align: center;
            text-decoration: none;
            transition: background 0.3s;
        }}

        .download-item:hover {{
            background: #45a049;
            color: white;
        }}

        .endpoint {{
            background: #e8f5e8;
            border-left: 4px solid #4CAF50;
            padding: 1rem;
            margin: 1rem 0;
        }}

        .method {{
            background: #4CAF50;
            color: white;
            padding: 0.25rem 0.5rem;
            border-radius: 4px;
            font-size: 0.8rem;
            font-weight: bold;
            margin-right: 0.5rem;
        }}

        .required {{
            color: #e74c3c;
            font-weight: bold;
        }}

        .optional {{
            color: #7f8c8d;
        }}
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">Mathematricks Fund</div>
            <h1>Signal API Documentation</h1>
            <p>Complete integration guide for trading signal webhooks</p>
        </div>

        <div class="section">
            <h2>🚀 Quick Start</h2>
            <p>The Mathematricks Fund Signal API allows you to send trading signals to our system. All signals are validated, stored in MongoDB, and processed in real-time.</p>

            <div class="endpoint">
                <span class="method">POST</span><strong>https://mathematricks.fund/api/signals</strong>
                <br><small>Send trading signals to this endpoint</small>
            </div>
        </div>

        <div class="section">
            <h2>📋 Required Fields</h2>
            <p>All signal requests must include these required fields:</p>
            <ul>
                <li><span class="required">strategy_name</span> (string) - Name of your trading strategy</li>
                <li><span class="required">signal_sent_EPOCH</span> (integer) - Unix timestamp when signal was generated</li>
                <li><span class="required">signalID</span> (string) - Unique identifier for this signal</li>
                <li><span class="required">passphrase</span> (string) - Your authentication passphrase</li>
            </ul>

            <h3>Optional Fields</h3>
            <ul>
                <li><span class="optional">timestamp</span> (string) - ISO format timestamp</li>
                <li><span class="optional">signal</span> (object) - Trading signal details (ticker, action, price, volume)</li>
            </ul>
        </div>

        <div class="section">
            <h2>📝 Example Request</h2>
            <div class="code-block">
POST https://mathematricks.fund/api/signals
Content-Type: application/json

{{
  "strategy_name": "My Trading Bot",
  "signal_sent_EPOCH": {int(datetime.now().timestamp())},
  "signalID": "signal_123456",
  "passphrase": "your_secret_passphrase",
  "timestamp": "{datetime.now().isoformat()}",
  "signal": {{
    "ticker": "AAPL",
    "action": "BUY",
    "price": 150.25,
    "volume_24h": 50000000
  }}
}}
            </div>
        </div>

        <div class="section">
            <h2>📥 Download Client Libraries</h2>
            <p>Pre-built clients to integrate with our Signal API:</p>

            <div class="download-links">
                <a href="data:text/plain;charset=utf-8,{generate_python_client()}" download="signal_sender.py" class="download-item">
                    <h3>🐍 Python Client</h3>
                    <p>Complete Python signal sender with validation</p>
                </a>

                <a href="data:text/plain;charset=utf-8,{generate_shell_script()}" download="send_signal.sh" class="download-item">
                    <h3>🐚 Shell Script</h3>
                    <p>Simple bash script for quick signal sending</p>
                </a>

                <a href="data:text/plain;charset=utf-8,{generate_javascript_client()}" download="signal_sender.js" class="download-item">
                    <h3>🟨 JavaScript Client</h3>
                    <p>Node.js/Browser compatible signal client</p>
                </a>
            </div>
        </div>

        <div class="section">
            <h2>⚡ Response Format</h2>
            <h3>Success Response (200 OK)</h3>
            <div class="code-block">
{{
  "status": "success",
  "message": "Signal received and processed",
  "timestamp": "2024-01-01T12:00:00.000000",
  "signal_summary": {{
    "ticker": "AAPL",
    "action": "BUY",
    "price": 150.25
  }}
}}
            </div>

            <h3>Error Response (400/401/500)</h3>
            <div class="code-block">
{{
  "error": "Missing required field: strategy_name"
}}
            </div>
        </div>

        <div class="section">
            <h2>🔧 Testing Your Integration</h2>
            <p>Use curl to test your integration:</p>
            <div class="code-block">
curl -X POST https://mathematricks.fund/api/signals \\
  -H "Content-Type: application/json" \\
  -d '{{
    "strategy_name": "Test Strategy",
    "signal_sent_EPOCH": {int(datetime.now().timestamp())},
    "signalID": "test_123",
    "passphrase": "your_passphrase",
    "signal": {{
      "ticker": "AAPL",
      "action": "BUY",
      "price": 150.25
    }}
  }}'
            </div>
        </div>

        <div class="section">
            <h2>📞 Support</h2>
            <p>For API support and questions:</p>
            <ul>
                <li>Email: api@mathematricks.fund</li>
                <li>Documentation: This page</li>
                <li>Status: <a href="https://mathematricks.fund/api/signals">API Health Check</a></li>
            </ul>
        </div>
    </div>
</body>
</html>"""

def generate_python_client():
    """Generate Python client code"""
    return '''#!/usr/bin/env python3
"""
Mathematricks Fund Signal Sender
Python client for sending trading signals
"""

import requests
import time
import uuid
from datetime import datetime, timezone
import argparse
import json

class SignalSender:
    def __init__(self, api_url="https://mathematricks.fund/api/signals", passphrase="your_passphrase"):
        self.api_url = api_url
        self.passphrase = passphrase
        self.session = requests.Session()
        self.session.headers.update({
            'Content-Type': 'application/json',
            'User-Agent': 'Mathematricks-SignalSender/1.0'
        })

    def send_signal(self, ticker, action, price, volume_24h=0, strategy_name="Default Strategy"):
        """Send a trading signal to the webhook"""
        now = datetime.now(timezone.utc)
        signal_id = str(uuid.uuid4())[:8]
        epoch_time = int(now.timestamp())

        signal_data = {
            # Required fields
            "strategy_name": strategy_name,
            "signal_sent_EPOCH": epoch_time,
            "signalID": signal_id,
            "passphrase": self.passphrase,

            # Optional fields
            "timestamp": now.isoformat(),
            "signal": {
                "ticker": ticker,
                "price": price,
                "action": action,
                "volume_24h": volume_24h
            }
        }

        try:
            print(f"📡 Sending {action} signal for {ticker} at ${price}")
            print(f"   ID: {signal_id} | Epoch: {epoch_time}")

            response = self.session.post(
                self.api_url,
                json=signal_data,
                timeout=10
            )

            print(f"   Status: {response.status_code}")

            if response.status_code == 200:
                result = response.json()
                print(f"   ✅ Success: {result.get('message', 'Signal sent')}")
                return True
            else:
                print(f"   ❌ Error: {response.text}")
                return False

        except requests.exceptions.RequestException as e:
            print(f"   💥 Request Error: {str(e)}")
            return False

def main():
    parser = argparse.ArgumentParser(description='Send trading signals to Mathematricks webhook')
    parser.add_argument('--url', default='https://mathematricks.fund/api/signals',
                       help='Signals endpoint URL')
    parser.add_argument('--passphrase', required=True,
                       help='Your webhook passphrase')
    parser.add_argument('--strategy', default='Default Strategy',
                       help='Strategy name')
    parser.add_argument('--ticker', required=True, help='Stock ticker')
    parser.add_argument('--action', choices=['BUY', 'SELL'], required=True, help='Trading action')
    parser.add_argument('--price', type=float, required=True, help='Stock price')
    parser.add_argument('--volume', type=int, default=0, help='24h volume')

    args = parser.parse_args()

    sender = SignalSender(args.url, args.passphrase)
    sender.send_signal(args.ticker, args.action, args.price, args.volume, args.strategy)

if __name__ == "__main__":
    main()
'''.replace('"', '\\"').replace("'", "\\'")

def generate_shell_script():
    """Generate shell script client"""
    return '''#!/bin/bash
# Mathematricks Fund Signal Sender
# Shell script for sending trading signals

API_URL="https://mathematricks.fund/api/signals"
PASSPHRASE="${PASSPHRASE:-your_passphrase}"
STRATEGY_NAME="${STRATEGY_NAME:-Shell Script}"

# Function to send signal
send_signal() {
    local ticker="$1"
    local action="$2"
    local price="$3"
    local volume="${4:-0}"

    if [[ -z "$ticker" || -z "$action" || -z "$price" ]]; then
        echo "Usage: send_signal TICKER ACTION PRICE [VOLUME]"
        echo "Example: send_signal AAPL BUY 150.25 50000000"
        return 1
    fi

    local signal_id=$(uuidgen | cut -d'-' -f1)
    local epoch_time=$(date +%s)
    local timestamp=$(date -u +"%Y-%m-%dT%H:%M:%S.%6NZ")

    local payload=$(cat <<EOF
{
  "strategy_name": "$STRATEGY_NAME",
  "signal_sent_EPOCH": $epoch_time,
  "signalID": "$signal_id",
  "passphrase": "$PASSPHRASE",
  "timestamp": "$timestamp",
  "signal": {
    "ticker": "$ticker",
    "action": "$action",
    "price": $price,
    "volume_24h": $volume
  }
}
EOF
)

    echo "📡 Sending $action signal for $ticker at \\$$price"
    echo "   ID: $signal_id | Epoch: $epoch_time"

    response=$(curl -s -w "\\n%{http_code}" -X POST "$API_URL" \\
        -H "Content-Type: application/json" \\
        -d "$payload")

    http_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | head -n -1)

    echo "   Status: $http_code"

    if [[ "$http_code" == "200" ]]; then
        echo "   ✅ Success: Signal sent"
    else
        echo "   ❌ Error: $body"
        return 1
    fi
}

# Main execution
if [[ "$0" == "${BASH_SOURCE[0]}" ]]; then
    if [[ $# -lt 3 ]]; then
        echo "Mathematricks Fund Signal Sender"
        echo "Usage: $0 TICKER ACTION PRICE [VOLUME]"
        echo ""
        echo "Examples:"
        echo "  $0 AAPL BUY 150.25"
        echo "  $0 TSLA SELL 245.75 75000000"
        echo ""
        echo "Environment variables:"
        echo "  PASSPHRASE - Your webhook passphrase (required)"
        echo "  STRATEGY_NAME - Your strategy name (optional)"
        exit 1
    fi

    if [[ -z "$PASSPHRASE" ]]; then
        echo "❌ Error: PASSPHRASE environment variable not set"
        echo "Set it with: export PASSPHRASE=your_secret_passphrase"
        exit 1
    fi

    send_signal "$1" "$2" "$3" "$4"
fi
'''.replace('"', '\\"').replace("'", "\\'")

def generate_javascript_client():
    """Generate JavaScript client code"""
    return '''/**
 * Mathematricks Fund Signal Sender
 * JavaScript/Node.js client for sending trading signals
 */

class SignalSender {
    constructor(apiUrl = 'https://mathematricks.fund/api/signals', passphrase = 'your_passphrase') {
        this.apiUrl = apiUrl;
        this.passphrase = passphrase;
        this.headers = {
            'Content-Type': 'application/json',
            'User-Agent': 'Mathematricks-SignalSender-JS/1.0'
        };
    }

    async sendSignal(ticker, action, price, volume24h = 0, strategyName = 'JavaScript Strategy') {
        const now = new Date();
        const signalId = Math.random().toString(36).substring(2, 10);
        const epochTime = Math.floor(now.getTime() / 1000);

        const signalData = {
            // Required fields
            strategy_name: strategyName,
            signal_sent_EPOCH: epochTime,
            signalID: signalId,
            passphrase: this.passphrase,

            // Optional fields
            timestamp: now.toISOString(),
            signal: {
                ticker: ticker,
                price: price,
                action: action,
                volume_24h: volume24h
            }
        };

        try {
            console.log(`📡 Sending ${action} signal for ${ticker} at $${price}`);
            console.log(`   ID: ${signalId} | Epoch: ${epochTime}`);

            const response = await fetch(this.apiUrl, {
                method: 'POST',
                headers: this.headers,
                body: JSON.stringify(signalData)
            });

            const result = await response.json();

            console.log(`   Status: ${response.status}`);

            if (response.ok) {
                console.log(`   ✅ Success: ${result.message || 'Signal sent'}`);
                return true;
            } else {
                console.log(`   ❌ Error: ${result.error || 'Unknown error'}`);
                return false;
            }

        } catch (error) {
            console.log(`   💥 Request Error: ${error.message}`);
            return false;
        }
    }
}

// Node.js usage example
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SignalSender;

    // Command line usage
    if (require.main === module) {
        const args = process.argv.slice(2);

        if (args.length < 3) {
            console.log('Mathematricks Fund Signal Sender');
            console.log('Usage: node signal_sender.js TICKER ACTION PRICE [VOLUME] [STRATEGY]');
            console.log('');
            console.log('Examples:');
            console.log('  node signal_sender.js AAPL BUY 150.25');
            console.log('  node signal_sender.js TSLA SELL 245.75 75000000 "My Strategy"');
            console.log('');
            console.log('Environment variables:');
            console.log('  PASSPHRASE - Your webhook passphrase (required)');
            process.exit(1);
        }

        const passphrase = process.env.PASSPHRASE;
        if (!passphrase) {
            console.log('❌ Error: PASSPHRASE environment variable not set');
            console.log('Set it with: export PASSPHRASE=your_secret_passphrase');
            process.exit(1);
        }

        const [ticker, action, price, volume = 0, strategy = 'Node.js Script'] = args;
        const sender = new SignalSender('https://mathematricks.fund/api/signals', passphrase);

        sender.sendSignal(ticker, action, parseFloat(price), parseInt(volume), strategy)
            .then(success => process.exit(success ? 0 : 1));
    }
}

// Browser usage example
if (typeof window !== 'undefined') {
    window.SignalSender = SignalSender;

    // Example usage in browser:
    // const sender = new SignalSender('https://mathematricks.fund/api/signals', 'your_passphrase');
    // await sender.sendSignal('AAPL', 'BUY', 150.25, 50000000, 'Browser Strategy');
}
'''.replace('"', '\\"').replace("'", "\\'")

def handler(event, context):
    """Main Netlify Function handler for signals documentation"""
    # Get HTTP method
    http_method = event.get('httpMethod', 'GET')

    if http_method == 'OPTIONS':
        return create_response(200, 'application/json', json.dumps({'message': 'CORS preflight'}))
    elif http_method == 'GET':
        return create_response(200, 'text/html', generate_html_docs())
    else:
        return create_response(405, 'application/json', json.dumps({'error': 'Method not allowed'}))