# CI/CD Setup Guide for Mathematricks Capital

## Overview
This project uses GitHub Actions for continuous integration and deployment to Google Cloud Platform.

## Workflows

### 1. Production Deployment (`deploy-production.yml`)
- **Trigger**: Push to `main` branch or manual dispatch
- **Actions**:
  - Run tests and validation
  - Deploy webhook to Cloud Functions
  - Deploy website to App Engine
  - Verify deployments

### 2. Pull Request Testing (`test-pr.yml`)
- **Trigger**: Pull requests to `main` branch
- **Actions**:
  - Code validation and linting
  - Webhook function testing
  - HTML structure validation
  - Security checks
  - Deployment readiness verification

## Required GitHub Secrets

To set up the CI/CD pipeline, you need to configure these secrets in your GitHub repository:

### 1. `GCP_SA_KEY`
**Service Account Key for GCP authentication**

Steps to create:
1. Go to [GCP Console > IAM & Admin > Service Accounts](https://console.cloud.google.com/iam-admin/serviceaccounts)
2. Create a new service account: `github-actions-sa`
3. Grant these roles:
   - Cloud Functions Admin
   - App Engine Admin
   - Service Account User
   - Cloud Build Service Account
   - Storage Admin
4. Create and download JSON key
5. Copy the entire JSON content to GitHub secret `GCP_SA_KEY`

### 2. `WEBHOOK_PASSPHRASE`
**Webhook security passphrase**

- Set this to your production webhook passphrase
- Example: `Math2024!Tr@ding$Secure` (change from "yahoo123")

## Setting up GitHub Secrets

1. Go to your GitHub repository
2. Navigate to **Settings** > **Secrets and variables** > **Actions**
3. Click **New repository secret**
4. Add each secret:

```
Name: GCP_SA_KEY
Value: [entire JSON content from service account key file]

Name: WEBHOOK_PASSPHRASE
Value: [your secure passphrase]
```

## Deployment Process

### Automatic Deployment
1. **Make changes** to your code
2. **Create Pull Request** → Triggers tests
3. **Merge to main** → Triggers production deployment
4. **Monitor** deployment in Actions tab

### Manual Deployment
1. Go to **Actions** tab in GitHub
2. Select **Deploy to Production** workflow
3. Click **Run workflow**
4. Choose branch and click **Run workflow**

## Branch Strategy

### Recommended Git Flow:
```
main (production)
├── develop (integration)
├── feature/new-feature
└── hotfix/urgent-fix
```

### Workflow:
1. **Feature development**: Create feature branches from `develop`
2. **Pull Requests**: Merge features to `develop` → triggers tests
3. **Production release**: Merge `develop` to `main` → triggers deployment
4. **Hotfixes**: Create from `main`, merge back to both `main` and `develop`

## Environment Configuration

### Production Environment Variables:
- `GCP_PROJECT_ID`: mathematricks-website
- `GCP_REGION`: us-east4
- `WEBHOOK_FUNCTION_NAME`: tradingview-webhook
- `WEBSITE_SERVICE_NAME`: mathematricks-website

## Monitoring Deployments

### GitHub Actions Dashboard:
- View deployment status in repository **Actions** tab
- Check logs for each deployment step
- Monitor success/failure notifications

### GCP Console Monitoring:
- **Cloud Functions**: Monitor webhook performance
- **App Engine**: Monitor website traffic and performance
- **Cloud Logging**: View application logs
- **Cloud Monitoring**: Set up alerts and dashboards

## Security Best Practices

### Secrets Management:
- ✅ Never commit `.env` files
- ✅ Use GitHub Secrets for sensitive data
- ✅ Rotate service account keys regularly
- ✅ Use strong webhook passphrases

### Access Control:
- ✅ Limit service account permissions
- ✅ Use branch protection rules
- ✅ Require PR reviews for main branch
- ✅ Enable signed commits

## Troubleshooting

### Common Issues:

**1. Deployment fails with authentication error**
- Check `GCP_SA_KEY` secret is properly set
- Verify service account has required permissions
- Ensure billing is enabled on GCP project

**2. Webhook deployment fails**
- Check `WEBHOOK_PASSPHRASE` secret is set
- Verify Cloud Functions API is enabled
- Check webhook code syntax

**3. Website deployment fails**
- Verify App Engine API is enabled
- Check `app.yaml` configuration
- Ensure HTML file is valid

### Getting Help:
1. Check **Actions** logs for detailed error messages
2. Review **GCP Console** logs
3. Verify all secrets are properly configured
4. Test deployments manually using `deploy.sh`

## Cost Optimization

### Free Tier Usage:
- **GitHub Actions**: 2,000 minutes/month free
- **Cloud Functions**: 2M requests/month free
- **App Engine**: 28 instance hours/day free
- **Cloud Build**: 120 build minutes/day free

### Monitoring Costs:
- Set up billing alerts in GCP Console
- Monitor usage in GitHub Actions settings
- Optimize build times to reduce costs

## Next Steps

1. **Set up GitHub repository** and push code
2. **Configure GitHub Secrets** as described above
3. **Test CI/CD pipeline** with a test commit
4. **Set up branch protection** rules
5. **Configure monitoring** alerts
6. **Document team deployment** processes

---

## Quick Start Checklist

- [ ] Create GitHub repository
- [ ] Push code to repository
- [ ] Create GCP service account
- [ ] Add `GCP_SA_KEY` to GitHub Secrets
- [ ] Add `WEBHOOK_PASSPHRASE` to GitHub Secrets
- [ ] Test deployment with first commit to main
- [ ] Verify website and webhook are live
- [ ] Set up monitoring and alerts

**Your Mathematricks Capital CI/CD pipeline is ready! 🚀**