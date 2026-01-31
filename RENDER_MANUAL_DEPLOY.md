# Manual Render Deployment Guide - URGENT FIX

## Problem
Render is not auto-deploying despite GitHub push. The backend is still running old cached code (version 1.0.0 instead of 2.0.0).

## Solution: Manual Deployment with Cache Clear

### Step 1: Access Render Dashboard
1. Go to https://dashboard.render.com/
2. Log in with your account
3. Find your service: **sip-investment-advisor**

### Step 2: Trigger Manual Deploy with Cache Clear
1. Click on your **sip-investment-advisor** service
2. Click the **"Manual Deploy"** button (top right)
3. Select **"Clear build cache & deploy"** from dropdown
4. Click **"Deploy"**

This will:
- Clear ALL cached files (including .pyc bytecode)
- Pull latest code from GitHub (commit 9801b04)
- Use the new render.yaml configuration
- Delete all __pycache__ directories
- Force fresh Python compilation

### Step 3: Monitor Deployment
Watch the build logs for these key lines:
```
==> Cloning from https://github.com/chins231/sip-investment-advisor...
==> Checking out commit 9801b04...
==> Running build command: cd backend && find . -type f -name '*.pyc' -delete...
==> Build successful
==> Starting service with: cd backend && gunicorn...
```

### Step 4: Verify Fix (After ~5 minutes)
Test the health endpoint:
```
GET https://sip-investment-advisor.onrender.com/api/health
```

**Expected Response:**
```json
{
  "status": "healthy",
  "message": "SIP Advisor API is running",
  "version": "2.0.0",  ← MUST BE 2.0.0!
  "features": ["fund_count_info", "sector_selection", "api_integration"]
}
```

**If still shows version "1.0.0":**
- Something is seriously wrong with Render's deployment
- May need to delete and recreate the service

### Step 5: Test Fund Count Feature
Once version shows 2.0.0:

1. Go to https://sip-investment-advisor.vercel.app/
2. Enter:
   - Monthly SIP: ₹2,000
   - Investment Years: 7
   - Risk Profile: High
   - Max Funds: 15
3. Submit form

**Expected Result:**
- API returns 7 funds (not 15)
- Response includes `fund_count_info` field
- Blue banner appears with message:
  > "Showing 7 out of 15 requested funds based on optimal portfolio diversification for your risk profile."
  > 
  > 💡 "To invest in more funds, consider increasing your SIP amount to at least ₹7,500/month (₹500 minimum per fund)."

## Alternative: Check Auto-Deploy Settings

If manual deploy doesn't work, check these settings:

### In Render Dashboard:
1. Go to your service settings
2. Check **"Auto-Deploy"** is set to **"Yes"**
3. Check **"Branch"** is set to **"main"**
4. Verify **GitHub connection** is active

### Reconnect GitHub (if needed):
1. Settings → GitHub
2. Click "Disconnect"
3. Click "Connect GitHub"
4. Authorize Render
5. Select repository: chins231/sip-investment-advisor

## Why This Happened

**Root Cause:** Python bytecode caching
- Render was caching .pyc files from old deployments
- Even with code changes, Python used cached bytecode
- Our render.yaml now explicitly deletes these files

**The Fix:**
```yaml
buildCommand: "cd backend && find . -type f -name '*.pyc' -delete && find . -type d -name '__pycache__' -exec rm -rf {} + 2>/dev/null || true && pip install -r requirements.txt"
```

This runs BEFORE the app starts, ensuring fresh code every time.

## Need Help?

If manual deploy with cache clear still shows version 1.0.0:
1. Check Render build logs for errors
2. Verify render.yaml is being detected (should see "Using render.yaml" in logs)
3. Consider deleting and recreating the Render service (last resort)

## Quick Commands for Reference

**Check current version:**
```bash
curl https://sip-investment-advisor.onrender.com/api/health
```

**Test recommendations endpoint:**
```bash
curl -X POST https://sip-investment-advisor.onrender.com/api/recommendations \
  -H "Content-Type: application/json" \
  -d '{
    "monthly_sip": 2000,
    "investment_years": 7,
    "risk_profile": "High",
    "max_funds": 15
  }'
```

Look for `fund_count_info` field in response!