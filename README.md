# Mathematricks Capital Website & Infrastructure

Professional website and trading infrastructure for Mathematricks Capital hedge fund.

## Project Structure

```
MathematricksWebsite/
├── index.html              # Main website file
├── app.yaml               # Google App Engine configuration
├── webhook/               # TradingView webhook receiver
│   ├── main.py           # Webhook function code
│   ├── requirements.txt  # Python dependencies
│   └── deploy.md        # Webhook deployment guide
├── deployment-guide.md   # Website deployment instructions
├── email-setup-guide.md  # Email integration guide
├── sales_deck.md        # Business requirements
├── webhook_brief.md     # Webhook specifications
└── README.md           # This file
```

## Features

### Website
- ✅ Professional one-page design
- ✅ Responsive layout for all devices
- ✅ Hedge fund industry styling
- ✅ Contact form integration
- ✅ Smooth scrolling navigation
- ✅ Performance optimized

### TradingView Webhook
- ✅ Low-latency Google Cloud Function
- ✅ Security with passphrase validation
- ✅ Comprehensive logging
- ✅ Trading logic placeholders
- ✅ Error handling and monitoring

### Infrastructure
- ✅ Google Cloud Platform deployment
- ✅ Free email solutions
- ✅ SSL certificates included
- ✅ Scalable architecture

## Quick Start

### 1. Deploy Website
```bash
# Set your project ID
export PROJECT_ID="your-project-id"
gcloud config set project $PROJECT_ID

# Deploy to App Engine
gcloud app deploy app.yaml
```

### 2. Deploy Webhook
```bash
# Navigate to webhook directory
cd webhook

# Deploy Cloud Function
gcloud functions deploy tradingview-webhook \
  --gen2 \
  --runtime=python311 \
  --region=us-east4 \
  --source=. \
  --entry-point=tradingview_webhook \
  --trigger-http \
  --allow-unauthenticated \
  --set-env-vars WEBHOOK_PASSPHRASE="your-secret-passphrase"
```

### 3. Setup Email
Follow the detailed instructions in `email-setup-guide.md` to configure free email solutions.

## Website Sections

1. **Hero Section**: Mathematricks Capital introduction
2. **Our Edge**: Talent moat, strategy diversity, allocation algorithm
3. **Performance**: Key metrics and analytics
4. **Risk Management**: Framework and controls
5. **Fund Structure**: Team alignment and investment details
6. **Terms**: Investment terms and conditions
7. **Contact**: Professional contact form

## TradingView Integration

The webhook receives signals in this format:
```json
{
  "passphrase": "your-secret-passphrase",
  "timestamp": "{{timenow}}",
  "signal": {
    "ticker": "{{ticker}}",
    "price": {{close}},
    "action": "BUY",
    "volume_24h": {{volume}}
  }
}
```

## Security Features

- **Passphrase Authentication**: Secure webhook access
- **HTTPS Everywhere**: All communications encrypted
- **Environment Variables**: Secure configuration management
- **Input Validation**: Comprehensive data validation
- **Error Handling**: Graceful error responses

## Performance Optimizations

- **Minimal Dependencies**: Fast loading times
- **Optimized Images**: Compressed assets
- **CDN Ready**: Cloud-optimized delivery
- **Responsive Design**: Mobile-first approach

## Cost Breakdown

### Free Tier Usage
- **App Engine**: 28 frontend instance hours/day
- **Cloud Functions**: 2M requests/month
- **Gmail**: Unlimited personal use
- **SSL Certificates**: Included

### Estimated Monthly Costs
- **Website Hosting**: $0 (within free tier)
- **Webhook Function**: $0 (within free tier)
- **Email Service**: $0 (Gmail/Google Apps Script)
- **Total**: $0/month for moderate traffic

## Monitoring and Maintenance

### Website Analytics
- Google Analytics integration ready
- Performance monitoring included
- Error tracking configured

### Webhook Monitoring
- Cloud Logging enabled
- Error alerts configured
- Performance metrics tracked

## Next Steps

1. **Custom Domain**: Configure professional domain
2. **Email Integration**: Implement contact form email delivery
3. **Analytics**: Add Google Analytics tracking
4. **A/B Testing**: Optimize conversion rates
5. **SEO**: Search engine optimization
6. **Trading Logic**: Implement broker API integration

## Support

For deployment issues or questions:
1. Check the relevant guide in this repository
2. Review Google Cloud documentation
3. Monitor Cloud Logging for errors

## License

Proprietary - Mathematricks Capital

---

**Built for Mathematricks Capital** - Multi-Strategy Quantitative Hedge Fund