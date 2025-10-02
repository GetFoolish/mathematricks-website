// Response helper
function createResponse(statusCode, body, headers = {}) {
    return {
        statusCode,
        headers: {
            'Content-Type': 'text/html',
            'Access-Control-Allow-Origin': '*',
            ...headers
        },
        body
    };
}

// Main Netlify Function handler
exports.handler = async (event, context) => {
    const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Mathematricks Capital - API Documentation</title>
        <style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }

            body {
                font-family: 'Arial', sans-serif;
                background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
                color: white;
                height: 100vh;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .container {
                text-align: center;
                padding: 2rem;
            }

            h1 {
                font-size: 3rem;
                font-weight: 300;
                margin-bottom: 1rem;
                color: #4CAF50;
            }

            p {
                font-size: 1.2rem;
                color: #ccc;
            }

            @media (max-width: 768px) {
                h1 {
                    font-size: 2rem;
                }

                p {
                    font-size: 1rem;
                }
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>Signal Documentation</h1>
            <p>Will come here</p>
        </div>
    </body>
    </html>
    `;

    return createResponse(200, html);
};