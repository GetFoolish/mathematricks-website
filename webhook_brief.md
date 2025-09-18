This brief is structured to be unambiguous, providing clear context, technical specifications, and expected output, ensuring the AI can generate the precise code and instructions you need.
LLM Brief: Create a Low-Latency TradingView Webhook Receiver on Google Cloud Functions
## Project Objective
Your task is to generate the code and deployment instructions for a low-latency webhook receiver designed to catch signals from TradingView. The final solution must be deployed as a Google Cloud Function using Python. The primary goal is speed and reliability, so the solution should be lean and efficient.
## Core Requirements
Platform: The application must be a Google Cloud Function (2nd Gen).
Language: The code must be written in Python (version 3.11 or newer).
Trigger: The function must be triggered by an HTTP POST request.
Input: The function must be able to receive a raw text or JSON payload from a TradingView webhook.
Processing:
It must parse the incoming JSON payload.
It must include a basic security check using a shared secret or "passphrase" to ensure the request is from a legitimate source.
It must log the received signal data for debugging purposes.
It must include a clearly marked placeholder section where a user will later insert their own trading logic (e.g., broker API calls).
Output:
Upon successful processing, the function must return an HTTP 200 OK status.
Upon failure (e.g., incorrect method, missing passphrase), it must return an appropriate error status (e.g., 400 Bad Request, 401 Unauthorized).
## Technical Specifications
1. Input Payload Format
The TradingView alert will be configured to send a JSON message in the following format. The function must be able to parse this structure.
code
JSON
{
  "passphrase": "your-secret-passphrase-here",
  "timestamp": "{{timenow}}",
  "signal": {
    "ticker": "{{ticker}}",
    "price": {{close}},
    "action": "BUY",
    "volume_24h": {{volume}}
  }
}
The "action" field is a custom string that will be hardcoded in the TradingView alert message (e.g., "BUY" or "SELL").
The passphrase is a simple shared secret for security.
2. Function Logic (Step-by-Step)
The Python function should perform the following actions in order:
Check if the incoming request method is POST. If not, abort with a 405 Method Not Allowed error.
Retrieve the JSON data from the request body.
Extract the passphrase from the JSON payload.
Compare the received passphrase against a secret stored as an environment variable (for better security than hardcoding). Let's name the environment variable WEBHOOK_PASSPHRASE.
If the passphrases do not match or the key is missing, immediately return a 401 Unauthorized error.
If the passphrase is correct, proceed to parse the rest of the signal data (timestamp, ticker, price, etc.).
Print the extracted signal data to the standard output (which will be captured by Google Cloud Logging). This is for debugging.
Placeholder: Include a commented-out section with a clear message like # --- TODO: INSERT YOUR BROKER API/TRADING LOGIC HERE --- #.
Return a success message (e.g., {"status": "success"}) with an HTTP 200 OK status code.
3. Required Files
The output should consist of two files:
main.py: This file will contain the main Python function logic. It should use Google's functions-framework library.
requirements.txt: This file will list the necessary Python dependencies.
4. Deployment Instructions
Provide a complete, step-by-step guide for deploying the function using the gcloud command-line tool. The instructions should be clear enough for a user with the gcloud CLI already installed and authenticated.
The deployment command must specify:
The function name (e.g., tradingview-receiver).
The generation (--gen2).
The runtime (python311).
The region. Strongly recommend us-east4 for minimal latency to TradingView's servers and explain why.
The source directory (.).
The entry point (the name of the Python function in main.py).
The trigger type (--trigger-http).
The security setting to allow public access (--allow-unauthenticated). Explain that this is necessary for TradingView to reach the webhook URL and that our passphrase provides the application-level security.
Instructions on how to set the WEBHOOK_PASSPHRASE environment variable during deployment.
## Final Expected Output
Please structure your response in a single block, ready for the user to follow.
Section 1: Code Files
Provide the complete contents for main.py.
Provide the complete contents for requirements.txt.
Section 2: Deployment Guide
Provide the precise, copy-pasteable gcloud command for deployment, with clearly marked placeholders for user-specific values like <YOUR_PROJECT_ID>.
Provide a concluding sentence explaining how the user will get their final webhook URL after deployment.