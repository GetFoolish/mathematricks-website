#!/bin/bash

# Cloudflare Tunnel Setup Script for Mathematricks Capital Signal Forwarding
# This script helps set up a Cloudflare Tunnel to forward signals from Vercel to local collector

echo "🌐 Mathematricks Capital - Cloudflare Tunnel Setup"
echo "=================================================="
echo ""

# Check if cloudflared is installed
if ! command -v cloudflared &> /dev/null; then
    echo "❌ cloudflared is not installed"
    echo ""
    echo "📋 Installation Instructions:"
    echo ""
    echo "# macOS (using Homebrew):"
    echo "brew install cloudflare/cloudflare/cloudflared"
    echo ""
    echo "# Linux (using package manager):"
    echo "# Ubuntu/Debian:"
    echo "wget -q https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb"
    echo "sudo dpkg -i cloudflared-linux-amd64.deb"
    echo ""
    echo "# Or download from: https://github.com/cloudflare/cloudflared/releases"
    echo ""
    exit 1
fi

echo "✅ cloudflared is installed"
echo ""

# Check if user is logged in
if ! cloudflared tunnel list &> /dev/null; then
    echo "🔐 You need to authenticate with Cloudflare first"
    echo ""
    echo "Run the following command and follow the browser authentication:"
    echo "cloudflared tunnel login"
    echo ""
    echo "After authentication, run this script again."
    exit 1
fi

echo "✅ Cloudflare authentication verified"
echo ""

# Tunnel configuration
TUNNEL_NAME="mathematricks-signals"
LOCAL_PORT="8888"
LOCAL_URL="http://localhost:${LOCAL_PORT}"

echo "🚀 Setting up tunnel: ${TUNNEL_NAME}"
echo "📡 Local service: ${LOCAL_URL}"
echo ""

# Create tunnel if it doesn't exist
if ! cloudflared tunnel list | grep -q "${TUNNEL_NAME}"; then
    echo "🔧 Creating new tunnel: ${TUNNEL_NAME}"
    cloudflared tunnel create "${TUNNEL_NAME}"

    if [ $? -eq 0 ]; then
        echo "✅ Tunnel created successfully"
    else
        echo "❌ Failed to create tunnel"
        exit 1
    fi
else
    echo "✅ Tunnel ${TUNNEL_NAME} already exists"
fi

# Get tunnel ID
TUNNEL_ID=$(cloudflared tunnel list | grep "${TUNNEL_NAME}" | awk '{print $1}')
echo "🆔 Tunnel ID: ${TUNNEL_ID}"
echo ""

# Create config file
CONFIG_FILE="$HOME/.cloudflared/config.yml"
mkdir -p "$HOME/.cloudflared"

cat > "${CONFIG_FILE}" << EOF
tunnel: ${TUNNEL_ID}
credentials-file: $HOME/.cloudflared/${TUNNEL_ID}.json

ingress:
  - hostname: "*"
    service: ${LOCAL_URL}
  - service: http_status:404
EOF

echo "📝 Created config file: ${CONFIG_FILE}"
echo ""

# Get tunnel domain
TUNNEL_DOMAIN=$(cloudflared tunnel list | grep "${TUNNEL_NAME}" | awk '{print $3}')
if [ -z "$TUNNEL_DOMAIN" ]; then
    TUNNEL_DOMAIN="${TUNNEL_NAME}.example.trycloudflare.com"
fi

echo "🌐 Your tunnel will be accessible at: https://${TUNNEL_DOMAIN}"
echo ""

echo "🔧 Setup Complete! Next Steps:"
echo ""
echo "1. Start your local signal collector:"
echo "   source venv/bin/activate && python signal-collector.py"
echo ""
echo "2. In another terminal, start the Cloudflare tunnel:"
echo "   cloudflared tunnel --config $HOME/.cloudflared/config.yml run"
echo ""
echo "3. Update Vercel webhook environment variable:"
echo "   Set LOCAL_COLLECTOR_URL to: https://${TUNNEL_DOMAIN}"
echo ""
echo "4. Test the complete flow:"
echo "   TradingView → Vercel Webhook → Cloudflare Tunnel → Local Collector"
echo ""

echo "📋 Quick Commands:"
echo ""
echo "# Start tunnel (run this in a separate terminal):"
echo "cloudflared tunnel --config $HOME/.cloudflared/config.yml run"
echo ""
echo "# Alternative: Start tunnel with auto-generated domain:"
echo "cloudflared tunnel --url ${LOCAL_URL}"
echo ""
echo "# View tunnel status:"
echo "cloudflared tunnel list"
echo ""
echo "# Delete tunnel (if needed):"
echo "cloudflared tunnel delete ${TUNNEL_NAME}"
echo ""

echo "💡 Important Notes:"
echo "- Keep the tunnel running while you want to receive signals"
echo "- The local collector must be running on port ${LOCAL_PORT}"
echo "- Update the Vercel environment variable with your tunnel URL"
echo "- The tunnel URL will change each time you restart with auto-generated domain"
echo ""

echo "🔗 Cloudflare Tunnel Documentation:"
echo "https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/"