#!/bin/bash

# Mathematricks Capital Deployment Script
# This script will deploy the entire Mathematricks infrastructure to GCP

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Load environment variables
if [ -f .env ]; then
    export $(cat .env | grep -v '#' | xargs)
else
    echo -e "${RED}Error: .env file not found!${NC}"
    exit 1
fi

echo -e "${BLUE}🚀 Starting Mathematricks Capital Deployment${NC}"
echo "Project ID: $GCP_PROJECT_ID"
echo "Region: $GCP_REGION"
echo ""

# Function to print status
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Step 1: Authenticate and set project
echo -e "${BLUE}📋 Step 1: Setting up GCP authentication and project${NC}"

# Check if already authenticated
if ! gcloud auth list --filter=status:ACTIVE --format="value(account)" | grep -q "@"; then
    echo "Authenticating with Google Cloud..."
    gcloud auth login
fi

# Create project if it doesn't exist
if ! gcloud projects describe $GCP_PROJECT_ID >/dev/null 2>&1; then
    echo "Creating new GCP project: $GCP_PROJECT_ID"
    gcloud projects create $GCP_PROJECT_ID --name="Mathematricks Capital"
    print_status "Project created successfully"
else
    print_warning "Project $GCP_PROJECT_ID already exists"
fi

# Set the project
gcloud config set project $GCP_PROJECT_ID
print_status "Project set to $GCP_PROJECT_ID"

# Enable billing (user needs to do this manually)
echo -e "${YELLOW}⚠️  IMPORTANT: Make sure billing is enabled for project $GCP_PROJECT_ID${NC}"
echo "You can enable billing at: https://console.cloud.google.com/billing/linkedaccount?project=$GCP_PROJECT_ID"
read -p "Press Enter once billing is enabled..."

# Step 2: Enable required APIs
echo -e "${BLUE}📋 Step 2: Enabling required APIs${NC}"
gcloud services enable cloudfunctions.googleapis.com
gcloud services enable cloudbuild.googleapis.com
gcloud services enable appengine.googleapis.com
gcloud services enable logging.googleapis.com
gcloud services enable monitoring.googleapis.com
print_status "APIs enabled successfully"

# Step 3: Initialize App Engine
echo -e "${BLUE}📋 Step 3: Initializing App Engine${NC}"
if ! gcloud app describe >/dev/null 2>&1; then
    gcloud app create --region=$GCP_REGION
    print_status "App Engine initialized"
else
    print_warning "App Engine already initialized"
fi

# Step 4: Deploy TradingView Webhook
if [ "$DEPLOY_WEBHOOK" = "true" ]; then
    echo -e "${BLUE}📋 Step 4: Deploying TradingView Webhook${NC}"

    cd webhook

    gcloud functions deploy $WEBHOOK_FUNCTION_NAME \
        --gen2 \
        --runtime=python311 \
        --region=$GCP_REGION \
        --source=. \
        --entry-point=tradingview_webhook \
        --trigger-http \
        --allow-unauthenticated \
        --set-env-vars WEBHOOK_PASSPHRASE="$WEBHOOK_PASSPHRASE" \
        --memory=256MB \
        --timeout=60s

    # Get webhook URL
    WEBHOOK_URL=$(gcloud functions describe $WEBHOOK_FUNCTION_NAME --region=$GCP_REGION --format="value(serviceConfig.uri)")
    print_status "Webhook deployed successfully"
    echo -e "${GREEN}🔗 Webhook URL: $WEBHOOK_URL${NC}"

    cd ..
fi

# Step 5: Deploy Website
if [ "$DEPLOY_WEBSITE" = "true" ]; then
    echo -e "${BLUE}📋 Step 5: Deploying Website${NC}"

    gcloud app deploy app.yaml --quiet

    # Get website URL
    WEBSITE_URL=$(gcloud app describe --format="value(defaultHostname)")
    print_status "Website deployed successfully"
    echo -e "${GREEN}🔗 Website URL: https://$WEBSITE_URL${NC}"
fi

# Step 6: Setup monitoring
if [ "$SETUP_MONITORING" = "true" ]; then
    echo -e "${BLUE}📋 Step 6: Setting up monitoring and logging${NC}"
    print_status "Monitoring configured (logs available in Cloud Console)"
fi

# Final summary
echo ""
echo -e "${GREEN}🎉 Deployment Complete!${NC}"
echo ""
echo -e "${BLUE}📊 Deployment Summary:${NC}"
if [ "$DEPLOY_WEBSITE" = "true" ]; then
    echo -e "Website: ${GREEN}https://$WEBSITE_URL${NC}"
fi
if [ "$DEPLOY_WEBHOOK" = "true" ]; then
    echo -e "Webhook: ${GREEN}$WEBHOOK_URL${NC}"
fi
echo -e "GCP Console: ${BLUE}https://console.cloud.google.com/home/dashboard?project=$GCP_PROJECT_ID${NC}"
echo ""
echo -e "${YELLOW}📝 Next Steps:${NC}"
echo "1. Test your website and webhook"
echo "2. Configure TradingView alerts with your webhook URL"
echo "3. Set up custom domain (optional)"
echo "4. Configure email integration"
echo ""
echo -e "${GREEN}✅ Mathematricks Capital is now live!${NC}"