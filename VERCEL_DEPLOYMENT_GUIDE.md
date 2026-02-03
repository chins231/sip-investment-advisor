# Vercel Deployment Guide

## Issue: Automatic Deployments Not Triggering

If Vercel is not automatically deploying after pushing to GitHub, follow these steps:

## Option 1: Manual Deployment via Vercel Dashboard

1. **Go to Vercel Dashboard**
   - Visit: https://vercel.com/dashboard
   - Login with your account

2. **Select Your Project**
   - Find "sip-investment-advisor" project
   - Click on it

3. **Trigger Manual Deployment**
   - Click on "Deployments" tab
   - Click "Redeploy" button on the latest deployment
   - OR click "Deploy" button to create new deployment

## Option 2: Check Git Integration Settings

1. **Go to Project Settings**
   - In your project, click "Settings"
   - Go to "Git" section

2. **Verify Git Integration**
   - Check if GitHub repository is connected
   - Repository should be: `chins231/sip-investment-advisor`
   - Branch should be: `main`

3. **Check Production Branch**
   - Ensure "Production Branch" is set to `main`
   - Enable "Automatically deploy new commits"

4. **Check Ignored Build Step**
   - Go to Settings → Git → Ignored Build Step
   - Make sure it's not set to ignore all builds

## Option 3: Reconnect GitHub Repository

If automatic deployments still don't work:

1. **Disconnect Repository**
   - Settings → Git → Disconnect
   
2. **Reconnect Repository**
   - Click "Connect Git Repository"
   - Select GitHub
   - Choose `chins231/sip-investment-advisor`
   - Select `main` branch

## Option 4: Check Build Settings

1. **Go to Settings → General**
   
2. **Verify Build & Development Settings:**
   ```
   Framework Preset: Vite
   Build Command: cd frontend && npm run build
   Output Directory: frontend/dist
   Install Command: cd frontend && npm install
   ```

3. **Root Directory:**
   - Leave empty (deploy from root)
   - OR set to `frontend` if you want to deploy only frontend folder

## Option 5: Use Vercel CLI (Alternative)

If dashboard doesn't work, use CLI:

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy from project root
cd stock-sip-advisor
vercel --prod
```

## Latest Changes to Deploy

The following changes need to be deployed:

1. **Commit 479a5b5**: Fixed YouTube channel links
   - Freefincal: @pattufreefincal
   - Labour Law Advisor: /labourlawadvisor
   - Asset Yogi: /channel/UCsNxHPbaCWL1tKw2hxGQD6g

2. **Commit 5d9f6b3**: Added vercel.json configuration

## Verify Deployment

After deployment completes:

1. Visit: https://sip-investment-advisor.vercel.app
2. Scroll to bottom "Want to Learn More?" section
3. Click on YouTube links to verify they work
4. All 4 links should open correct YouTube channels

## Troubleshooting

### If deployment fails:

1. **Check Build Logs**
   - Go to Deployments → Click on failed deployment
   - Check "Build Logs" for errors

2. **Common Issues:**
   - Node version mismatch
   - Missing dependencies
   - Build command incorrect
   - Output directory wrong

3. **Fix Build Issues:**
   - Update `package.json` in frontend folder
   - Ensure all dependencies are listed
   - Test build locally: `cd frontend && npm run build`

## Current Deployment Status

- **Repository**: chins231/sip-investment-advisor
- **Branch**: main
- **Latest Commit**: 5d9f6b3
- **Files Changed**: 
  - frontend/src/components/FAQSection.jsx (YouTube links)
  - vercel.json (deployment config)

## Need Help?

If none of these work, you may need to:
1. Check Vercel account permissions
2. Verify GitHub app installation
3. Contact Vercel support

---

**Note**: The changes are already pushed to GitHub. You just need to trigger the Vercel deployment manually or fix the auto-deployment settings.