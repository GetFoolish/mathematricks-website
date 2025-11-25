/**
 * Strategy Developer API - Get Signals
 * GET /api/v1/signal-senders/{strategy_id}/signals
 *
 * List signals for a strategy with optional filtering.
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
  // Handle case-insensitive header lookup
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
 * Format signal document for API response
 */
function formatSignal(doc) {
  // Return full document as-is
  return doc;
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

    // Get MongoDB client
    const client = await getMongoClient();
    const db = client.db('mathematricks_trading');

    // Verify API key
    const { strategyId: verifiedStrategy, error: authError } = await verifyApiKey(headers, db);
    if (authError) {
      return authError;
    }

    // Get strategy_id from query params OR parse from path
    let strategyId = params.strategy_id;
    if (!strategyId) {
      // Extract from path: /api/v1/signal-senders/{strategy_id}/signals
      const pathMatch = event.path.match(/\/api\/v1\/signal-senders\/([^/]+)\/signals/);
      if (pathMatch) {
        strategyId = pathMatch[1];
      }
    }

    if (!strategyId) {
      return errorResponse(400, 'strategy_id is required');
    }

    // Verify API key matches strategy_id
    if (verifiedStrategy !== strategyId) {
      return errorResponse(403, `Not authorized for strategy ${strategyId}`);
    }

    // Parse query parameters
    let limit = parseInt(params.limit || '50', 10);
    if (isNaN(limit) || limit < 1 || limit > 500) {
      return errorResponse(400, 'limit must be between 1 and 500');
    }

    const status = params.status;

    // Build query
    const query = {
      'signal_data.strategy_name': strategyId,
      'cerebro_decision': { $ne: null },
    };

    if (status) {
      if (status === 'EXECUTED') {
        query['cerebro_decision.decision'] = 'APPROVED';
      } else if (status === 'REJECTED') {
        query['cerebro_decision.decision'] = { $ne: 'APPROVED' };
      } else {
        return errorResponse(400, 'status must be EXECUTED or REJECTED');
      }
    }

    // Query signals
    const signalDocs = await db
      .collection('signal_store')
      .find(query)
      .sort({ received_at: -1 })
      .limit(limit)
      .toArray();

    // Format signals (remove _id fields)
    const signals = signalDocs.map(formatSignal);

    return jsonResponse(200, {
      strategy_id: strategyId,
      count: signals.length,
      signals,
    });
  } catch (err) {
    console.error('Error in get-signals:', err);
    return errorResponse(500, `Internal server error: ${err.message}`);
  }
};
