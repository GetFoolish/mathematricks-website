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
                font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
                background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
                color: white;
                line-height: 1.6;
                min-height: 100vh;
                padding: 2rem;
            }

            .container {
                max-width: 1200px;
                margin: 0 auto;
            }

            h1 {
                font-size: 2.5rem;
                font-weight: 300;
                margin-bottom: 1rem;
                color: #4CAF50;
                text-align: center;
            }

            .subtitle {
                text-align: center;
                color: #ccc;
                margin-bottom: 3rem;
                font-size: 1.2rem;
            }

            .section {
                background: rgba(255, 255, 255, 0.05);
                border-radius: 10px;
                padding: 2rem;
                margin-bottom: 2rem;
                border: 1px solid rgba(76, 175, 80, 0.2);
            }

            .section h2 {
                color: #4CAF50;
                margin-bottom: 1rem;
                font-size: 1.5rem;
            }

            .language-selector {
                display: flex;
                gap: 1rem;
                margin-bottom: 1.5rem;
                flex-wrap: wrap;
            }

            .lang-btn {
                background: rgba(76, 175, 80, 0.2);
                border: 2px solid #4CAF50;
                color: white;
                padding: 0.5rem 1rem;
                border-radius: 5px;
                cursor: pointer;
                transition: all 0.3s;
                font-family: inherit;
            }

            .lang-btn:hover, .lang-btn.active {
                background: #4CAF50;
                color: #1a1a1a;
            }

            .code-block {
                background: #0d1117;
                border: 1px solid #30363d;
                border-radius: 8px;
                padding: 1.5rem;
                margin: 1rem 0;
                position: relative;
                overflow-x: auto;
            }

            .code-block pre {
                margin: 0;
                color: #e6edf3;
                font-size: 0.9rem;
                white-space: pre-wrap;
            }

            .copy-btn {
                position: absolute;
                top: 10px;
                right: 10px;
                background: #4CAF50;
                color: #1a1a1a;
                border: none;
                padding: 0.5rem 1rem;
                border-radius: 4px;
                cursor: pointer;
                font-size: 0.8rem;
                transition: background 0.3s;
            }

            .copy-btn:hover {
                background: #45a049;
            }

            .copy-btn.copied {
                background: #FF9800;
            }

            .example-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                gap: 1.5rem;
                margin-top: 1.5rem;
            }

            .example-card {
                background: rgba(255, 255, 255, 0.05);
                border-radius: 8px;
                padding: 1.5rem;
                border: 1px solid rgba(76, 175, 80, 0.2);
            }

            .example-card h4 {
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