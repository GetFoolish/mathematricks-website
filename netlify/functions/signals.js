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

    return client.db('mathematricks_signals').collection('trading_signals');
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

function handleGet() {
    const responseData = {
        service: 'Mathematricks Fun(d) Signal Receiver',
        status: 'active',
        timestamp: new Date().toISOString()
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

        // Prepare signal document for MongoDB
        const now = new Date();
        const signalDocument = {
            ...requestData,
            received_at: now,
            signal_processed: false
        };

        // Store in MongoDB
        const result = await collection.insertOne(signalDocument);
        console.log('Signal stored in MongoDB:', result.insertedId);

        // Extract signal details for response
        const signal = requestData.signal || {};
        const ticker = signal.ticker || 'UNKNOWN';
        const action = signal.action || 'UNKNOWN';
        const price = signal.price || 'N/A';

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
        return handleGet();
    } else if (httpMethod === 'POST') {
        return await handlePost(event);
    } else {
        return createResponse(405, { error: 'Method not allowed' });
    }
};