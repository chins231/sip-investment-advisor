# How to Check Deployment Status

## Quick Status Check

### 1. Check Render (Backend) Deployment

**Option A: Via Render Dashboard**
1. Go to https://dashboard.render.com/
2. Click on your service "sip-investment-advisor"
3. Look at the "Events" tab
4. You should see:
   - ✅ "Deploy live" (green) = Successfully deployed
   - 🔄 "Build in progress" (blue) = Currently building
   - ❌ "Deploy failed" (red) = Build failed

**Option B: Test Backend API Directly**
```bash
# Test if backend is responding
curl https://sip-investment-advisor.onrender.com/api/health

# Test new sectors endpoint
curl https://sip-investment-advisor.onrender.com/api/sectors
```

**Expected Response:**
```json
{
  "sectors": [
    {"key": "metal", "name": "Metal & Mining", "description": "..."},
    {"key": "defense", "name": "Defense & Aerospace", "description": "..."},
    ...
  ]
}
```

### 2. Check Vercel (Frontend) Deployment

**Option A: Via Vercel Dashboard**
1. Go to https://vercel.com/dashboard
2. Click on your project "sip-investment-advisor"
3. Look at the "Deployments" tab
4. Latest deployment should show:
   - ✅ "Ready" (green) = Successfully deployed
   - 🔄 "Building" (yellow) = Currently building
   - ❌ "Error" (red) = Build failed

**Option B: Visit Live Site**
1. Go to https://sip-investment-advisor.vercel.app
2. Fill in the form
3. Click "▶ Show Sectors" button
4. You should see 10 sector checkboxes
5. Select a sector and submit
6. Check if "🏢 View Holdings" button appears

## Detailed Build Status Commands

### Check Backend Build Logs (Render)
```bash
# You can view logs in Render dashboard under "Logs" tab
# Or use Render CLI if installed:
render logs -s sip-investment-advisor
```

### Check Frontend Build Logs (Vercel)
```bash
# View in Vercel dashboard under deployment details
# Or use Vercel CLI if installed:
vercel logs https://sip-investment-advisor.vercel.app
```

## Expected Build Times

- **Backend (Render):** 2-5 minutes
  - Installing Python dependencies
  - Building application
  - Starting Gunicorn server

- **Frontend (Vercel):** 1-3 minutes
  - Installing npm packages
  - Building React app with Vite
  - Deploying to CDN

## Troubleshooting

### If Backend Build Fails:
1. Check Render logs for Python errors
2. Verify `requirements.txt` is correct
3. Ensure `sector_funds.py` has no syntax errors
4. Check if Root Directory is set to `backend`

### If Frontend Build Fails:
1. Check Vercel logs for npm/build errors
2. Verify all imports are correct
3. Check if `FundHoldings.jsx` component exists
4. Ensure no TypeScript/JSX syntax errors

### If Builds Succeed but Features Don't Work:
1. Open browser console (F12)
2. Check for JavaScript errors
3. Verify API calls are going to correct URL
4. Test backend endpoints directly with curl

## Manual Verification Checklist

After deployment completes, verify:

- [ ] Backend health endpoint responds: `/api/health`
- [ ] Sectors endpoint returns data: `/api/sectors`
- [ ] Frontend loads without errors
- [ ] "Show Sectors" button appears in form
- [ ] Clicking button reveals 10 sector checkboxes
- [ ] Selecting sectors and submitting works
- [ ] "View Holdings" button appears for sector funds
- [ ] Clicking holdings button shows portfolio data
- [ ] Holdings modal displays top 5 companies
- [ ] Diversification warnings appear correctly

## Current Deployment Info

**Last Commit:** 1edc385
**Commit Message:** "Add sector-specific investment features with portfolio holdings"
**Files Changed:** 8 files (4 backend, 4 frontend)
**Push Time:** Just now
**Expected Completion:** Within 5-10 minutes

## Quick Test URLs

Once deployed, test these:

1. **Backend Health:**
   https://sip-investment-advisor.onrender.com/api/health

2. **Sectors List:**
   https://sip-investment-advisor.onrender.com/api/sectors

3. **Frontend App:**
   https://sip-investment-advisor.vercel.app

4. **Test Holdings (example):**
   https://sip-investment-advisor.onrender.com/api/fund-holdings/Nippon%20India%20ETF%20Metal

## Real-Time Status Check

Run this command to check if services are live:

```bash
# Check backend
echo "Backend Status:"
curl -s -o /dev/null -w "%{http_code}" https://sip-investment-advisor.onrender.com/api/health
echo ""

# Check frontend
echo "Frontend Status:"
curl -s -o /dev/null -w "%{http_code}" https://sip-investment-advisor.vercel.app
echo ""
```

**Expected Output:**
- Backend: 200 (OK)
- Frontend: 200 (OK)

## Need Help?

If builds are taking longer than 10 minutes or failing:
1. Check dashboard logs
2. Verify GitHub repository has latest code
3. Ensure no merge conflicts
4. Try manual redeploy from dashboard