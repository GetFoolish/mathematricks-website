#!/usr/bin/env python3
import requests
import json
import time
import datetime
from dateutil import parser
from typing import Dict, Any
import threading
from http.server import BaseHTTPRequestHandler, HTTPServer
import urllib.parse
import os
from pymongo import MongoClient
from pymongo.errors import PyMongoError

class WebhookSignalCollector:
    def __init__(self, webhook_url: str, local_port: int = 8888, mongodb_url: str = None):
        self.webhook_url = webhook_url
        self.local_port = local_port
        self.collected_signals = []
        self.server = None
        self.signals_file = "collected_signals.json"
        self.last_signal_timestamp = None
        self.mongodb_url = mongodb_url or "mongodb+srv://vandan_db_user:pY3qmfZmpWqleff3@mathematricks-signalscl.bmgnpvs.mongodb.net/"
        self.mongodb_client = None
        self.mongodb_collection = None

        # Try to connect to MongoDB
        self.connect_to_mongodb()

        # Load existing signals if file exists
        self.load_signals()

        # Determine last signal timestamp for catch-up mode
        if self.collected_signals:
            self.last_signal_timestamp = max(
                signal.get('received_time', '')
                for signal in self.collected_signals
            )

    def connect_to_mongodb(self):
        """Connect to MongoDB Atlas"""
        try:
            # Add SSL options for macOS compatibility
            self.mongodb_client = MongoClient(
                self.mongodb_url,
                tls=True,
                tlsAllowInvalidCertificates=True  # For development only
            )
            # Test connection
            self.mongodb_client.admin.command('ping')

            # Get collection
            db = self.mongodb_client['mathematricks_signals']
            self.mongodb_collection = db['trading_signals']

            print("✅ Connected to MongoDB Atlas")
            return True
        except PyMongoError as e:
            print(f"⚠️ MongoDB connection failed: {e}")
            print("📄 Will fall back to JSON file storage")
            return False

    def fetch_missed_signals_from_mongodb(self):
        """Fetch missed signals directly from MongoDB"""
        if not self.mongodb_collection:
            print("🔄 MongoDB not available, checking via API...")
            return self.fetch_missed_signals()

        try:
            print("🔄 Checking for missed signals from MongoDB...")

            # Build query filter
            query_filter = {}
            if self.last_signal_timestamp:
                try:
                    since_dt = parser.parse(self.last_signal_timestamp)
                    query_filter['received_at'] = {'$gt': since_dt}
                except Exception as e:
                    print(f"⚠️ Invalid timestamp format: {self.last_signal_timestamp}")

            # Query MongoDB directly
            missed_signals_cursor = self.mongodb_collection.find(query_filter).sort('received_at', 1)
            missed_signals = list(missed_signals_cursor)

            if missed_signals:
                print(f"📥 Found {len(missed_signals)} missed signals in MongoDB")

                for signal_doc in missed_signals:
                    # Convert MongoDB document to our format
                    received_time = signal_doc['received_at']
                    if isinstance(received_time, str):
                        received_time = parser.parse(received_time)

                    # Reconstruct signal data from MongoDB format
                    signal_data = {
                        'timestamp': signal_doc.get('timestamp'),
                        'signal_id': signal_doc.get('signal_id'),
                        'epoch_time': signal_doc.get('epoch_time'),
                        'signal': signal_doc.get('signal_data', {})
                    }

                    # Process as a caught-up signal
                    self.process_signal(
                        signal_data,
                        received_time,
                        is_catchup=True,
                        original_id=signal_doc.get('signal_id')
                    )

                print(f"✅ Successfully caught up with {len(missed_signals)} signals from MongoDB")
            else:
                print("✅ No missed signals found in MongoDB")

        except PyMongoError as e:
            print(f"❌ Error fetching from MongoDB: {e}")
            print("🔄 Falling back to API method...")
            return self.fetch_missed_signals()

    def load_signals(self):
        """Load previously collected signals from JSON file"""
        try:
            if os.path.exists(self.signals_file):
                with open(self.signals_file, 'r') as f:
                    data = json.load(f)
                    self.collected_signals = data.get('signals', [])
                    print(f"📂 Loaded {len(self.collected_signals)} existing signals from {self.signals_file}")
            else:
                print(f"📂 No existing signals file found. Starting fresh.")
        except Exception as e:
            print(f"⚠️ Error loading signals file: {e}")
            self.collected_signals = []

    def save_signals(self):
        """Save collected signals to JSON file"""
        try:
            # Convert datetime objects to strings for JSON serialization
            signals_to_save = []
            for signal in self.collected_signals:
                signal_copy = signal.copy()
                if isinstance(signal_copy['received_time'], datetime.datetime):
                    signal_copy['received_time'] = signal_copy['received_time'].isoformat()
                signals_to_save.append(signal_copy)

            data = {
                'webhook_url': self.webhook_url,
                'last_updated': datetime.datetime.now(datetime.timezone.utc).isoformat(),
                'total_signals': len(signals_to_save),
                'signals': signals_to_save
            }

            with open(self.signals_file, 'w') as f:
                json.dump(data, f, indent=2)

            print(f"💾 Saved {len(signals_to_save)} signals to {self.signals_file}")
        except Exception as e:
            print(f"❌ Error saving signals: {e}")

    def fetch_missed_signals(self):
        """Fetch signals from Vercel that were missed while offline"""
        try:
            print("🔄 Checking for missed signals from Vercel...")

            # Build URL with timestamp filter if we have a last signal
            fetch_url = f"{self.webhook_url}/api/signals"
            if self.last_signal_timestamp:
                fetch_url += f"?since={self.last_signal_timestamp}"

            response = requests.get(fetch_url, timeout=10)

            if response.status_code == 200:
                data = response.json()
                missed_signals = data.get('signals', [])

                if missed_signals:
                    print(f"📥 Found {len(missed_signals)} missed signals, downloading...")

                    for stored_signal in missed_signals:
                        # Convert stored signal back to our format
                        received_time = parser.parse(stored_signal['received_at'])
                        signal_data = stored_signal['signal_data']

                        # Process as a caught-up signal
                        self.process_signal(
                            signal_data,
                            received_time,
                            is_catchup=True,
                            original_id=stored_signal['id']
                        )

                    print(f"✅ Successfully caught up with {len(missed_signals)} signals")
                else:
                    print("✅ No missed signals found")

            else:
                print(f"⚠️ Failed to fetch signals from Vercel: {response.status_code}")

        except Exception as e:
            print(f"❌ Error fetching missed signals: {e}")

    def calculate_delay(self, sent_timestamp: str, received_timestamp: datetime.datetime) -> float:
        """Calculate delay between sent and received timestamps"""
        try:
            sent_dt = parser.parse(sent_timestamp)

            # Make both timestamps timezone-aware
            if sent_dt.tzinfo is None:
                # Assume UTC if no timezone info
                sent_dt = sent_dt.replace(tzinfo=datetime.timezone.utc)
            if received_timestamp.tzinfo is None:
                # Make received timestamp UTC timezone-aware
                received_timestamp = received_timestamp.replace(tzinfo=datetime.timezone.utc)

            delay_seconds = (received_timestamp - sent_dt).total_seconds()
            return delay_seconds
        except Exception as e:
            print(f"⚠️ Error calculating delay: {e}")
            return 0.0

    def process_signal(self, signal_data: dict, received_time: datetime.datetime, is_catchup: bool = False, original_id: int = None):
        """Process and display received signal with timing information"""
        signal_id = original_id if is_catchup else len(self.collected_signals) + 1

        # Extract signal information
        timestamp = signal_data.get('timestamp', 'No timestamp')
        signal = signal_data.get('signal', {})
        ticker = signal.get('ticker', 'UNKNOWN')
        action = signal.get('action', 'UNKNOWN')
        price = signal.get('price', 'N/A')

        # Calculate delay if timestamp is provided
        delay = 0.0
        if timestamp != 'No timestamp':
            delay = self.calculate_delay(timestamp, received_time)

        # Store signal (avoid duplicates for catch-up signals)
        if not is_catchup:
            signal_record = {
                'id': signal_id,
                'received_time': received_time,
                'sent_timestamp': timestamp,
                'delay_seconds': delay,
                'signal': signal_data
            }
            self.collected_signals.append(signal_record)

            # Save signals to file after each new signal
            self.save_signals()

        # Display signal information
        signal_type = "📥 CATCHUP" if is_catchup else "🚨 LIVE"
        print(f"\n{signal_type} SIGNAL #{signal_id}")
        print(f"⏰ Received Time: {received_time.strftime('%Y-%m-%d %H:%M:%S.%f')[:-3]}")
        print(f"📤 Sent Time: {timestamp}")
        if delay > 0:
            print(f"⚡ Delay: {delay:.3f} seconds")
        print(f"📊 Ticker: {ticker} | Action: {action} | Price: {price}")
        if is_catchup:
            print(f"🔄 Caught up from Vercel storage")
        print("─" * 60)

    class SignalHandler(BaseHTTPRequestHandler):
        def __init__(self, collector, *args, **kwargs):
            self.collector = collector
            super().__init__(*args, **kwargs)

        def do_POST(self):
            received_time = datetime.datetime.now(datetime.timezone.utc)

            try:
                # Get content length and read data
                content_length = int(self.headers.get('Content-Length', 0))
                post_data = self.rfile.read(content_length)

                # Parse JSON
                signal_data = json.loads(post_data.decode('utf-8'))

                # Check if this is a forwarded signal from Vercel
                if signal_data.get('source') == 'vercel_forwarded':
                    # Extract the original signal from the forwarded payload
                    original_signal = signal_data.get('original_signal', {})
                    forwarded_time = signal_data.get('forwarded_at')

                    print(f"📡 Received forwarded signal via Cloudflare Tunnel")
                    if forwarded_time:
                        print(f"🔄 Forwarded at: {forwarded_time}")

                    # Process the original signal
                    self.collector.process_signal(original_signal, received_time)
                else:
                    # Process direct signal
                    self.collector.process_signal(signal_data, received_time)

                # Send response
                self.send_response(200)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                response = {"status": "collected", "signal_id": len(self.collector.collected_signals)}
                self.wfile.write(json.dumps(response).encode())

            except Exception as e:
                print(f"❌ Error processing signal: {e}")
                self.send_response(400)
                self.end_headers()

        def do_GET(self):
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            response = {
                "status": "Signal Collector Active",
                "signals_collected": len(self.collector.collected_signals),
                "webhook_url": self.collector.webhook_url
            }
            self.wfile.write(json.dumps(response).encode())

        def log_message(self, format, *args):
            # Suppress default HTTP server logs
            pass

    def start_local_server(self):
        """Start local server to receive signals for testing"""
        handler = lambda *args, **kwargs: self.SignalHandler(self, *args, **kwargs)
        self.server = HTTPServer(('localhost', self.local_port), handler)

        print(f"🔧 Local signal collector server started on http://localhost:{self.local_port}")
        print(f"💡 To test locally, send signals to: http://localhost:{self.local_port}")
        print("─" * 60)

        try:
            self.server.serve_forever()
        except KeyboardInterrupt:
            pass

    def monitor_signals(self):
        """Monitor webhook and start local collector"""
        print(f"🔍 Mathematricks Capital Hybrid Signal Collector")
        print(f"🌐 Production Webhook: {self.webhook_url}")
        print(f"🏠 Local Collector: http://localhost:{self.local_port}")
        print("💡 Hybrid mode: Catch-up + Live forwarding via Cloudflare Tunnel")
        print("🔥 Press Ctrl+C to stop monitoring")
        print("=" * 80)

        # PHASE 1: Catch-up mode - fetch any missed signals
        print("\n🔄 PHASE 1: Catch-up Mode")
        if self.mongodb_collection:
            print("📊 Using direct MongoDB connection for faster catch-up")
            self.fetch_missed_signals_from_mongodb()
        else:
            print("🌐 Using API endpoint for catch-up")
            self.fetch_missed_signals()

        # PHASE 2: Live mode - continuous monitoring
        print("\n📡 PHASE 2: Live Mode - Monitoring signals")
        print("💡 Signals are stored in MongoDB and retrieved via catch-up on restart")

        try:
            while True:
                current_time = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")

                # Test webhook availability
                try:
                    response = requests.get(self.webhook_url, timeout=5)
                    webhook_status = "🟢 ONLINE" if response.status_code == 200 else f"🟡 STATUS {response.status_code}"
                except requests.exceptions.RequestException:
                    webhook_status = "🔴 OFFLINE"

                # Test MongoDB connectivity
                mongodb_status = "🟢 CONNECTED" if self.mongodb_collection else "🔴 DISCONNECTED"

                print(f"[{current_time}] 🌐 Webhook: {webhook_status} | 📊 MongoDB: {mongodb_status} | 📋 Local Signals: {len(self.collected_signals)}")
                time.sleep(10)  # Check every 10 seconds

        except KeyboardInterrupt:
            print("\n🛑 Signal monitoring stopped by user")
            self.display_summary()

    def display_summary(self):
        """Display summary of collected signals"""
        print("\n" + "=" * 80)
        print(f"📊 Mathematricks Capital Signal Collection Summary")
        print(f"🌐 Webhook URL: {self.webhook_url}")
        print(f"🔢 Total Signals Collected: {len(self.collected_signals)}")
        print("=" * 80)

        if self.collected_signals:
            print("📋 Signal Details:")
            for signal in self.collected_signals:
                print(f"  #{signal['id']}: {signal['signal'].get('signal', {}).get('ticker', 'N/A')} "
                      f"{signal['signal'].get('signal', {}).get('action', 'N/A')} "
                      f"(Delay: {signal['delay_seconds']:.3f}s)")

            # Calculate average delay
            delays = [s['delay_seconds'] for s in self.collected_signals if s['delay_seconds'] > 0]
            if delays:
                avg_delay = sum(delays) / len(delays)
                print(f"\n⚡ Average Delay: {avg_delay:.3f} seconds")
                print(f"⚡ Min Delay: {min(delays):.3f} seconds")
                print(f"⚡ Max Delay: {max(delays):.3f} seconds")

        print("\n🎯 System Architecture:")
        print("📡 TradingView → Vercel Webhook → Cloudflare Tunnel → Local Collector")
        print("🔄 Catch-up: Fetch missed signals from Vercel storage on startup")
        print("⚡ Live: Receive real-time signals via Cloudflare forwarding")

        print("\n🧪 Test Commands:")
        print("\n# Send signal using Python sender:")
        print('python3 signal_sender.py --ticker AAPL --action BUY --price 150.25')
        print('python3 signal_sender.py --test-suite')

        print("\n# Test Production Webhook (will be stored and forwarded):")
        print(f'curl -X POST {self.webhook_url}/api/webhook \\')
        print('  -H "Content-Type: application/json" \\')
        print('  -d \'{"passphrase": "yahoo123", "timestamp": "'+ datetime.datetime.now().isoformat() +'", "signal": {"ticker": "AAPL", "price": 150.25, "action": "BUY"}}\'')

        print(f"\n# Get stored signals from Vercel:")
        print(f'curl -X GET {self.webhook_url}/api/signals')

        print(f"\n# Test Local Collector Direct (bypass webhook):")
        print(f'curl -X POST http://localhost:{self.local_port} \\')
        print('  -H "Content-Type: application/json" \\')
        print('  -d \'{"passphrase": "yahoo123", "timestamp": "'+ datetime.datetime.now().isoformat() +'", "signal": {"ticker": "TSLA", "price": 245.75, "action": "SELL"}}\'')

        print(f"\n# Test via Cloudflare Tunnel (signals.mathematricks.fund):")
        print(f'curl -X POST https://signals.mathematricks.fund \\')
        print('  -H "Content-Type: application/json" \\')
        print('  -d \'{"passphrase": "test123", "timestamp": "'+ datetime.datetime.now().isoformat() +'", "signal": {"ticker": "BTC", "price": 42000, "action": "BUY"}}\'')
        print("=" * 80)

if __name__ == "__main__":
    webhook_url = "https://api.mathematricks.fund"
    collector = WebhookSignalCollector(webhook_url)

    print("🚀 Starting Mathematricks Capital Webhook Signal Collector")
    print("📡 This script monitors webhook availability and provides test commands")
    print()

    collector.monitor_signals()