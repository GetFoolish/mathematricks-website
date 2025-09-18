# TradingView Webhook Deployment Guide

## Prerequisites
- Google Cloud CLI (gcloud) installed and authenticated
- Google Cloud Project with billing enabled
- Cloud Functions API enabled

## Deployment Commands

### 1. Set Your Project ID
```bash
export PROJECT_ID="your-project-id-here"
gcloud config set project $PROJECT_ID
```

### 2. Enable Required APIs
```bash
gcloud services enable cloudfunctions.googleapis.com
gcloud services enable cloudbuild.googleapis.com
```

### 3. Deploy the Function
```bash
cd webhook

gcloud functions deploy tradingview-webhook \
  --gen2 \
  --runtime=python311 \
  --region=us-east4 \
  --source=. \
  --entry-point=tradingview_webhook \
  --trigger-http \
  --allow-unauthenticated \
  --set-env-vars WEBHOOK_PASSPHRASE="your-secret-passphrase-here"
```

**Important Notes:**
- **Region Choice**: `us-east4` is recommended for minimal latency to TradingView's servers
- **Security**: Replace `"your-secret-passphrase-here"` with a strong, unique passphrase
- **Public Access**: `--allow-unauthenticated` is required for TradingView to reach the webhook
- **Application Security**: The passphrase provides application-level security

### 4. Get Your Webhook URL
After successful deployment, the command will output your webhook URL:
```
https://us-east4-your-project-id.cloudfunctions.net/tradingview-webhook
```

### 5. Test the Webhook
```bash
curl -X POST "https://us-east4-your-project-id.cloudfunctions.net/tradingview-webhook" \
  -H "Content-Type: application/json" \
  -d '{
    "passphrase": "your-secret-passphrase-here",
    "timestamp": "2024-01-15T10:30:00Z",
    "signal": {
      "ticker": "AAPL",
      "price": 150.25,
      "action": "BUY",
      "volume_24h": 50000000
    }
  }'
```

## TradingView Alert Configuration

In TradingView, set up your alert with this JSON message:
```json
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
```

## Monitoring and Logs

View function logs:
```bash
gcloud functions logs read tradingview-webhook --region=us-east4
```

## Security Best Practices

1. **Unique Passphrase**: Use a strong, unique passphrase for each deployment
2. **Environment Variables**: Never hardcode secrets in your source code
3. **IP Allowlisting**: Consider implementing IP restrictions if needed
4. **Rate Limiting**: Monitor for unusual traffic patterns
5. **Audit Logs**: Regularly review function execution logs

## Updating the Function

To update the function with new code:
```bash
gcloud functions deploy tradingview-webhook \
  --gen2 \
  --runtime=python311 \
  --region=us-east4 \
  --source=. \
  --entry-point=tradingview_webhook \
  --trigger-http \
  --allow-unauthenticated \
  --set-env-vars WEBHOOK_PASSPHRASE="your-secret-passphrase-here"
```

## Troubleshooting

- **403 Forbidden**: Check that `--allow-unauthenticated` is set
- **500 Internal Error**: Check function logs for Python errors
- **401 Unauthorized**: Verify passphrase matches exactly
- **Timeout**: Ensure your trading logic is optimized for speed