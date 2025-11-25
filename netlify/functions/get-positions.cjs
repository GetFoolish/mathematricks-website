/**
 * Strategy Developer API - Get Positions
 * GET /api/v1/signal-senders/{strategy_id}/positions
 *
 * Get open positions for a strategy.
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
 * Format a position for API response
 */
function formatPosition(pos) {
  let openedAt = pos.opened_at || '';
  if (openedAt && typeof openedAt.toISOString === 'function') {
    openedAt = openedAt.toISOString();
  } else {
    openedAt = String(openedAt);
  }

  return {
    ticker: pos.instrument || 'UNKNOWN',
    side: pos.direction === 'LONG' ? 'LONG' : 'SHORT',
    quantity: pos.quantity || 0,
    entry_price: pos.avg_price || 0.0,
    current_price: pos.current_price || 0.0,
    unrealized_pnl: pos.unrealized_pnl || 0.0,
    opened_at: openedAt,
  };
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

    // Get strategy_id from query params (set by Netlify redirect)
    const strategyId = params.strategy_id;
    if (!strategyId) {
      return errorResponse(400, 'strategy_id is required');
    }

    // Verify API key matches strategy_id
    if (verifiedStrategy !== strategyId) {
      return errorResponse(403, `Not authorized for strategy ${strategyId}`);
    }

    // Get latest account state
    const accountState = await db
      .collection('account_state')
      .find()
      .sort({ timestamp: -1 })
      .limit(1)
      .toArray();

    if (!accountState || accountState.length === 0) {
      return jsonResponse(200, {
        strategy_id: strategyId,
        count: 0,
        positions: [],
      });
    }

    // Extract positions for this strategy
    const allPositions = accountState[0].open_positions || [];
    const strategyPositions = allPositions.filter((pos) => pos.strategy_id === strategyId);

    // Format positions
    const formattedPositions = strategyPositions.map(formatPosition);

    return jsonResponse(200, {
      strategy_id: strategyId,
      count: formattedPositions.length,
      positions: formattedPositions,
    });
  } catch (err) {
    console.error('Error in get-positions:', err);
    return errorResponse(500, `Internal server error: ${err.message}`);
  }
};
