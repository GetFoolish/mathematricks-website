// Simple Express server to run Netlify functions locally in Docker
const express = require('express');
const cors = require('cors');
const path = require('path');
const { handler: signalsHandler } = require('./netlify/functions/signals.cjs');
const { handler: signalsDocHandler } = require('./netlify/functions/signals_documentation.cjs');
const { handler: signalStatusHandler } = require('./netlify/functions/signal_status.cjs');
const { handler: openPositionsHandler } = require('./netlify/functions/open_positions.cjs');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'ok', service: 'signal-receiver', timestamp: new Date().toISOString() });
});

// Netlify function adapter
function netlifyToExpress(handler) {
    return async (req, res) => {
        const event = {
            httpMethod: req.method,
            headers: req.headers,
            body: JSON.stringify(req.body),
            path: req.path,
            queryStringParameters: req.query
        };

        try {
            const response = await handler(event, {});
            
            // Set headers
            if (response.headers) {
                Object.entries(response.headers).forEach(([key, value]) => {
                    res.setHeader(key, value);
                });
            }

            // Parse body if it's JSON string
            let body = response.body;
            if (typeof body === 'string') {
                try {
                    body = JSON.parse(body);
                } catch (e) {
                    // Not JSON, keep as string
                }
            }

            res.status(response.statusCode).send(body);
        } catch (error) {
            console.error('Error in Netlify function:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    };
}

// Mount signal endpoints
app.all('/api/v1/signals', netlifyToExpress(signalsHandler));
app.all('/api/v1/signals/documentation', netlifyToExpress(signalsDocHandler));
app.all('/api/v1/signal_status', netlifyToExpress(signalStatusHandler));
app.all('/api/v1/open_positions', netlifyToExpress(openPositionsHandler));

// Serve static files from Vite build
app.use(express.static(path.join(__dirname, 'dist')));

// Serve index.html for all other routes (SPA fallback)
app.use((req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
    console.log(`✅ Signal Receiver API running on port ${PORT}`);
    console.log(`🌐 Website: http://localhost:${PORT}`);
    console.log(`📡 POST signals to: http://localhost:${PORT}/api/v1/signals`);
    console.log(`📖 Documentation: http://localhost:${PORT}/api/v1/signals/documentation`);
    console.log(`📊 Signal Status: http://localhost:${PORT}/api/v1/signal_status?signal_id=xxx`);
    console.log(`📈 Open Positions: http://localhost:${PORT}/api/v1/open_positions?strategy_id=xxx`);
});
