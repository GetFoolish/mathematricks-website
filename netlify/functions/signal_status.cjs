/**
 * Signal Status API
 * GET /api/v1/signal_status?signal_id=xxx
 *
 * Get the full status of a signal by its signal_id.
 * Returns raw signal, cerebro decision, and execution results.
 */
const { MongoClient } = require('mongodb');

let cachedClient = null;

/**
 * Get MongoDB client (with connection caching)
 */
async function getMongoClient() {
  if (cachedClient) {
    return cachedClient;
  }

  const connectionString = process.env.mongodbconnectionstring || process.env.MONGODB_URI;
  if (!connectionString) {
    console.error('MongoDB connection string not set');
    return null;
  }

  try {
    // Detect if local MongoDB (no TLS) or Atlas (TLS required)
    const isLocal = connectionString.includes('localhost') || 
                    connectionString.includes('127.0.0.1') || 
                    connectionString.includes('mongodb://mongodb:');
    
    const clientOptions = isLocal ? {} : {
      tls: true,
      tlsAllowInvalidCertificates: true
    };

    const client = new MongoClient(connectionString, clientOptions);
    await client.connect();

    // Test connection
    await client.db('admin').command({ ping: 1 });

    cachedClient = client;
    console.log(`✅ Connected to MongoDB (${isLocal ? 'local' : 'Atlas'})`);
    return client;
  } catch (error) {
    console.error('MongoDB connection failed:', error);
    return null;
  }
}

/**
 * Create JSON response
 */
function createResponse(statusCode, body, headers = {}) {
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      ...headers
    },
    body: JSON.stringify(body, null, 2)
  };
}

/**
 * Handle OPTIONS request (CORS preflight)
 */
function handleOptions() {
  return createResponse(200, {});
}

/**
 * Handle GET request
 */
async function handleGet(event) {
  const params = event.queryStringParameters || {};
  const signalId = params.signal_id;

  if (!signalId) {
    return createResponse(400, {
      error: 'Missing parameter',
      detail: 'signal_id query parameter is required',
      usage: 'GET /api/v1/signal_status?signal_id=your_signal_id'
    });
  }

  console.log(`📊 Fetching status for signal_id: ${signalId}`);

  try {
    // Connect to MongoDB
    const client = await getMongoClient();
    if (!client) {
      return createResponse(500, {
        error: 'Database connection failed',
        detail: 'Could not connect to MongoDB'
      });
    }

    const db = client.db('mathematricks_trading');
    const signalStoreCollection = db.collection('signal_store');

    // Find signal by signal_id
    const signalDoc = await signalStoreCollection.findOne(
      { signal_id: signalId }
    );

    if (!signalDoc) {
      return createResponse(404, {
        error: 'Signal not found',
        detail: `No signal found with signal_id: ${signalId}`,
        signal_id: signalId
      });
    }

    console.log(`✅ Found signal: ${signalId}`);

    // Extract key status information
    const firstLeg = signalDoc.legs && signalDoc.legs[0];
    const statusSummary = {
      signal_id: signalDoc.signal_id,
      strategy_id: signalDoc.strategy_id,
      environment: signalDoc.environment,
      mode: signalDoc.mode,
      instrument: signalDoc.instrument,
      
      // Cerebro decision
      cerebro_status: firstLeg?.decision?.status || 'PENDING',
      cerebro_reason: firstLeg?.decision?.reason || null,
      cerebro_timestamp: firstLeg?.decision?.timestamp || null,
      
      // Execution status
      execution_status: firstLeg?.execution?.status || 'PENDING',
      execution_error: firstLeg?.execution?.error_reason || null,
      total_quantity_filled: firstLeg?.execution?.total_quantity_filled || 0,
      weighted_avg_price: firstLeg?.execution?.weighted_avg_price || null,
      
      // Position status
      position_status: signalDoc.position?.status || 'PENDING',
      
      // Timestamps
      created_at: signalDoc.created_at,
      updated_at: signalDoc.updated_at,
      processing_complete: signalDoc.processing_complete || false
    };

    // Return both summary and full document
    return createResponse(200, {
      summary: statusSummary,
      full_document: signalDoc
    });

  } catch (error) {
    console.error('Error fetching signal status:', error);
    return createResponse(500, {
      error: 'Internal server error',
      detail: error.message
    });
  }
}

/**
 * Main Netlify Function handler
 */
exports.handler = async (event, context) => {
  const httpMethod = event.httpMethod || 'GET';

  console.log(`${httpMethod} request to signal_status endpoint`);

  // Route based on HTTP method
  if (httpMethod === 'OPTIONS') {
    return handleOptions();
  } else if (httpMethod === 'GET') {
    return await handleGet(event);
  } else {
    return createResponse(405, {
      error: 'Method not allowed',
      detail: 'Only GET requests are supported'
    });
  }
};
