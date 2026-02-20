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

    // DEBUG: Log document structure
    console.log('signal_legs exists:', 'signal_legs' in signalDoc);
    console.log('signal_legs type:', typeof signalDoc.signal_legs);
    console.log('signal_legs length:', signalDoc.signal_legs?.length);
    console.log('signal_status exists:', 'signal_status' in signalDoc);
    
    // Aggregate statuses across ALL legs (not just first leg)
    function aggregateLegStatuses(legs) {
      if (!legs || legs.length === 0) {
        console.log('⚠️  No legs found in signal');
        return { cerebro: 'PENDING', execution: 'PENDING', totalFilled: 0 };
      }
      
      console.log(`📊 Aggregating status across ${legs.length} legs`);
      
      // Check cerebro: all APPROVED → "APPROVED", any REJECTED → "REJECTED", else "PENDING"
      const cerebroStatuses = legs.map(leg => leg.cerebro?.status).filter(Boolean);
      let cerebroStatus = 'PENDING';
      if (cerebroStatuses.length > 0) {
        if (cerebroStatuses.every(s => s === 'APPROVED')) cerebroStatus = 'APPROVED';
        else if (cerebroStatuses.some(s => s === 'REJECTED')) cerebroStatus = 'REJECTED';
        console.log(`🧠 Cerebro statuses: [${cerebroStatuses.join(', ')}] → ${cerebroStatus}`);
      }
      
      // Check execution: all Filled → "FILLED", any failed → "FAILED", else "PENDING"  
      const execStatuses = legs.map(leg => leg.execution?.status).filter(Boolean);
      let execStatus = 'PENDING';
      if (execStatuses.length > 0) {
        if (execStatuses.every(s => s === 'Filled' || s === 'FILLED')) execStatus = 'FILLED';
        else if (execStatuses.some(s => s && (s.toLowerCase().includes('reject') || s.toLowerCase().includes('fail')))) execStatus = 'FAILED';
        console.log(`⚡ Execution statuses: [${execStatuses.join(', ')}] → ${execStatus}`);
      }
      
      // Sum total filled quantity across all legs
      const totalFilled = legs.reduce((sum, leg) => sum + (leg.execution?.total_quantity_filled || 0), 0);
      
      return { cerebro: cerebroStatus, execution: execStatus, totalFilled };
    }
    
    // Aggregate across all legs
    const aggregated = aggregateLegStatuses(signalDoc.signal_legs);
    
    // Use root-level signal_status for position info (already aggregated by system)
    const positionStatus = signalDoc.signal_status?.status || 'PENDING';
    console.log(`📊 Position status: ${positionStatus}`);
    
    const statusSummary = {
      signal_id: signalDoc.signal_id,
      strategy_id: signalDoc.strategy_id,
      environment: signalDoc.environment,
      mode: signalDoc.mode,
      instrument: signalDoc.instrument,
      
      // Aggregated cerebro status across all legs
      cerebro_status: aggregated.cerebro,
      
      // Aggregated execution status across all legs
      execution_status: aggregated.execution,
      
      // Position status from root-level signal_status (already aggregated)
      position_status: positionStatus,
      
      // Quantities from root-level signal_status
      entry_quantity: signalDoc.signal_status?.entry_quantity || 0,
      exit_quantity: signalDoc.signal_status?.exit_quantity || 0,
      remaining_quantity: signalDoc.signal_status?.remaining_quantity || 0,
      total_quantity_filled: aggregated.totalFilled,
      
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
