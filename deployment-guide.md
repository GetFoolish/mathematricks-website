# Mathematricks Capital - Free Deployment Guide

Deploy your hedge fund website and TradingView webhook completely free using Netlify + Vercel..

## 🚀 Quick Deployment

### Step 1: Deploy Website to Netlify
1. Go to [netlify.com](https://netlify.com) and sign up
2. Click "New site from Git"
3. Connect your GitHub account
4. Select `vandanchopra/mathematricks-website` repository
5. Deploy settings:
   - **Build command**: Leave empty (static HTML)
   - **Publish directory**: `.` (root)
6. Click "Deploy site"

### Step 2: Deploy Webhook to Vercel
1. Go to [vercel.com](https://vercel.com) and sign up
2. Click "New Project"
3. Import `vandanchopra/mathematricks-website` repository
4. Framework: "Other"
5. Add environment variable:
   - **Name**: `WEBHOOK_PASSPHRASE`
   - **Value**: `yahoo123` (or your secure passphrase)
6. Click "Deploy"

## 🌐 Custom Domain Setup (mathematricks.capital)

### For Website (Netlify):
1. **Buy domain** `mathematricks.capital`
2. **In Netlify dashboard**:
   - Go to Site settings > Domain management
   - Click "Add custom domain"
   - Enter `mathematricks.capital`
3. **Update DNS at your registrar**:
   ```
   Type: A
   Name: @
   Value: 75.2.60.5

   Type: CNAME
   Name: www
   Value: your-site.netlify.app
   ```

### For Webhook (Vercel):
1. **In Vercel dashboard**:
   - Go to Project settings > Domains
   - Add `webhook.mathematricks.capital`
2. **Update DNS**:
   ```
   Type: CNAME
   Name: webhook
   Value: your-project.vercel.app
   ```

## 🎯 Final URLs
- **Website**: `https://mathematricks.capital`
- **Webhook**: `https://webhook.mathematricks.capital`

## 🔧 Environment Variables

### Netlify (none needed for static site)
- No environment variables required

### Vercel:
- `WEBHOOK_PASSPHRASE`: Your secure webhook password

## 💰 Cost Breakdown
- **Netlify**: Free (100GB bandwidth/month)
- **Vercel**: Free (100GB bandwidth/month)
- **Domain**: ~$12/year
- **SSL**: Free (automatic)
- **Total**: ~$12/year

## 🔒 Security Features
- ✅ Automatic HTTPS
- ✅ Security headers configured
- ✅ CORS protection
- ✅ Passphrase authentication
- ✅ Request validation

## 📊 Monitoring
- **Netlify**: Built-in analytics
- **Vercel**: Function logs and metrics
- **Both**: Real-time deployment logs

## 🧪 Testing Your Deployment

### Test Website:
```bash
curl -I https://mathematricks.capital
```

### Test Webhook:
```bash
curl -X POST https://webhook.mathematricks.capital \
  -H "Content-Type: application/json" \
  -d '{
    "passphrase": "yahoo123",
    "timestamp": "2024-01-15T10:30:00Z",
    "signal": {
      "ticker": "AAPL",
      "price": 150.25,
      "action": "BUY",
      "volume_24h": 50000000
    }
  }'
```

## 🚀 Automatic Deployments

Both services automatically deploy when you push to your main branch:
- **Website updates** → Netlify redeploys
- **Webhook updates** → Vercel redeploys

## 📈 Performance
- **Global CDN**: Both services use worldwide CDNs
- **99.9% uptime**: Enterprise-grade reliability
- **Fast loading**: Optimized for performance
- **Auto-scaling**: Handles traffic spikes automatically

## 🆘 Support
- **Netlify**: Excellent documentation and community
- **Vercel**: 24/7 support and detailed logs
- **Both**: Status pages for monitoring uptime

---

## 🎉 Congratulations!

Your Mathematricks Capital website is now deployed with:
- ✅ Professional hedge fund website
- ✅ Secure TradingView webhook
- ✅ Custom domain ready
- ✅ Automatic deployments
- ✅ Enterprise-grade performance
- ✅ $0 hosting costs

**Ready to receive TradingView signals and showcase your hedge fund professionally!**