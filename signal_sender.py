#!/usr/bin/env python3
"""
Signal Sender for Mathematricks Fund
Sends trading signals to the webhook endpoint
"""

import requests
import time
import uuid
from datetime import datetime, timezone
import argparse

class SignalSender:
    def __init__(self, api_url="https://api.mathematricks.fund/api/signals", passphrase="yahoo123"):
        self.api_url = api_url
        self.passphrase = passphrase
        self.session = requests.Session()
        self.session.headers.update({
            'Content-Type': 'application/json',
            'User-Agent': 'Mathematricks-SignalSender/1.0'
        })

    def send_signal(self, ticker, action, price, volume_24h=0):
        """Send a trading signal to the webhook"""
        now = datetime.now(timezone.utc)
        signal_id = str(uuid.uuid4())[:8]  # Short unique ID
        epoch_time = int(now.timestamp())

        signal_data = {
            "passphrase": self.passphrase,
            "timestamp": now.isoformat(),
            "epoch_time": epoch_time,
            "signal_id": signal_id,
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
            print(f"   URL: {self.api_url}")

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

        except requests.exceptions.Timeout:
            print(f"   ⏰ Timeout: Request took too long")
            return False
        except requests.exceptions.ConnectionError:
            print(f"   🔌 Connection Error: Could not reach webhook")
            return False
        except Exception as e:
            print(f"   💥 Unexpected Error: {str(e)}")
            return False

    def test_invalid_passphrase(self):
        """Test with invalid passphrase (should fail)"""
        print(f"\n🔒 Testing invalid passphrase...")
        old_passphrase = self.passphrase
        self.passphrase = "wrong_password"

        result = self.send_signal("TEST", "BUY", 100.0)

        self.passphrase = old_passphrase
        return not result  # Should return True if it properly failed

    def run_test_suite(self):
        """Run a comprehensive test of the webhook"""
        print("🚀 Starting Mathematricks Webhook Test Suite")
        print("=" * 50)

        tests = [
            ("AAPL", "BUY", 150.25, 50000000),
            ("TSLA", "SELL", 245.75, 75000000),
            ("BTC", "BUY", 42000.0, 1000000),
            ("ETH", "SELL", 2500.0, 800000),
            ("GOOGL", "BUY", 140.50, 25000000)
        ]

        successful = 0
        total = len(tests)

        for i, (ticker, action, price, volume) in enumerate(tests, 1):
            print(f"\n--- Test {i}/{total} ---")
            if self.send_signal(ticker, action, price, volume):
                successful += 1
            time.sleep(1)  # Small delay between requests

        # Test invalid passphrase
        print(f"\n--- Security Test ---")
        if self.test_invalid_passphrase():
            print("   ✅ Security test passed (invalid passphrase rejected)")
        else:
            print("   ❌ Security test failed (invalid passphrase accepted)")

        print(f"\n📊 Results: {successful}/{total} signals sent successfully")
        return successful == total

def main():
    parser = argparse.ArgumentParser(description='Send trading signals to Mathematricks webhook')
    parser.add_argument('--url', default='https://api.mathematricks.fund/api/signals',
                       help='Signals endpoint URL')
    parser.add_argument('--passphrase', default='yahoo123',
                       help='Webhook passphrase')
    parser.add_argument('--ticker', help='Stock ticker (for single signal)')
    parser.add_argument('--action', choices=['BUY', 'SELL'], help='Trading action')
    parser.add_argument('--price', type=float, help='Stock price')
    parser.add_argument('--volume', type=int, default=0, help='24h volume')
    parser.add_argument('--test-suite', action='store_true',
                       help='Run full test suite')

    args = parser.parse_args()

    sender = SignalSender(args.url, args.passphrase)

    if args.test_suite:
        sender.run_test_suite()
    elif args.ticker and args.action and args.price is not None:
        sender.send_signal(args.ticker, args.action, args.price, args.volume)
    else:
        print("Usage examples:")
        print("  python signal_sender.py --test-suite")
        print("  python signal_sender.py --ticker AAPL --action BUY --price 150.25")
        print("  python signal_sender.py --ticker TSLA --action SELL --price 245.75 --volume 50000000")

if __name__ == "__main__":
    main()