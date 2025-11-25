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
        const client = new MongoClient(connectionString, {
            tls: true,
            tlsAllowInvalidCertificates: true
        });
        await client.connect();

        // Test connection
        await client.db('admin').command({ ping: 1 });

        cachedClient = client;
        console.log('✅ Connected to MongoDB Atlas');
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
        const isStaging = host.includes('staging');
        const environment = isStaging ? 'staging' : 'production';

        // Normalize signal_legs → signal for MongoDB (signal_ingestion expects 'signal' field)
        const normalizedData = { ...requestData };
        if (normalizedData.signal_legs && !normalizedData.signal) {
            normalizedData.signal = normalizedData.signal_legs;
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

        // TODO: INSERT YOUR BROKER API/TRADING LOGIC HERE
        // Example:
        // if (action === "BUY") {
        //     // Execute buy order through broker API
        // } else if (action === "SELL") {
        //     // Execute sell order through broker API
        // }

        // Return success response
        const responseData = {
            status: 'success',
            message: 'Signal received and processed',
            timestamp: now.toISOString(),
            signal_summary: {
                ticker,
                action,
                price
            }
        };

        console.log(`Signal processed successfully: ${ticker} - ${action} at ${price}`);
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