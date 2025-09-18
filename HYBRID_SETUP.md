# Mathematricks Capital - Hybrid Signal Collection System

## Architecture Overview

```
TradingView → Vercel Webhook → Cloudflare Tunnel → Local Collector
```

### Components:

1. **Vercel Webhook** (`api/webhook.py`): Receives signals from TradingView, stores them temporarily, and forwards to local collector
2. **Cloudflare Tunnel**: Secure tunnel to forward signals from Vercel to local machine
3. **Local Signal Collector** (`signal-collector.py`): Hybrid collector with catch-up and live modes

## Setup Instructions

### Step 1: Install Cloudflare Tunnel

```bash
# macOS
brew install cloudflare/cloudflare/cloudflared

# Linux (Ubuntu/Debian)
wget -q https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb
sudo dpkg -i cloudflared-linux-amd64.deb
```

### Step 2: Authenticate with Cloudflare

```bash
cloudflared tunnel login
```

Follow the browser authentication flow.

### Step 3: Run Tunnel Setup Script

```bash
./cloudflare-tunnel-setup.sh
```

This script will:
- Create a tunnel named "mathematricks-signals"
- Generate configuration files
- Provide your tunnel URL

### Step 4: Configure Vercel Environment Variable

In your Vercel dashboard, set the environment variable:

- **Variable**: `LOCAL_COLLECTOR_URL`
- **Value**: Your tunnel URL (e.g., `https://mathematricks-signals.example.trycloudflare.com`)

Redeploy your Vercel function after setting this variable.

### Step 5: Start the System

#### Terminal 1: Start Local Collector
```bash
source venv/bin/activate
python signal-collector.py
```

The collector will:
1. **Catch-up Phase**: Download any missed signals from Vercel storage
2. **Live Phase**: Listen for real-time forwarded signals

#### Terminal 2: Start Cloudflare Tunnel
```bash
cloudflared tunnel --config ~/.cloudflared/config.yml run
```

## System Behavior

### Catch-up Mode
- On startup, the local collector fetches all signals from Vercel storage since the last collection
- Processes missed signals with `📥 CATCHUP` label
- Ensures no signals are lost during downtime

### Live Mode
- Receives real-time signals forwarded from Vercel via Cloudflare Tunnel
- Processes live signals with `🚨 LIVE` label
- Maintains continuous signal collection

### Signal Flow
1. TradingView sends signal to Vercel webhook
2. Vercel webhook:
   - Validates passphrase
   - Stores signal in temporary memory
   - Forwards to local collector via tunnel (if available)
   - Returns success response to TradingView
3. Local collector receives signal and processes with timing analysis

## Testing the System

### Test Production Webhook
```bash
curl -X POST https://mathematricks-website.vercel.app/api/webhook \
  -H "Content-Type: application/json" \
  -d '{"passphrase": "yahoo123", "timestamp": "2024-01-15T10:30:00Z", "signal": {"ticker": "AAPL", "price": 150.25, "action": "BUY"}}'
```

### Test Local Collector Direct
```bash
curl -X POST http://localhost:8888 \
  -H "Content-Type: application/json" \
  -d '{"passphrase": "yahoo123", "timestamp": "2024-01-15T10:30:00Z", "signal": {"ticker": "TSLA", "price": 245.75, "action": "SELL"}}'
```

### Get Stored Signals from Vercel
```bash
curl -X GET https://mathematricks-website.vercel.app/api/signals
```

### Simulate Forwarded Signal
```bash
curl -X POST http://localhost:8888 \
  -H "Content-Type: application/json" \
  -d '{"source": "vercel_forwarded", "forwarded_at": "2024-01-15T10:30:00Z", "original_signal": {"passphrase": "yahoo123", "timestamp": "2024-01-15T10:30:00Z", "signal": {"ticker": "ETH", "price": 2500.50, "action": "BUY"}}}'
```

## Monitoring

The local collector displays real-time status:
```
[2024-01-15 10:30:00] 🌐 Webhook: 🟢 ONLINE | 📡 Tunnel: 🟢 LISTENING | 📊 Signals: 5
```

Status indicators:
- **🟢 ONLINE/LISTENING**: Service is working correctly
- **🟡 STATUS XXX**: Service responding but with non-200 status
- **🔴 OFFLINE/NOT READY**: Service not accessible

## Troubleshooting

### Tunnel Not Working
```bash
# Check tunnel status
cloudflared tunnel list

# Test tunnel connectivity
curl -X GET https://your-tunnel-url.trycloudflare.com

# Restart tunnel
cloudflared tunnel --config ~/.cloudflared/config.yml run
```

### Signals Not Being Forwarded
1. Check Vercel environment variable `LOCAL_COLLECTOR_URL` is set correctly
2. Verify tunnel is running and accessible
3. Check Vercel function logs for forwarding errors
4. Test local collector is running on port 8888

### Missing Signals
1. Check if local collector is performing catch-up on startup
2. Verify signals are being stored in Vercel (use GET /api/signals)
3. Check timing of collector startup vs signal sending

## File Structure

```
📁 MathematricksWebsite/
├── 📄 api/webhook.py                 # Vercel webhook with storage & forwarding
├── 📄 signal-collector.py            # Hybrid local collector
├── 📄 cloudflare-tunnel-setup.sh     # Tunnel setup script
├── 📄 HYBRID_SETUP.md               # This documentation
├── 📄 collected_signals.json        # Local signal storage
└── 📄 requirements.txt              # Python dependencies
```

## Environment Variables

### Vercel
- `WEBHOOK_PASSPHRASE`: Secret for TradingView authentication (e.g., "yahoo123")
- `LOCAL_COLLECTOR_URL`: Tunnel URL for forwarding (e.g., "https://tunnel.trycloudflare.com")

### Local
- No environment variables needed for local collector

## Security Notes

- Signals are authenticated with passphrase at Vercel level
- Cloudflare Tunnel provides secure encrypted connection
- Local collector only accepts forwarded signals from authenticated webhook
- No sensitive data is logged or exposed