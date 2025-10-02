import json
import os
import logging
from datetime import datetime, timezone
from pymongo import MongoClient
from pymongo.errors import PyMongoError
from pydantic import BaseModel, ValidationError
from typing import Optional, Any

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Pydantic model for signal validation
class SignalRequest(BaseModel):
    strategy_name: str  # Required
    signal_sent_EPOCH: int  # Required
    signalID: str  # Required

    # Optional fields - anything else is allowed
    passphrase: Optional[str] = None
    timestamp: Optional[str] = None
    signal: Optional[Any] = None

    class Config:
        extra = "allow"  # Allow additional fields not defined in the model

# MongoDB connection functions
def get_mongodb_client():
    """Get MongoDB client connection"""
    connection_string = os.environ.get('mongodbconnectionstring')
    if not connection_string:
        logger.error("mongodbconnectionstring environment variable not set")
        return None

    try:
        # Add SSL options for compatibility
        client = MongoClient(
            connection_string,
            tls=True,
            tlsAllowInvalidCertificates=True
        )
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
    if collection is None:
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

def create_response(status_code, body, headers=None):
    """Create Netlify Function response"""
    default_headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
    }

    if headers:
        default_headers.update(headers)

    return {
        'statusCode': status_code,
        'headers': default_headers,
        'body': json.dumps(body)
    }

def handle_options():
    """Handle CORS preflight requests"""
    return create_response(200, {'message': 'CORS preflight'})

def handle_get():
    """Handle GET requests - return basic service info"""
    try:
        response_data = {
            'service': 'Mathematricks Fund Signal Receiver',
            'status': 'active',
            'timestamp': datetime.now(timezone.utc).isoformat()
        }
        return create_response(200, response_data)
    except Exception as e:
        logger.error(f"Error in GET handler: {str(e)}")
        return create_response(500, {'error': f"Internal server error: {str(e)}"})

def handle_post(event):
    """Handle POST requests - process trading signals"""
    try:
        # Parse request body
        if not event.get('body'):
            return create_response(400, {'error': 'No request body'})

        try:
            request_json = json.loads(event['body'])
        except json.JSONDecodeError as e:
            logger.error(f"JSON decode error: {str(e)}")
            return create_response(400, {'error': 'Invalid JSON format'})

        # Validate required fields with Pydantic
        try:
            validated_signal = SignalRequest(**request_json)
        except ValidationError as e:
            logger.error(f"Validation error: {str(e)}")
            return create_response(400, {'error': f'Invalid request format: {str(e)}'})

        # Validate passphrase
        received_passphrase = request_json.get('passphrase')
        expected_passphrase = os.environ.get('WEBHOOK_PASSPHRASE')

        if not expected_passphrase:
            logger.error("WEBHOOK_PASSPHRASE environment variable not set")
            return create_response(500, {'error': 'Server configuration error'})

        if not received_passphrase:
            logger.warning("No passphrase provided in request")
            return create_response(401, {'error': 'Missing passphrase'})

        if received_passphrase != expected_passphrase:
            logger.warning(f"Invalid passphrase attempt")
            return create_response(401, {'error': 'Unauthorized'})

        # Parse signal data
        timestamp = request_json.get('timestamp', datetime.utcnow().isoformat())
        signal = request_json.get('signal', {})

        # Extract signal components
        ticker = signal.get('ticker', 'UNKNOWN')
        price = signal.get('price', 0)
        action = signal.get('action', 'UNKNOWN')
        volume_24h = signal.get('volume_24h', 0)

        # Store signal in MongoDB
        stored_signal = store_signal(request_json)

        # Log the received signal data
        signal_data = {
            'timestamp': timestamp,
            'ticker': ticker,
            'price': price,
            'action': action,
            'volume_24h': volume_24h,
            'received_at': datetime.now(timezone.utc).isoformat(),
            'stored_id': stored_signal.get('_id', 'unknown') if stored_signal else 'failed'
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

        logger.info(f"Signal processed successfully: {ticker} - {action} at {price}")
        return create_response(200, response_data)

    except Exception as e:
        logger.error(f"Unexpected error processing webhook: {str(e)}")
        return create_response(500, {'error': 'Internal server error'})

def handler(event, context):
    """Main Netlify Function handler"""
    # Get HTTP method
    http_method = event.get('httpMethod', 'GET')

    # Route based on HTTP method
    if http_method == 'OPTIONS':
        return handle_options()
    elif http_method == 'GET':
        return handle_get()
    elif http_method == 'POST':
        return handle_post(event)
    else:
        return create_response(405, {'error': 'Method not allowed'})