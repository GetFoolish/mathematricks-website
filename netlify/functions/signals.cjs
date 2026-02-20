const { MongoClient } = require('mongodb');

// MongoDB connection functions
let cachedClient = null;

async function getMongoClient() {
    if (cachedClient) {
        return cachedClient;
    }

    const connectionString = process.env.mongodbconnectionstring;
    if (!connectionString) {
        console.error('mongodbconnectionstring environment variable not set');
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

async function getSignalsCollection() {
    const client = await getMongoClient();
    if (!client) return null;

    return client.db('mathematricks_trading').collection('trading_signals_raw');
}

async function getSignalStoreCollection() {
    const client = await getMongoClient();
    if (!client) return null;

    return client.db('mathematricks_trading').collection('signal_store');
}

// Poll signal_store for processed signal (wait for signal-ingestion to create it)
async function waitForSignalProcessing(signalID, maxWaitMs = 5000) {
    const signalStoreCollection = await getSignalStoreCollection();
    if (!signalStoreCollection) {
        return { status: 'error', reason: 'Could not connect to signal_store collection' };
    }

    const startTime = Date.now();
    const pollInterval = 200; // Poll every 200ms

    while (Date.now() - startTime < maxWaitMs) {
        // Check if signal_store document exists
        const signalStoreDoc = await signalStoreCollection.findOne(
            { signal_id: signalID },
            { projection: { _id: 1, signal_id: 1, 'legs.decision.status': 1 } }
        );

        if (signalStoreDoc) {
            // Signal was processed - check if approved or rejected
            const firstLeg = signalStoreDoc.legs && signalStoreDoc.legs[0];
            const decisionStatus = firstLeg?.decision?.status;

            return {
                status: decisionStatus === 'REJECTED' ? 'rejected' : 'approved',
                signal_store_id: signalStoreDoc._id.toString(),
                signal_id: signalStoreDoc.signal_id,
                decision_status: decisionStatus,
                reason: firstLeg?.decision?.reason || 'Signal processed'
            };
        }

        // Wait before polling again
        await new Promise(resolve => setTimeout(resolve, pollInterval));
    }

    // Timeout - signal not processed
    return {
        status: 'timeout',
        signal_id: signalID,
        reason: `Signal not processed by signal-ingestion within ${maxWaitMs}ms`
    };
}

// Validation function
function validateSignalRequest(data) {
    const required = ['strategy_name', 'signal_sent_EPOCH', 'signalID'];
    const missing = required.filter(field => !data[field]);

    if (missing.length > 0) {
        return { valid: false, error: `Missing required fields: ${missing.join(', ')}` };
    }

    return { valid: true };
}

// Response helper
function createResponse(statusCode, body, headers = {}) {
    return {
        statusCode,
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
            ...headers
        },
        body: JSON.stringify(body)
    };
}

// Handler functions
function handleOptions() {
    return createResponse(200, { message: 'CORS preflight' });
}

function handleGet(event) {
    // Determine environment from host
    const host = event.headers?.host || event.headers?.Host || 'unknown';
    const isLocalhost = host.includes('localhost') || host.includes('127.0.0.1');
    const isStaging = host.includes('staging');

    let environment;
    if (isLocalhost) {
        environment = 'local';
    } else if (isStaging) {
        environment = 'staging';
    } else {
        environment = 'main';
    }

    const responseData = {
        service: 'Mathematricks Fun(d) Signal Receiver',
        status: 'active',
        timestamp: new Date().toISOString(),
        environment: environment
    };

    console.log('API status check - service active');
    return createResponse(200, responseData);
}

async function handlePost(event) {
    try {
        const collection = await getSignalsCollection();
        if (!collection) {
            console.error('Failed to connect to MongoDB');
            return createResponse(500, { error: 'Database connection failed' });
        }

        // Parse request body
        let requestData;
        try {
            requestData = JSON.parse(event.body);
        } catch (error) {
            console.error('Invalid JSON in request body');
            return createResponse(400, { error: 'Invalid JSON format' });
        }

        // Validate required fields
        const validation = validateSignalRequest(requestData);
        if (!validation.valid) {
            console.error('Validation failed:', validation.error);
            return createResponse(400, { error: validation.error });
        }

        // Check passphrase - support multiple valid passphrases
        const passphrase = requestData.passphrase;

        // Get valid passphrases from environment (comma-separated)
        const validPassphrases = (process.env.WEBHOOK_PASSPHRASES || process.env.WEBHOOK_PASSPHRASE || 'yahoo123')
            .split(',')
            .map(p => p.trim());

        if (!validPassphrases.includes(passphrase)) {
            console.error('Invalid passphrase provided');
            return createResponse(401, { error: 'Unauthorized: Invalid passphrase' });
        }

        // Determine which endpoint was used
        const host = event.headers?.host || event.headers?.Host || 'unknown';
        const isLocalhost = host.includes('localhost') || host.includes('127.0.0.1');
        const isStaging = host.includes('staging') || isLocalhost;
        const environment = isStaging ? 'staging' : 'production';

        // Keep signal_legs as-is (no transformation needed)
        const normalizedData = { ...requestData };

        // Remove legacy "signal" field - only keep "signal_legs"
        if (normalizedData.signal) {
            console.log('Removing legacy "signal" field (keeping signal_legs only)');
            delete normalizedData.signal;
        }

        // Prepare signal document for MongoDB
        const now = new Date();
        const signalDocument = {
            ...normalizedData,
            received_at: now,
            signal_processed: false,
            api_endpoint: host,
            environment: environment
        };

        // Log what we're storing
        console.log('Signal document fields:', Object.keys(signalDocument).join(', '));
        console.log('environment:', signalDocument.environment);
        console.log('data_source:', signalDocument.data_source);
        console.log('mode:', signalDocument.mode);

        // Store in MongoDB
        const result = await collection.insertOne(signalDocument);
        console.log('Signal stored in MongoDB:', result.insertedId);

        // Extract signal details for response
        // Handle both signal_legs (new) and signal (legacy)
        const signalData = requestData.signal_legs || requestData.signal || {};

        // Handle signal as array (new format) or dict (legacy)
        const signalLeg = Array.isArray(signalData) ? (signalData[0] || {}) : signalData;

        // Support both instrument (new) and ticker (legacy)
        const ticker = signalLeg.instrument || signalLeg.ticker || 'UNKNOWN';
        const action = signalLeg.action || 'UNKNOWN';
        const price = signalLeg.price || 'N/A';

        console.log(`Signal received: ${ticker} - ${action} at ${price}`);

        // Wait for signal-ingestion to process the signal and create signal_store document
        // Support both signalID (test runner) and signal_id (standard)
        const signalID = requestData.signalID || requestData.signal_id;
        console.log(`Waiting for signal-ingestion to process signal_id: ${signalID}...`);
        const processingResult = await waitForSignalProcessing(signalID, 5000);

        console.log(`Signal processing result:`, processingResult);

        // Return response based on processing result
        const responseData = {
            ...processingResult,
            timestamp: now.toISOString(),
            signal_summary: {
                ticker,
                action,
                price
            }
        };

        // Log appropriate message
        if (processingResult.status === 'approved') {
            console.log(`Signal approved: ${ticker} - ${action} at ${price} (signal_store_id: ${processingResult.signal_store_id})`);
        } else if (processingResult.status === 'rejected') {
            console.log(`Signal rejected: ${ticker} - ${action} - ${processingResult.reason}`);
        } else if (processingResult.status === 'timeout') {
            console.log(`Signal timeout: ${ticker} - ${action} - ${processingResult.reason}`);
        }

        return createResponse(200, responseData);

    } catch (error) {
        console.error('Unexpected error processing webhook:', error);
        return createResponse(500, { error: 'Internal server error' });
    }
}

// Main Netlify Function handler
exports.handler = async (event, context) => {
    const httpMethod = event.httpMethod || 'GET';

    console.log(`${httpMethod} request to signals endpoint`);

    // Route based on HTTP method
    if (httpMethod === 'OPTIONS') {
        return handleOptions();
    } else if (httpMethod === 'GET') {
        return handleGet(event);
    } else if (httpMethod === 'POST') {
        return await handlePost(event);
    } else {
        return createResponse(405, { error: 'Method not allowed' });
    }
};