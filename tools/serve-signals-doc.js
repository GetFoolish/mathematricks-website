const http = require('http');

// Import the Netlify function
const { handler } = require('../netlify/functions/signals_documentation.js');

const PORT = 5000;

const server = http.createServer(async (req, res) => {
    // Mock Netlify event and context
    const event = {
        httpMethod: 'GET',
        path: req.url,
        headers: {},
        body: null
    };
    
    const context = {};
    
    try {
        const response = await handler(event, context);
        
        res.writeHead(response.statusCode, response.headers);
        res.end(response.body);
    } catch (error) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Internal Server Error: ' + error.message);
    }
});

server.listen(PORT, () => {
    console.log(`Signals API Documentation serving at http://localhost:${PORT}`);
});
