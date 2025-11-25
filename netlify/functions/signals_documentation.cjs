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
    // Determine API URL based on host
    const host = event.headers?.host || event.headers?.Host || 'mathematricks.fund';
    const isLocalhost = host.includes('localhost') || host.includes('127.0.0.1');
    const isStaging = host.includes('staging');

    // Use staging URL for localhost and staging subdomain
    const apiUrl = (isLocalhost || isStaging)
        ? 'https://staging.mathematricks.fund/api/v1/signals'
        : 'https://mathematricks.fund/api/v1/signals';

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
                max-width: 1400px;
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
                border: 2px solid #000;
                padding: 1rem;
                margin: 1rem 0;
                position: relative;
                overflow-x: auto;
                box-shadow: 3px 3px 0 rgba(0,0,0,0.2);
            }

            .code-block pre {
                margin: 0;
                color: #e6edf3;
                font-size: 0.75rem;
                white-space: pre-wrap;
                font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
                line-height: 1.4;
            }

            .copy-btn {
                position: absolute;
                top: 8px;
                right: 8px;
                background: #000;
                color: #fff;
                border: 2px solid #000;
                padding: 0.35rem 0.75rem;
                cursor: pointer;
                font-size: 0.7rem;
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
                grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
                gap: 0.75rem;
                margin-top: 1.5rem;
            }

            .example-card {
                background: #fff;
                border: 2px solid #000;
                padding: 0.75rem;
                box-shadow: 3px 3px 0 #ffeb3b;
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
                transform: translate(-2px, -2px);
                box-shadow: 5px 5px 0 #ffeb3b;
            }

            .example-card h4 {
                color: #000;
                margin-bottom: 0.75rem;
                font-weight: 900;
                font-size: 0.95rem;
            }

            .example-card .code-block {
                margin: 0;
                padding: 0.75rem;
                font-size: 0.7rem;
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
                    <p>${apiUrl}</p>
                </div>

                <div id="code-examples">
                    <!-- Code examples will be populated by JavaScript -->
                </div>
            </div>

            <div class="section">
                <h2>📊 Signal Examples</h2>
                <p>Real-world signal examples for different asset classes:</p>

                <div class="language-selector" style="margin-bottom: 2rem;">
                    <button class="lang-btn active" data-asset="all">All</button>
                    <button class="lang-btn" data-asset="equity">Equity</button>
                    <button class="lang-btn" data-asset="forex">Forex</button>
                    <button class="lang-btn" data-asset="crypto">Crypto</button>
                    <button class="lang-btn" data-asset="commodities">Commodities</button>
                    <button class="lang-btn" data-asset="options">Options</button>
                </div>

                <div id="signal-examples">
                    <!-- Signal examples will be populated by JavaScript -->
                </div>
            </div>

            <div class="section">
                <h2>🔑 Signal Structure</h2>

                <h3 style="font-size: 1.25rem; font-weight: 900; margin-top: 1.5rem; margin-bottom: 1rem;">Required Top-Level Fields</h3>
                <ul style="margin-left: 2rem; margin-top: 1rem;">
                    <li><strong>strategy_name:</strong> Name of your trading strategy</li>
                    <li><strong>signal_sent_EPOCH:</strong> Unix timestamp when signal was sent</li>
                    <li><strong>signalID:</strong> Unique identifier for this signal</li>
                    <li><strong>passphrase:</strong> Your API authentication passphrase</li>
                    <li><strong>account_equity:</strong> Account equity at signal generation time. For position sizes in percentage terms: if your position size is 0.85, send 1; if your position size is 85%, send 100.</li>
                    <li><strong>signal_legs:</strong> Array of trade legs (see below)</li>
                </ul>

                <h3 style="font-size: 1.25rem; font-weight: 900; margin-top: 1.5rem; margin-bottom: 1rem;">Optional Top-Level Fields</h3>
                <ul style="margin-left: 2rem; margin-top: 1rem;">
                    <li><strong>signal_type:</strong> Type of signal - "ENTRY", "EXIT", or "CANCEL"</li>
                    <li><strong>entry_signal_id:</strong> Reference to previous ENTRY signal (for EXIT signals)</li>
                    <li><strong>entry_name:</strong> Named identifier for tracking (e.g., "$ENTRY_1")</li>
                </ul>

                <h3 style="font-size: 1.25rem; font-weight: 900; margin-top: 1.5rem; margin-bottom: 1rem;">Signal Leg Fields</h3>
                <p>Each object in the <code>signal_legs</code> array must contain:</p>
                <ul style="margin-left: 2rem; margin-top: 1rem;">
                    <li><strong>instrument:</strong> Ticker/symbol (e.g., "AAPL", "AUDCAD", "BTC")</li>
                    <li><strong>instrument_type:</strong> Asset type - "STOCK", "FOREX", "CRYPTO", "FUTURE", "OPTION"</li>
                    <li><strong>action:</strong> Trade action - "BUY" or "SELL"</li>
                    <li><strong>direction:</strong> Position direction - "LONG" or "SHORT"</li>
                    <li><strong>quantity:</strong> Number of units to trade</li>
                    <li><strong>order_type:</strong> Order type - "MARKET", "LIMIT", "STOP", etc.</li>
                    <li><strong>price:</strong> Price for the order</li>
                    <li><strong>environment:</strong> "staging" or "production"</li>
                </ul>

                <p style="margin-top: 1.5rem; font-size: 0.9rem; opacity: 0.8;">
                    <strong>Note:</strong> Multi-leg signals (like pairs trades or spreads) can include multiple objects in the <code>signal_legs</code> array.
                </p>
            </div>
        </div>

        <script>
            const apiUrl = "${apiUrl}";
            const codeExamples = {
                curl: \`curl -X POST \${apiUrl} -H "Content-Type: application/json" -d '{
    "strategy_name": "My Strategy",
    "signal_sent_EPOCH": 1696270000,
    "signalID": "signal_001",
    "passphrase": "your_passphrase_here",
    "account_equity": 100000,
    "signal_type": "ENTRY",
    "signal_legs": [{
        "instrument": "AAPL",
        "instrument_type": "STOCK",
        "action": "BUY",
        "direction": "LONG",
        "quantity": 10,
        "order_type": "MARKET",
        "price": 150.25,
        "environment": "staging"
    }]
  }'\`,

                python: \`import requests
import time

response = requests.post(
    "\${apiUrl}",
    json={
        "strategy_name": "My Strategy",
        "signal_sent_EPOCH": int(time.time()),
        "signalID": "signal_001",
        "passphrase": "your_passphrase_here",
        "account_equity": 100000,
        "signal_type": "ENTRY",
        "signal_legs": [{
            "instrument": "AAPL",
            "instrument_type": "STOCK",
            "action": "BUY",
            "direction": "LONG",
            "quantity": 10,
            "order_type": "MARKET",
            "price": 150.25,
            "environment": "staging"
        }]
    }
)

if response.status_code == 200:
    print("✅ Signal sent successfully!")
else:
    print(f"❌ Error: {response.text}")\`,

                javascript: \`const response = await fetch("\${apiUrl}", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({
        strategy_name: "My Strategy",
        signal_sent_EPOCH: Math.floor(Date.now() / 1000),
        signalID: "signal_001",
        passphrase: "your_passphrase_here",
        account_equity: 100000,
        signal_type: "ENTRY",
        signal_legs: [{
            instrument: "AAPL",
            instrument_type: "STOCK",
            action: "BUY",
            direction: "LONG",
            quantity: 10,
            order_type: "MARKET",
            price: 150.25,
            environment: "staging"
        }]
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
    "account_equity": 100000,
    "signal_type": "ENTRY",
    "signal_legs": [{
        "instrument": "AAPL",
        "instrument_type": "STOCK",
        "action": "BUY",
        "direction": "LONG",
        "quantity": 10,
        "order_type": "MARKET",
        "price": 150.25,
        "environment": "staging"
    }]
})";

CURL *curl = curl_easy_init();
if(curl) {
    curl_easy_setopt(curl, CURLOPT_URL, "\${apiUrl}");
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

            // Signal examples by asset class
            const signalExamples = {
                equity_simple: {
                    asset: 'equity',
                    title: '📈 Equity - Simple Entry',
                    code: \`{
    "strategy_name": "US_Equity_Long",
    "signal_sent_EPOCH": 1696270000,
    "signalID": "AAPL_ENTRY_001",
    "passphrase": "your_passphrase",
    "account_equity": 100000,
    "signal_type": "ENTRY",
    "signal_legs": [{
        "instrument": "AAPL",
        "instrument_type": "STOCK",
        "action": "BUY",
        "direction": "LONG",
        "quantity": 10,
        "order_type": "MARKET",
        "price": 150.25,
        "environment": "staging"
    }]
}\`
                },
                equity_pairs: {
                    asset: 'equity',
                    title: '🔗 Equity - Pairs Trade (Multi-leg)',
                    code: \`{
    "strategy_name": "Tech_Pairs",
    "signal_sent_EPOCH": 1696270000,
    "signalID": "PAIRS_001",
    "passphrase": "your_passphrase",
    "account_equity": 250000,
    "signal_type": "ENTRY",
    "signal_legs": [
        {
            "instrument": "AAPL",
            "instrument_type": "STOCK",
            "action": "BUY",
            "direction": "LONG",
            "quantity": 10,
            "order_type": "MARKET",
            "price": 150.00,
            "environment": "staging"
        },
        {
            "instrument": "NVDA",
            "instrument_type": "STOCK",
            "action": "SELL",
            "direction": "SHORT",
            "quantity": 10,
            "order_type": "MARKET",
            "price": 500.00,
            "environment": "staging"
        }
    ]
}\`
                },
                forex_simple: {
                    asset: 'forex',
                    title: '💱 Forex - Simple Entry',
                    code: \`{
    "strategy_name": "Forex_Momentum",
    "signal_sent_EPOCH": 1696270000,
    "signalID": "AUDCAD_ENTRY_001",
    "passphrase": "your_passphrase",
    "account_equity": 50000,
    "signal_type": "ENTRY",
    "signal_legs": [{
        "instrument": "AUDCAD",
        "instrument_type": "FOREX",
        "action": "BUY",
        "direction": "LONG",
        "quantity": 100000,
        "order_type": "MARKET",
        "price": 0.9123,
        "environment": "staging"
    }]
}\`
                },
                crypto_simple: {
                    asset: 'crypto',
                    title: '₿ Crypto - Bitcoin Entry',
                    code: \`{
    "strategy_name": "BTC_Trend",
    "signal_sent_EPOCH": 1696270000,
    "signalID": "BTC_ENTRY_001",
    "passphrase": "your_passphrase",
    "account_equity": 75000,
    "signal_type": "ENTRY",
    "signal_legs": [{
        "instrument": "BTC",
        "instrument_type": "CRYPTO",
        "action": "BUY",
        "direction": "LONG",
        "quantity": 0.5,
        "order_type": "MARKET",
        "price": 95000.00,
        "environment": "staging"
    }]
}\`
                },
                commodities_simple: {
                    asset: 'commodities',
                    title: '🥇 Commodities - Gold Futures',
                    code: \`{
    "strategy_name": "Gold_Momentum",
    "signal_sent_EPOCH": 1696270000,
    "signalID": "GC_ENTRY_001",
    "passphrase": "your_passphrase",
    "account_equity": 150000,
    "signal_type": "ENTRY",
    "signal_legs": [{
        "instrument": "GC",
        "instrument_type": "FUTURE",
        "action": "BUY",
        "direction": "LONG",
        "quantity": 5,
        "order_type": "MARKET",
        "price": 4029.00,
        "expiry": "20251229",
        "exchange": "COMEX",
        "environment": "staging"
    }]
}\`
                }
            };

            let showAllExamples = false;

            function showSignalExamples(assetClass, forceShowAll = false) {
                const container = document.getElementById('signal-examples');

                if (assetClass === 'options') {
                    container.innerHTML = \`
                        <div style="text-align: center; padding: 3rem 2rem; background: #fff; border: 3px solid #000; box-shadow: 4px 4px 0 rgba(0,0,0,0.1);">
                            <p style="font-size: 1.1rem; opacity: 0.7;">
                                Sample signals for this asset class have not yet been created. Come back again in a few days.
                            </p>
                        </div>
                    \`;
                    return;
                }

                const filtered = Object.values(signalExamples).filter(ex =>
                    assetClass === 'all' || ex.asset === assetClass
                );

                if (filtered.length === 0) {
                    container.innerHTML = \`
                        <div style="text-align: center; padding: 3rem 2rem; background: #fff; border: 3px solid #000; box-shadow: 4px 4px 0 rgba(0,0,0,0.1);">
                            <p style="font-size: 1.1rem; opacity: 0.7;">
                                Sample signals for this asset class have not yet been created. Come back again in a few days.
                            </p>
                        </div>
                    \`;
                    return;
                }

                // Limit to 4 examples initially (2 rows on desktop)
                const maxInitialExamples = 4;
                const displayExamples = (showAllExamples || forceShowAll) ? filtered : filtered.slice(0, maxInitialExamples);
                const hasMore = filtered.length > maxInitialExamples;

                const examplesHTML = displayExamples.map(ex => \`
                    <div class="example-card">
                        <h4>\${ex.title}</h4>
                        <div class="code-block">
                            <button class="copy-btn" onclick="copyExampleCode(this)">Copy</button>
                            <pre><code>\${ex.code}</code></pre>
                        </div>
                    </div>
                \`).join('');

                const loadMoreButton = (hasMore && !showAllExamples && !forceShowAll) ? \`
                    <div style="text-align: center; margin-top: 2rem;">
                        <button onclick="loadMoreExamples()" style="background: #000; color: #fff; border: 3px solid #000; padding: 1rem 2rem; cursor: pointer; font-size: 1rem; font-weight: 900; box-shadow: 4px 4px 0 #ffeb3b; transition: all 0.2s; font-family: inherit;" onmouseover="this.style.transform='translate(-2px, -2px)'; this.style.boxShadow='6px 6px 0 #ffeb3b'" onmouseout="this.style.transform=''; this.style.boxShadow='4px 4px 0 #ffeb3b'">
                            Load More Examples
                        </button>
                    </div>
                \` : '';

                container.innerHTML = \`
                    <div class="example-grid">
                        \${examplesHTML}
                    </div>
                    \${loadMoreButton}
                \`;
            }

            function loadMoreExamples() {
                showAllExamples = true;
                const activeAsset = document.querySelector('[data-asset].active').dataset.asset;
                showSignalExamples(activeAsset);
            }

            function copyExampleCode(button) {
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

            // Language selector functionality (Quick Start)
            document.querySelectorAll('[data-lang]').forEach(btn => {
                btn.addEventListener('click', () => {
                    document.querySelectorAll('[data-lang]').forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    showCode(btn.dataset.lang);
                });
            });

            // Asset class selector functionality (Signal Examples)
            document.querySelectorAll('[data-asset]').forEach(btn => {
                btn.addEventListener('click', () => {
                    document.querySelectorAll('[data-asset]').forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    showAllExamples = false; // Reset pagination when switching asset classes
                    showSignalExamples(btn.dataset.asset);
                });
            });

            // Initialize with curl example and all asset classes
            showCode('curl');
            showSignalExamples('all');
        </script>
    </body>
    </html>
    `;

    return createResponse(200, html);
};