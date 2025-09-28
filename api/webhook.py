import json
import os
import logging
from datetime import datetime, timezone
from http.server import BaseHTTPRequestHandler
import urllib.parse
import urllib.request
import ssl
from pymongo import MongoClient
from pymongo.errors import PyMongoError

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# MongoDB connection functions
def get_mongodb_client():
    """Get MongoDB client connection"""
    connection_string = os.environ.get('mongodbconnectionstring')
    if not connection_string:
        logger.error("mongodbconnectionstring environment variable not set")
        return None

    try:
        client = MongoClient(connection_string)
        # Test connection
        client.admin.command('ping')
        return client
    except PyMongoError as e:
        logger.error(f"MongoDB connection failed: {e}")
        return None

def get_signals_collection():
    """Get MongoDB signals collection"""
    client = get_mongodb_client()
    if not client:
        return None

    db = client['mathematricks_signals']
    return db['trading_signals']

def store_signal(signal_data):
    """Store signal in MongoDB"""
    collection = get_signals_collection()
    if not collection:
        logger.error("Cannot store signal - MongoDB connection failed")
        return None

    try:
        # Enhanced signal document with better structure
        signal_document = {
            'signal_id': signal_data.get('signal_id', 'unknown'),
            'received_at': datetime.now(timezone.utc),
            'epoch_time': signal_data.get('epoch_time'),
            'timestamp': signal_data.get('timestamp'),
            'source': 'tradingview',
            'signal_data': {
                'ticker': signal_data.get('signal', {}).get('ticker'),
                'action': signal_data.get('signal', {}).get('action'),
                'price': signal_data.get('signal', {}).get('price'),
                'volume_24h': signal_data.get('signal', {}).get('volume_24h', 0)
            },
            'metadata': {
                'passphrase_provided': bool(signal_data.get('passphrase')),
                'raw_payload': signal_data
            }
        }

        # Insert into MongoDB
        result = collection.insert_one(signal_document)
        signal_document['_id'] = str(result.inserted_id)

        logger.info(f"Stored signal in MongoDB: {signal_document['signal_id']}")
        return signal_document

    except PyMongoError as e:
        logger.error(f"Failed to store signal in MongoDB: {e}")
        return None

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
                # Get signal count from MongoDB
                collection = get_signals_collection()
                signal_count = 0
                if collection:
                    try:
                        signal_count = collection.count_documents({})
                    except PyMongoError:
                        signal_count = "unavailable"

                response_data = {
                    'service': 'Mathematricks Capital TradingView Webhook',
                    'status': 'active',
                    'timestamp': datetime.now(timezone.utc).isoformat(),
                    'stored_signals': signal_count,
                    'database': 'MongoDB Atlas',
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
        """Handle GET /api/signals - return stored signals from MongoDB"""
        try:
            collection = get_signals_collection()
            if not collection:
                self.send_error_response(500, "Database connection failed")
                return

            # Build query filter
            query_filter = {}
            since_timestamp = query_params.get('since', [None])[0]

            if since_timestamp:
                try:
                    # Parse timestamp and filter
                    from dateutil import parser
                    since_dt = parser.parse(since_timestamp)
                    query_filter['received_at'] = {'$gt': since_dt}
                except Exception as e:
                    logger.warning(f"Invalid timestamp format: {since_timestamp}")

            # Query MongoDB with sorting (newest first)
            signals_cursor = collection.find(query_filter).sort('received_at', -1).limit(100)
            signals_list = []

            for signal in signals_cursor:
                # Convert ObjectId to string and format for API response
                signal_formatted = {
                    'id': str(signal['_id']),
                    'signal_id': signal.get('signal_id'),
                    'received_at': signal['received_at'].isoformat(),
                    'epoch_time': signal.get('epoch_time'),
                    'signal_data': signal.get('signal_data', {}),
                    'source': signal.get('source', 'unknown')
                }
                signals_list.append(signal_formatted)

            response_data = {
                'status': 'success',
                'total_signals': len(signals_list),
                'signals': signals_list,
                'retrieved_at': datetime.now(timezone.utc).isoformat(),
                'database': 'MongoDB Atlas'
            }

            logger.info(f"Returned {len(signals_list)} signals from MongoDB")
            self.send_json_response(200, response_data)

        except PyMongoError as e:
            logger.error(f"MongoDB error getting signals: {str(e)}")
            self.send_error_response(500, f"Database error: {str(e)}")
        except Exception as e:
            logger.error(f"Error getting signals: {str(e)}")
            self.send_error_response(500, f"Error retrieving signals: {str(e)}")

    def handle_cleanup_signals(self, query_params):
        """Handle GET /api/signals/cleanup - remove old signals from MongoDB"""
        try:
            collection = get_signals_collection()
            if not collection:
                self.send_error_response(500, "Database connection failed")
                return

            before_timestamp = query_params.get('before', [None])[0]

            if not before_timestamp:
                self.send_error_response(400, "Missing 'before' timestamp parameter")
                return

            # Parse timestamp
            try:
                from dateutil import parser
                before_dt = parser.parse(before_timestamp)
            except Exception as e:
                self.send_error_response(400, f"Invalid timestamp format: {before_timestamp}")
                return

            # Get count before deletion
            original_count = collection.count_documents({})

            # Remove signals before the given timestamp
            delete_result = collection.delete_many({'received_at': {'$lt': before_dt}})
            removed_count = delete_result.deleted_count

            # Get count after deletion
            remaining_count = collection.count_documents({})

            response_data = {
                'status': 'success',
                'removed_signals': removed_count,
                'remaining_signals': remaining_count,
                'cleaned_at': datetime.now(timezone.utc).isoformat(),
                'database': 'MongoDB Atlas'
            }

            logger.info(f"Cleaned up {removed_count} signals from MongoDB")
            self.send_json_response(200, response_data)

        except PyMongoError as e:
            logger.error(f"MongoDB error cleaning signals: {str(e)}")
            self.send_error_response(500, f"Database error: {str(e)}")
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