#!/bin/bash

# Setup script for local development

echo "Setting up Mathematricks Capital local development environment..."

# Create virtual environment
echo "Creating virtual environment..."
python3 -m venv venv

# Activate virtual environment
echo "Activating virtual environment..."
source venv/bin/activate

# Install dependencies
echo "Installing dependencies..."
pip install -r requirements.txt

echo ""
echo "Setup complete! To start development:"
echo "1. Activate virtual environment: source venv/bin/activate"
echo "2. Start local server: python local-dev.py"
echo "3. Open browser to: http://localhost:5000"
echo ""
echo "To test webhook locally:"
echo "1. In another terminal: source venv/bin/activate"
echo "2. cd webhook"
echo "3. functions-framework --target=tradingview_webhook --debug"
echo "4. Test webhook at: http://localhost:8080"