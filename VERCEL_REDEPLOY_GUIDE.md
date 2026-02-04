# How to Redeploy from Vercel Dashboard

## Step-by-Step Visual Guide

### Step 1: Go to Vercel Dashboard
1. Open your browser
2. Go to: **https://vercel.com/dashboard**
3. Log in if needed

### Step 2: Find Your Project
1. You'll see a list of your projects
2. Look for: **"sip-investment-advisor"** (or similar name)
3. Click on the project name

### Step 3: Go to Deployments Tab
1. At the top of the project page, you'll see tabs:
   - Overview
   - **Deployments** ← Click this
   - Analytics
   - Settings
   - etc.

### Step 4: Find the Latest Deployment
1. You'll see a list of deployments with:
   - Commit message
   - Commit hash (like `a7981b2`)
   - Status (Building, Ready, Error)
   - Time

2. Look for the LATEST deployment with commit `a7981b2`
   - Commit message: "UI Phase 1: Compact radio buttons, 3-level collapsible FAQ..."

### Step 5: Redeploy

**Option A: If deployment exists but failed**
1. Click on the failed deployment
2. You'll see error details
3. Look for a **"Redeploy"** button (usually top-right)
4. Click **"Redeploy"**
5. Confirm if asked

**Option B: If no new deployment triggered**
1. Go back to the Deployments list
2. Find ANY recent deployment
3. Click the **three dots menu (⋮)** on the right side
4. Select **"Redeploy"**
5. Confirm if asked

**Option C: Force new deployment via Git**
If the above doesn't work, trigger a new deployment:
```bash
cd stock-sip-advisor
echo "# Force deploy" >> README.md
git add README.md
git commit -m "Force Vercel deployment"
git push origin main
```

### Step 6: Monitor Deployment
1. After clicking Redeploy, you'll see:
   - **"Queued"** → Waiting to start
   - **"Building"** → Installing dependencies and building
   - **"Deploying"** → Uploading to Vercel's CDN
   - **"Ready"** ✅ → Deployment successful!

2. Building usually takes 1-3 minutes

### Step 7: Visit Your Site
1. Once status shows **"Ready"**
2. Click on the deployment
3. Click **"Visit"** button
4. Or go directly to your production URL

## Common Issues

### Issue: "cd frontend: No such file or directory"
**Solution**: This means Vercel can't find the frontend folder. Check:
1. Is `vercel.json` in the repository root?
2. Does it have the correct `buildCommand`?
3. Try redeploying from the dashboard

### Issue: No new deployment triggered
**Solution**: 
1. Check if GitHub webhook is connected
2. Go to Settings → Git → Check "Connected Git Repository"
3. Or manually redeploy from dashboard

### Issue: Build fails with npm errors
**Solution**:
1. Check if `package.json` exists in frontend folder
2. Check if all dependencies are listed
3. Try clearing Vercel cache (Settings → General → Clear Cache)

## Quick Reference

**Vercel Dashboard**: https://vercel.com/dashboard
**Your Project**: Look for "sip-investment-advisor"
**Latest Commit**: `a7981b2` (UI Phase 1 changes)
**Expected Build Time**: 1-3 minutes

## What to Expect After Deployment

Once deployed successfully, you should see:
- ✅ Compact radio buttons for Risk Profile
- ✅ Compact radio buttons for Fund Selection Mode
- ✅ Three-level collapsible FAQ (categories start closed)
- ✅ Professional navy→teal gradient background
- ✅ Cohesive teal/green color scheme
- ✅ White frosted glass footer
- ✅ 50%+ less scrolling overall

## Need Help?

If deployment keeps failing:
1. Check the error logs in Vercel dashboard
2. Look for specific error messages
3. Share the error details for troubleshooting