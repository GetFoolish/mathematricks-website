import json
import os
import logging
from datetime import datetime
from http.server import BaseHTTPRequestHandler
import urllib.parse

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class handler(BaseHTTPRequestHandler):
    def do_OPTIONS(self):
        """Handle CORS preflight requests"""
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

    def do_POST(self):
        """Handle TradingView webhook POST requests"""
        try:
            # Get content length
            content_length = int(self.headers.get('Content-Length', 0))

            if content_length == 0:
                self.send_error_response(400, 'No request body')
                return

            # Read and parse JSON data
            post_data = self.rfile.read(content_length)

            try:
                request_json = json.loads(post_data.decode('utf-8'))
            except json.JSONDecodeError as e:
                logger.error(f"JSON decode error: {str(e)}")
                self.send_error_response(400, 'Invalid JSON format')
                return

            # Validate passphrase
            received_passphrase = request_json.get('passphrase')
            expected_passphrase = os.environ.get('WEBHOOK_PASSPHRASE')

            if not expected_passphrase:
                logger.error("WEBHOOK_PASSPHRASE environment variable not set")
                self.send_error_response(500, 'Server configuration error')
                return

            if not received_passphrase:
                logger.warning("No passphrase provided in request")
                self.send_error_response(401, 'Missing passphrase')
                return

            if received_passphrase != expected_passphrase:
                logger.warning(f"Invalid passphrase attempt")
                self.send_error_response(401, 'Unauthorized')
                return

            # Parse signal data
            timestamp = request_json.get('timestamp', datetime.utcnow().isoformat())
            signal = request_json.get('signal', {})

            # Extract signal components
            ticker = signal.get('ticker', 'UNKNOWN')
            price = signal.get('price', 0)
            action = signal.get('action', 'UNKNOWN')
            volume_24h = signal.get('volume_24h', 0)

            # Log the received signal data
            signal_data = {
                'timestamp': timestamp,
                'ticker': ticker,
                'price': price,
                'action': action,
                'volume_24h': volume_24h,
                'received_at': datetime.utcnow().isoformat()
            }

            logger.info(f"TradingView Signal Received: {json.dumps(signal_data, indent=2)}")
            print(f"SIGNAL RECEIVED: {json.dumps(signal_data)}")

            # --- TODO: INSERT YOUR BROKER API/TRADING LOGIC HERE ---
            #
            # This is where you would integrate with your broker's API
            # Examples of what you might implement:
            #
            # if action == "BUY":
            #     # Execute buy order through broker API
            #     pass
            # elif action == "SELL":
            #     # Execute sell order through broker API
            #     pass
            #
            # --- END TODO SECTION ---

            # Return success response
            response_data = {
                'status': 'success',
                'message': 'Signal received and processed',
                'timestamp': datetime.utcnow().isoformat(),
                'signal_summary': {
                    'ticker': ticker,
                    'action': action,
                    'price': price
                }
            }

            self.send_json_response(200, response_data)
            logger.info(f"Signal processed successfully: {ticker} - {action} at {price}")

        except Exception as e:
            logger.error(f"Unexpected error processing webhook: {str(e)}")
            self.send_error_response(500, 'Internal server error')

    def do_GET(self):
        """Handle GET requests with webhook info"""
        response_data = {
            'service': 'Mathematricks Capital TradingView Webhook',
            'status': 'active',
            'timestamp': datetime.utcnow().isoformat(),
            'method': 'POST only',
            'endpoints': {
                'webhook': '/webhook',
                'root': '/'
            }
        }
        self.send_json_response(200, response_data)

    def send_json_response(self, status_code, data):
        """Send JSON response with proper headers"""
        self.send_response(status_code)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        self.wfile.write(json.dumps(data).encode('utf-8'))

    def send_error_response(self, status_code, message):
        """Send error response"""
        error_data = {'error': message}
        self.send_json_response(status_code, error_data)

    def log_message(self, format, *args):
        """Override to use our logger"""
        logger.info(format % args)


def validate_signal_data(signal):
    """Validate the structure and content of signal data"""
    required_fields = ['ticker', 'action']

    for field in required_fields:
        if field not in signal:
            return False, f"Missing required field: {field}"

    # Validate action is a known type
    valid_actions = ['BUY', 'SELL', 'CLOSE', 'HOLD']
    if signal['action'] not in valid_actions:
        return False, f"Invalid action: {signal['action']}"

    # Validate price is numeric
    try:
        float(signal.get('price', 0))
    except (ValueError, TypeError):
        return False, "Price must be numeric"

    return True, "Valid"