import json
import os
import logging
from datetime import datetime, timezone
from http.server import BaseHTTPRequestHandler
import urllib.parse
import urllib.request
import ssl

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# In-memory storage for signals (Vercel functions are stateless, so this resets)
# In production, you'd use a database. For now, we'll use simple file storage.
SIGNALS_STORAGE = []

def store_signal(signal_data):
    """Store signal with timestamp for temporary storage"""
    stored_signal = {
        'id': len(SIGNALS_STORAGE) + 1,
        'received_at': datetime.now(timezone.utc).isoformat(),
        'signal_data': signal_data
    }
    SIGNALS_STORAGE.append(stored_signal)
    logger.info(f"Stored signal #{stored_signal['id']}")
    return stored_signal

def forward_to_local_collector(signal_data):
    """Forward signal to local collector via Cloudflare tunnel"""
    local_collector_url = os.environ.get('LOCAL_COLLECTOR_URL')

    if not local_collector_url:
        logger.info("No local collector URL configured - skipping forward")
        return False

    try:
        # Prepare forwarding payload
        forward_payload = {
            'source': 'vercel_forwarded',
            'forwarded_at': datetime.now(timezone.utc).isoformat(),
            'original_signal': signal_data
        }

        # Create request
        req = urllib.request.Request(
            local_collector_url,
            data=json.dumps(forward_payload).encode('utf-8'),
            headers={'Content-Type': 'application/json'}
        )

        # Forward with timeout
        with urllib.request.urlopen(req, timeout=5) as response:
            if response.status == 200:
                logger.info(f"Successfully forwarded signal to local collector")
                return True
            else:
                logger.warning(f"Local collector returned status: {response.status}")
                return False

    except Exception as e:
        logger.warning(f"Failed to forward to local collector: {str(e)}")
        return False

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

            # Store signal for temporary storage
            stored_signal = store_signal(request_json)

            # Forward to local collector (if configured and reachable)
            forwarded = forward_to_local_collector(request_json)

            # Log the received signal data
            signal_data = {
                'timestamp': timestamp,
                'ticker': ticker,
                'price': price,
                'action': action,
                'volume_24h': volume_24h,
                'received_at': datetime.now(timezone.utc).isoformat(),
                'stored_id': stored_signal['id'],
                'forwarded_to_local': forwarded
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
        """Handle GET requests for signal management"""
        try:
            # Parse URL path and query parameters
            parsed_url = urllib.parse.urlparse(self.path)
            path = parsed_url.path
            query_params = urllib.parse.parse_qs(parsed_url.query)

            # Route different GET endpoints
            if path == '/api/signals':
                self.handle_get_signals(query_params)
            elif path == '/api/signals/cleanup':
                self.handle_cleanup_signals(query_params)
            else:
                # Default webhook info
                response_data = {
                    'service': 'Mathematricks Capital TradingView Webhook',
                    'status': 'active',
                    'timestamp': datetime.now(timezone.utc).isoformat(),
                    'stored_signals': len(SIGNALS_STORAGE),
                    'endpoints': {
                        'webhook': 'POST /',
                        'get_signals': 'GET /api/signals',
                        'cleanup': 'GET /api/signals/cleanup?before=timestamp'
                    }
                }
                self.send_json_response(200, response_data)
        except Exception as e:
            logger.error(f"Error in GET handler: {str(e)}")
            self.send_error_response(500, f"Internal server error: {str(e)}")

    def handle_get_signals(self, query_params):
        """Handle GET /api/signals - return stored signals"""
        try:
            # Filter by timestamp if provided
            since_timestamp = query_params.get('since', [None])[0]

            filtered_signals = SIGNALS_STORAGE.copy()

            if since_timestamp:
                # Filter signals after the given timestamp
                filtered_signals = [
                    signal for signal in SIGNALS_STORAGE
                    if signal['received_at'] > since_timestamp
                ]

            response_data = {
                'status': 'success',
                'total_signals': len(filtered_signals),
                'signals': filtered_signals,
                'retrieved_at': datetime.now(timezone.utc).isoformat()
            }

            logger.info(f"Returned {len(filtered_signals)} signals")
            self.send_json_response(200, response_data)

        except Exception as e:
            logger.error(f"Error getting signals: {str(e)}")
            self.send_error_response(500, f"Error retrieving signals: {str(e)}")

    def handle_cleanup_signals(self, query_params):
        """Handle GET /api/signals/cleanup - remove old signals"""
        try:
            before_timestamp = query_params.get('before', [None])[0]

            if not before_timestamp:
                self.send_error_response(400, "Missing 'before' timestamp parameter")
                return

            # Remove signals before the given timestamp
            global SIGNALS_STORAGE
            original_count = len(SIGNALS_STORAGE)

            SIGNALS_STORAGE = [
                signal for signal in SIGNALS_STORAGE
                if signal['received_at'] >= before_timestamp
            ]

            removed_count = original_count - len(SIGNALS_STORAGE)

            response_data = {
                'status': 'success',
                'removed_signals': removed_count,
                'remaining_signals': len(SIGNALS_STORAGE),
                'cleaned_at': datetime.now(timezone.utc).isoformat()
            }

            logger.info(f"Cleaned up {removed_count} signals")
            self.send_json_response(200, response_data)

        except Exception as e:
            logger.error(f"Error cleaning signals: {str(e)}")
            self.send_error_response(500, f"Error cleaning signals: {str(e)}")

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