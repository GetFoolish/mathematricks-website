#!/usr/bin/env python3
"""
Local development server for Mathematricks Capital website
"""

from flask import Flask, send_from_directory, request, jsonify
import os

app = Flask(__name__)

# Serve the main website
@app.route('/')
def index():
    return send_from_directory('.', 'index.html')

# Serve static files
@app.route('/<path:filename>')
def static_files(filename):
    return send_from_directory('.', filename)

# Mock webhook endpoint for local testing
@app.route('/webhook', methods=['POST'])
def mock_webhook():
    """Mock webhook endpoint for testing contact forms locally"""
    try:
        data = request.get_json()
        print(f"Received contact form data: {data}")

        # Mock successful response
        return jsonify({
            'status': 'success',
            'message': 'Contact form received (local testing mode)'
        })
    except Exception as e:
        print(f"Error processing contact form: {e}")
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 500

if __name__ == '__main__':
    print("Starting Mathematricks Capital local development server...")
    print("Website: http://localhost:8001")
    print("Mock webhook: http://localhost:8001/webhook")
    print("Press Ctrl+C to stop")

    app.run(debug=True, host='0.0.0.0', port=8001)