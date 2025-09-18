# Mathematricks Website Deployment Guide

## Prerequisites
- Google Cloud CLI (gcloud) installed and authenticated
- Google Cloud Project with billing enabled
- App Engine API enabled

## Website Deployment to Google App Engine

### 1. Set Your Project ID
```bash
export PROJECT_ID="your-project-id-here"
gcloud config set project $PROJECT_ID
```

### 2. Enable Required APIs
```bash
gcloud services enable appengine.googleapis.com
```

### 3. Initialize App Engine (First Time Only)
```bash
gcloud app create --region=us-east4
```

### 4. Deploy the Website
```bash
# From the project root directory
gcloud app deploy app.yaml
```

### 5. View Your Website
```bash
gcloud app browse
```

Your website will be available at: `https://your-project-id.ue.r.appspot.com`

## Alternative: Deploy to Cloud Run (Recommended for Better Performance)

### 1. Create Dockerfile
```dockerfile
FROM nginx:alpine
COPY index.html /usr/share/nginx/html/
COPY . /usr/share/nginx/html/
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
```

### 2. Build and Deploy
```bash
# Build the container
gcloud builds submit --tag gcr.io/$PROJECT_ID/mathematricks-website

# Deploy to Cloud Run
gcloud run deploy mathematricks-website \
  --image gcr.io/$PROJECT_ID/mathematricks-website \
  --platform managed \
  --region us-east4 \
  --allow-unauthenticated \
  --port 8080
```

## Custom Domain Setup (Optional)

### 1. Map Custom Domain
```bash
gcloud app domain-mappings create your-domain.com
```

### 2. Verify Domain Ownership
Follow the instructions provided by the command above to verify domain ownership through your DNS provider.

### 3. Update DNS Records
Add the DNS records provided by Google Cloud to your domain registrar.

## SSL Certificate
Google Cloud automatically provides SSL certificates for both App Engine and Cloud Run deployments.

## Monitoring and Analytics

### Enable Monitoring
```bash
gcloud services enable monitoring.googleapis.com
gcloud services enable logging.googleapis.com
```

### View Logs
```bash
# App Engine logs
gcloud app logs tail -s default

# Cloud Run logs (if using Cloud Run)
gcloud logs tail "resource.type=cloud_run_revision"
```

## Performance Optimization

1. **Enable Cloud CDN** (for Cloud Run):
```bash
gcloud compute backend-services create mathematricks-backend \
  --global \
  --load-balancing-scheme=EXTERNAL
```

2. **Enable Compression**: Already configured in the HTML (minified CSS/JS)

3. **Monitor Performance**: Use Google PageSpeed Insights to monitor website performance

## Cost Optimization

- **App Engine**: Free tier includes 28 frontend instance hours per day
- **Cloud Run**: Free tier includes 2 million requests per month
- **Bandwidth**: First 1GB of egress per month is free

## Security Features

1. **HTTPS by Default**: All traffic is automatically encrypted
2. **DDoS Protection**: Built-in protection against DDoS attacks
3. **Identity-Aware Proxy**: Can be enabled for additional security if needed

## Backup and Versioning

### Create Version Backup
```bash
gcloud app versions list
gcloud app deploy --version=backup-$(date +%Y%m%d)
```

### Rollback if Needed
```bash
gcloud app versions list
gcloud app services set-traffic default --splits=VERSION_ID=1
```

## Troubleshooting

- **Deployment Fails**: Check that billing is enabled and APIs are activated
- **404 Errors**: Verify app.yaml routing configuration
- **Slow Loading**: Enable Cloud CDN and optimize images
- **SSL Issues**: Ensure custom domain DNS is properly configured

## Next Steps

1. **Analytics**: Add Google Analytics to track visitor behavior
2. **Contact Form**: Integrate with email service (see email setup guide)
3. **A/B Testing**: Use Google Optimize for testing different versions
4. **SEO**: Submit sitemap to Google Search Console