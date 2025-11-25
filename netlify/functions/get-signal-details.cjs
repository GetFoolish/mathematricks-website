/**
 * Strategy Developer API - Get Signal Details
 * GET /api/v1/signal-senders/{strategy_id}/signals/{signal_id}
 *
 * Get detailed information about a specific signal.
 */
const { MongoClient, ObjectId } = require('mongodb');

let cachedClient = null;

/**
 * Get MongoDB client (with connection caching)
 */
async function getMongoClient() {
  if (cachedClient) {
    return cachedClient;
  }

  const uri = process.env.MONGODB_URI || process.env.mongodbconnectionstring;
  if (!uri) {
    throw new Error('MongoDB URI not configured');
  }

  cachedClient = new MongoClient(uri, {
    tls: true,
    tlsAllowInvalidCertificates: true,
  });

  await cachedClient.connect();
  return cachedClient;
}

/**
 * Create JSON response
 */
function jsonResponse(statusCode, body) {
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type, X-API-Key',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
    },
    body: JSON.stringify(body),
  };
}

/**
 * Create error response
 */
function errorResponse(statusCode, detail) {
  return jsonResponse(statusCode, { detail });
}

/**
 * Verify API key and return strategy_id
 */
async function verifyApiKey(headers, db) {
  const apiKey = headers['x-api-key'] || headers['X-API-Key'] || headers['X-Api-Key'];

  if (!apiKey) {
    return { error: errorResponse(401, 'API key required (X-API-Key header)') };
  }

  const strategy = await db.collection('strategies').findOne({ api_key: apiKey });

  if (!strategy) {
    return { error: errorResponse(401, 'Invalid API key') };
  }

  return { strategyId: strategy.strategy_id };
}

/**
 * Netlify function handler
 */
exports.handler = async (event, context) => {
  // Handle OPTIONS request (CORS preflight)
  if (event.httpMethod === 'OPTIONS') {
    return jsonResponse(200, {});
  }

  try {
    const headers = event.headers || {};
    const params = event.queryStringParameters || {};

    // Debug logging
    console.log('Event path:', event.path);
    console.log('Query parameters:', JSON.stringify(params));

    // Get MongoDB client
    const client = await getMongoClient();
    const db = client.db('mathematricks_trading');

    // Verify API key
    const { strategyId: verifiedStrategy, error: authError } = await verifyApiKey(headers, db);
    if (authError) {
      return authError;
    }

    // Get parameters from query (set by Netlify redirect)
    const strategyId = params.strategy_id;
    const signalId = params.signal_id;

    if (!strategyId) {
      return errorResponse(400, 'strategy_id is required');
    }
    if (!signalId) {
      return errorResponse(400, 'signal_id is required');
    }

    // Verify API key matches strategy_id
    if (verifiedStrategy !== strategyId) {
      return errorResponse(403, `Not authorized for strategy ${strategyId}`);
    }

    // Get signal from signal_store
    const signalDoc = await db.collection('signal_store').findOne({ signal_id: signalId });

    if (!signalDoc) {
      return errorResponse(404, 'Signal not found');
    }

    // Verify signal belongs to this strategy
    if (signalDoc.strategy_id !== strategyId) {
      return errorResponse(403, 'Signal does not belong to this strategy');
    }

    // Return full document as-is
    return jsonResponse(200, signalDoc);
  } catch (err) {
    console.error('Error in get-signal-details:', err);
    return errorResponse(500, `Internal server error: ${err.message}`);
  }
};
