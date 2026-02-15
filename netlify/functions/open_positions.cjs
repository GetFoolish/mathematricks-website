/**
 * Open Positions API
 * GET /api/v1/open_positions?strategy_id=xxx
 *
 * Get current open positions for a specific strategy.
 * Returns all active positions from signal_store collection.
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

function createResponse(statusCode, body) {
  return {
    statusCode,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  };
}

exports.handler = async (event, context) => {
  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return createResponse(200, {});
  }

  // Only allow GET requests
  if (event.httpMethod !== 'GET') {
    return createResponse(405, {
      error: 'Method not allowed',
      detail: 'Only GET requests are supported'
    });
  }

  try {
    // Extract strategy_id from query parameters
    const strategyId = event.queryStringParameters?.strategy_id;

    if (!strategyId) {
      return createResponse(400, {
        error: 'Missing strategy_id',
        detail: 'Please provide strategy_id as a query parameter',
        example: '/api/v1/open_positions?strategy_id=my-strategy'
      });
    }

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

    // Query for open positions for this strategy
    // A position is open if:
    // 1. It belongs to the strategy
    // 2. position.status is "OPEN"
    // 3. Has at least one leg with execution.status = "FILLED"
    const openPositions = await signalStoreCollection.find({
      strategy_id: strategyId,
      'position.status': 'OPEN'
    }).toArray();

    // Build summary for each position
    const positions = openPositions.map(doc => {
      const entryLeg = doc.legs?.find(leg => leg.leg_type === 'ENTRY');
      const execution = entryLeg?.execution;
      
      return {
        signal_id: doc.signal_id,
        instrument: doc.instrument,
        strategy_id: doc.strategy_id,
        environment: doc.environment,
        mode: doc.mode,
        account_type: doc.account_type,
        
        // Position details
        position: {
          status: doc.position?.status || 'UNKNOWN',
          entry_quantity: doc.position?.entry_quantity || 0,
          exit_quantity: doc.position?.exit_quantity || 0,
          unrealized_pnl: doc.position?.unrealized_pnl || null
        },
        
        // Entry execution details
        entry: {
          status: execution?.status || 'PENDING',
          quantity_filled: execution?.total_quantity_filled || 0,
          avg_fill_price: execution?.weighted_avg_price || null,
          filled_at: execution?.orders?.[0]?.filled_at || null
        },
        
        // Timestamps
        created_at: doc.created_at,
        updated_at: doc.updated_at
      };
    });

    // Build response
    const response = {
      strategy_id: strategyId,
      total_open_positions: positions.length,
      positions: positions,
      query_time: new Date().toISOString()
    };

    return createResponse(200, response);

  } catch (error) {
    console.error('Error fetching open positions:', error);
    return createResponse(500, {
      error: 'Internal server error',
      detail: error.message,
      strategy_id: event.queryStringParameters?.strategy_id || null
    });
  }
};
