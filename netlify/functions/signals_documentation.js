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
        <title>Mathematricks Capital - Signal API Documentation</title>
        <style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }

            body {
                font-family: 'Arial', sans-serif;
                background: #fafafa;
                color: #0a0a0a;
                line-height: 1.6;
                font-size: 16px;
                padding-top: 2rem;
                padding-bottom: 2rem;
            }

            .container {
                max-width: 900px;
                margin: 0 auto;
                padding: 4rem 2rem;
                background: #fff;
                border: 3px solid #000;
                box-shadow: 8px 8px 0 rgba(0,0,0,1);
                position: relative;
            }

            h1 {
                font-size: 2.5rem;
                font-weight: 900;
                margin-bottom: 1rem;
                line-height: 1.1;
                position: relative;
                display: inline-block;
            }

            h1::after {
                content: '';
                position: absolute;
                bottom: -10px;
                left: 0;
                width: 60%;
                height: 8px;
                background: #ffeb3b;
                z-index: -1;
            }

            .subtitle {
                text-align: left;
                color: #0a0a0a;
                opacity: 0.7;
                margin-bottom: 3rem;
                font-size: 1rem;
                font-weight: 700;
                text-transform: uppercase;
                letter-spacing: 2px;
            }

            .section {
                margin-bottom: 3rem;
                padding-bottom: 2rem;
            }

            .section h2 {
                font-size: 1.75rem;
                font-weight: 900;
                margin-bottom: 2rem;
                border-bottom: 4px solid #000;
                padding-bottom: 0.5rem;
                position: relative;
            }

            .section h2::before {
                content: '▪';
                color: #ffeb3b;
                margin-right: 0.5rem;
                font-size: 2rem;
                vertical-align: middle;
            }

            .language-selector {
                display: flex;
                gap: 0;
                margin-top: 1.5rem;
                margin-bottom: 1.5rem;
                flex-wrap: wrap;
            }

            .lang-btn {
                background: #fff;
                border: 2px solid #000;
                color: #000;
                padding: 0.5rem 1rem;
                cursor: pointer;
                transition: all 0.2s;
                font-family: inherit;
                font-size: 0.875rem;
                margin-left: -2px;
                font-weight: 700;
            }

            .lang-btn:first-child {
                margin-left: 0;
            }

            .lang-btn:hover, .lang-btn.active {
                background: #000;
                color: #fff;
                transform: translateY(-2px);
            }

            .code-block {
                background: #0d1117;
                border: 3px solid #000;
                padding: 1.5rem;
                margin: 1rem 0;
                position: relative;
                overflow-x: auto;
                box-shadow: 4px 4px 0 rgba(0,0,0,0.2);
            }

            .code-block pre {
                margin: 0;
                color: #e6edf3;
                font-size: 0.9rem;
                white-space: pre-wrap;
                font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
            }

            .copy-btn {
                position: absolute;
                top: 10px;
                right: 10px;
                background: #000;
                color: #fff;
                border: 3px solid #000;
                padding: 0.5rem 1rem;
                cursor: pointer;
                font-size: 0.8rem;
                transition: all 0.2s;
                font-weight: 900;
                box-shadow: 2px 2px 0 #ffeb3b;
            }

            .copy-btn:hover {
                transform: translate(-2px, -2px);
                box-shadow: 4px 4px 0 #ffeb3b;
            }

            .copy-btn.copied {
                background: #ffeb3b;
                color: #000;
            }

            .example-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                gap: 2rem;
                margin-top: 1.5rem;
            }

            .example-card {
                background: #fff;
                border: 3px solid #000;
                padding: 1.5rem;
                box-shadow: 6px 6px 0 #ffeb3b;
                transition: all 0.3s;
                position: relative;
                overflow: hidden;
            }

            .example-card::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 4px;
                background: linear-gradient(90deg, #000 50%, #ffeb3b 50%);
            }

            .example-card:hover {
                transform: translate(-4px, -4px);
                box-shadow: 10px 10px 0 #ffeb3b;
            }

            .example-card h4 {
                color: #000;
                margin-bottom: 1rem;
                font-weight: 900;
                font-size: 1.125rem;
            }

            .example-card .code-block {
                margin: 0;
                padding: 1rem;
                font-size: 0.8rem;
            }

            .url-section {
                background: #fff;
                border: 3px solid #000;
                padding: 1.5rem;
                margin: 1rem 0;
                box-shadow: 4px 4px 0 #ffeb3b;
            }

            .url-section h3 {
                color: #000;
                margin-bottom: 0.5rem;
                font-weight: 900;
                font-size: 1.125rem;
            }

            .url-section p {
                font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
                background: #f5f5f5;
                padding: 0.5rem;
                border: 2px solid #000;
                display: inline-block;
            }

            ul {
                margin-left: 2rem;
                margin-top: 1rem;
            }

            ul li {
                margin-bottom: 0.75rem;
            }

            ul li strong {
                font-weight: 900;
            }

            p {
                margin-bottom: 1rem;
            }

            @media (max-width: 768px) {
                body {
                    padding: 1rem;
                }

                .container {
                    padding: 2rem 1rem;
                }

                h1 {
                    font-size: 2rem;
                }

                .language-selector {
                    justify-content: flex-start;
                }
            }
        </style>
                color: #4CAF50;
                margin-bottom: 0.5rem;
            }

            .url-section {
                background: rgba(255, 193, 7, 0.1);
                border: 1px solid #FFC107;
                border-radius: 8px;
                padding: 1rem;
                margin: 1rem 0;
            }

            .url-section h3 {
                color: #FFC107;
                margin-bottom: 0.5rem;
            }

            @media (max-width: 768px) {
                body {
                    padding: 1rem;
                }

                h1 {
                    font-size: 2rem;
                }

                .language-selector {
                    justify-content: center;
                }
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>Mathematricks Fun(d) Signal API</h1>
            <p class="subtitle">Send trading signals with just a few lines of code</p>

            <div class="section">
                <h2>🚀 Quick Start</h2>
                <p>Send trading signals to Mathematricks Capital in any programming language. Select your preferred language below:</p>

                <div class="language-selector">
                    <button class="lang-btn active" data-lang="curl">curl</button>
                    <button class="lang-btn" data-lang="python">Python</button>
                    <button class="lang-btn" data-lang="javascript">JavaScript</button>
                    <button class="lang-btn" data-lang="cpp">C++</button>
                </div>

                <div class="url-section">
                    <h3>📍 API Endpoint</h3>
                    <p>https://mathematricks.fund/api/signals</p>
                </div>

                <div id="code-examples">
                    <!-- Code examples will be populated by JavaScript -->
                </div>
            </div>

            <div class="section">
                <h2>📊 Signal Examples</h2>
                <p>The <code>signal</code> field can contain any JSON structure for different trading strategies:</p>

                <div class="example-grid">
                    <div class="example-card">
                        <h4>📈 Basic Stock Signal</h4>
                        <div class="code-block">
                            <pre>{"ticker": "AAPL", "action": "BUY", "price": 150.25}</pre>
                        </div>
                    </div>

                    <div class="example-card">
                        <h4>⚡ Options Signal</h4>
                        <div class="code-block">
                            <pre>{"type": "options", "ticker": "AAPL", "strike": 150, "expiry": "2025-01-17", "action": "BUY_CALL"}</pre>
                        </div>
                    </div>

                    <div class="example-card">
                        <h4>🔗 Multi-leg Order</h4>
                        <div class="code-block">
                            <pre>[{"ticker": "SPY", "action": "BUY", "qty": 100}, {"ticker": "QQQ", "action": "SELL", "qty": 50}]</pre>
                        </div>
                    </div>

                    <div class="example-card">
                        <h4>🛑 Stop Loss</h4>
                        <div class="code-block">
                            <pre>{"trigger": "if AAPL < 145", "action": "SELL_ALL", "stop_loss": true}</pre>
                        </div>
                    </div>
                </div>
            </div>

            <div class="section">
                <h2>🔑 Required Fields</h2>
                <p>Every signal must include these required fields:</p>
                <ul style="margin-left: 2rem; margin-top: 1rem;">
                    <li><strong>strategy_name:</strong> Name of your trading strategy</li>
                    <li><strong>signal_sent_EPOCH:</strong> Unix timestamp when signal was sent</li>
                    <li><strong>signalID:</strong> Unique identifier for this signal</li>
                    <li><strong>passphrase:</strong> Your API authentication passphrase</li>
                    <li><strong>signal:</strong> Your trading signal data (any JSON structure)</li>
                </ul>
            </div>
        </div>

        <script>
            const codeExamples = {
                curl: \`curl -X POST https://mathematricks.fund/api/signals -H "Content-Type: application/json" -d '{
    "strategy_name": "My Strategy",
    "signal_sent_EPOCH": 1696270000,
    "signalID": "signal_001",
    "passphrase": "your_passphrase_here",
    "signal": {"ticker": "AAPL", "action": "BUY", "price": 150.25}
  }'\`,

                python: \`import requests
import time

response = requests.post(
    "https://mathematricks.fund/api/signals",
    json={
        "strategy_name": "My Strategy",
        "signal_sent_EPOCH": int(time.time()),
        "signalID": "signal_001",
        "passphrase": "your_passphrase_here",
        "signal": {"ticker": "AAPL", "action": "BUY", "price": 150.25}
    }
)

if response.status_code == 200:
    print("✅ Signal sent successfully!")
else:
    print(f"❌ Error: {response.text}")\`,

                javascript: \`const response = await fetch("https://mathematricks.fund/api/signals", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({
        strategy_name: "My Strategy",
        signal_sent_EPOCH: Math.floor(Date.now() / 1000),
        signalID: "signal_001",
        passphrase: "your_passphrase_here",
        signal: {ticker: "AAPL", action: "BUY", price: 150.25}
    })
});

if (response.ok) {
    console.log("✅ Signal sent successfully!");
} else {
    console.log("❌ Error:", await response.text());
}\`,

                cpp: \`#include <curl/curl.h>
#include <string>
#include <ctime>

std::string json = R"({
    "strategy_name": "My Strategy",
    "signal_sent_EPOCH": )" + std::to_string(std::time(nullptr)) + R"(,
    "signalID": "signal_001",
    "passphrase": "your_passphrase_here",
    "signal": {"ticker": "AAPL", "action": "BUY", "price": 150.25}
})";

CURL *curl = curl_easy_init();
if(curl) {
    curl_easy_setopt(curl, CURLOPT_URL, "https://mathematricks.fund/api/signals");
    curl_easy_setopt(curl, CURLOPT_POSTFIELDS, json.c_str());

    struct curl_slist *headers = NULL;
    headers = curl_slist_append(headers, "Content-Type: application/json");
    curl_easy_setopt(curl, CURLOPT_HTTPHEADER, headers);

    CURLcode res = curl_easy_perform(curl);
    curl_easy_cleanup(curl);
    curl_slist_free_all(headers);
}\`
            };

            function showCode(language) {
                const codeContainer = document.getElementById('code-examples');
                const code = codeExamples[language];

                codeContainer.innerHTML = \`
                    <div class="code-block">
                        <button class="copy-btn" onclick="copyCode(this)">Copy</button>
                        <pre><code>\${code}</code></pre>
                    </div>
                    <p style="margin-top: 1rem; font-size: 0.85rem; opacity: 0.7;">
                        <strong>Note:</strong> Ask your Mathematricks.fund representative for a passphrase or send an email to strategies@mathematricks.fund
                    </p>
                \`;
            }

            function copyCode(button) {
                const code = button.nextElementSibling.textContent;
                navigator.clipboard.writeText(code).then(() => {
                    button.textContent = 'Copied!';
                    button.classList.add('copied');
                    setTimeout(() => {
                        button.textContent = 'Copy';
                        button.classList.remove('copied');
                    }, 2000);
                });
            }

            // Language selector functionality
            document.querySelectorAll('.lang-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    document.querySelectorAll('.lang-btn').forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    showCode(btn.dataset.lang);
                });
            });

            // Initialize with curl example
            showCode('curl');
        </script>
    </body>
    </html>
    `;

    return createResponse(200, html);
};