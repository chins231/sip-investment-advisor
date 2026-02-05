# 🚀 Deploy Security Fixes - Quick Guide

**Date**: 2026-02-05  
**Changes**: Security headers, rate limiting, input validation

## 📋 Pre-Deployment Checklist

- [x] Security headers added to vercel.json
- [x] Flask-Limiter added to requirements.txt
- [x] Rate limiting implemented in backend
- [x] Security headers added to Flask
- [x] Input validation enhanced
- [x] Python syntax validated (no errors)
- [ ] Backend dependencies installed locally
- [ ] Backend tested locally
- [ ] Deployed to Render
- [ ] Deployed to Vercel
- [ ] Security headers verified

---

## 🔧 Step 1: Install Backend Dependencies Locally

```bash
cd stock-sip-advisor/backend

# Create/activate virtual environment (if not already)
python3 -m venv venv
source venv/bin/activate  # On Mac/Linux
# OR
venv\Scripts\activate  # On Windows

# Install new dependencies
pip install -r requirements.txt

# Verify Flask-Limiter is installed
pip list | grep Flask-Limiter
```

Expected output: `Flask-Limiter    3.5.0`

---

## 🧪 Step 2: Test Backend Locally

```bash
# Make sure you're in backend directory with venv activated
cd stock-sip-advisor/backend
source venv/bin/activate

# Run the server
python3 main.py
```

Expected output:
```
✅ Database tables created successfully!
🚀 Starting SIP Advisor API...
📡 API will be available at http://localhost:5001
```

### Test Security Headers

Open a new terminal:
```bash
curl -I http://localhost:5001/api/health
```

Look for these headers:
- `Content-Security-Policy`
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`

### Test Rate Limiting

```bash
# Send 15 requests quickly
for i in {1..15}; do 
  curl http://localhost:5001/api/health
  echo ""
done
```

After ~10 requests, you should see rate limit headers:
- `X-RateLimit-Limit`
- `X-RateLimit-Remaining`
- `X-RateLimit-Reset`

After 100 requests in a minute, you'll get `429 Too Many Requests`

### Test Input Validation

```bash
# Test invalid email
curl -X POST http://localhost:5001/api/generate-recommendations \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "invalid-email",
    "risk_profile": "medium",
    "investment_years": 5,
    "monthly_investment": 5000
  }'
```

Expected: `{"error": "Invalid email format"}`

```bash
# Test invalid investment amount
curl -X POST http://localhost:5001/api/generate-recommendations \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "test@test.com",
    "risk_profile": "medium",
    "investment_years": 5,
    "monthly_investment": 100
  }'
```

Expected: `{"error": "Monthly investment must be between 500 and 10,000,000"}`

---

## 🌐 Step 3: Deploy to Render (Backend)

### Option A: Automatic Deployment (Recommended)

1. **Commit and push changes**:
   ```bash
   cd stock-sip-advisor
   git add .
   git commit -m "Add security fixes: headers, rate limiting, input validation"
   git push origin main
   ```

2. **Render auto-deploys** from GitHub
   - Go to: https://dashboard.render.com
   - Find your service: `sip-advisor-backend`
   - Watch the deployment logs
   - Wait for "Live" status

### Option B: Manual Deployment

1. Go to Render Dashboard
2. Select `sip-advisor-backend` service
3. Click "Manual Deploy" → "Deploy latest commit"
4. Wait for deployment to complete

### Verify Deployment

```bash
# Check if backend is live
curl -I https://sip-advisor-backend.onrender.com/api/health
```

Look for security headers in the response.

---

## 🎨 Step 4: Deploy to Vercel (Frontend)

### Option A: Automatic Deployment (Recommended)

If you already pushed to GitHub in Step 3:
- Vercel auto-deploys on push to main
- Check: https://vercel.com/dashboard
- Wait for deployment to complete

### Option B: Manual Deployment

```bash
cd stock-sip-advisor/frontend

# Install Vercel CLI if not installed
npm install -g vercel

# Deploy
vercel --prod
```

### Verify Deployment

```bash
curl -I https://sip-investment-advisor.vercel.app
```

Look for these headers:
- `Content-Security-Policy`
- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- `X-XSS-Protection: 1; mode=block`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy`
- `Strict-Transport-Security`

---

## ✅ Step 5: Verify Everything Works

### 1. Test Frontend

Visit: https://sip-investment-advisor.vercel.app

- Fill out the investment form
- Submit recommendations
- Check browser console for errors
- Verify no CSP violations

### 2. Test Backend API

```bash
# Test recommendation generation
curl -X POST https://sip-advisor-backend.onrender.com/api/generate-recommendations \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "risk_profile": "medium",
    "investment_years": 5,
    "monthly_investment": 5000
  }'
```

Should return recommendations with 200 status.

### 3. Test Rate Limiting (Production)

```bash
# Send multiple requests
for i in {1..12}; do 
  curl -X POST https://sip-advisor-backend.onrender.com/api/generate-recommendations \
    -H "Content-Type: application/json" \
    -d '{
      "name": "Test",
      "email": "test@test.com",
      "risk_profile": "medium",
      "investment_years": 5,
      "monthly_investment": 5000
    }'
  echo ""
  sleep 1
done
```

After 10 requests, should get 429 status.

---

## 🔍 Step 6: Run Security Scan (Optional)

Use the same security scanner from before:
- Visit: https://pentest-tools.com/website-vulnerability-scanning/website-scanner
- Enter: https://sip-investment-advisor.vercel.app
- Run scan
- Compare with previous results

Expected improvements:
- ✅ Missing security headers: FIXED
- ✅ Rate limiting: IMPLEMENTED
- ✅ Input validation: ENHANCED

---

## 🐛 Troubleshooting

### Backend won't start locally

```bash
# Check if Flask-Limiter is installed
pip list | grep Flask-Limiter

# If not, reinstall
pip install -r requirements.txt
```

### Rate limiting not working

Check that limiter is imported in routes.py:
```python
from main import limiter
```

### Security headers not showing

**Frontend (Vercel)**:
- Check vercel.json is in root directory
- Redeploy: `vercel --prod`
- Clear browser cache

**Backend (Render)**:
- Check main.py has `@app.after_request` decorator
- Redeploy from Render dashboard
- Test with curl (not browser)

### CSP blocking resources

If frontend breaks:
1. Open browser console
2. Look for CSP violations
3. Update CSP in vercel.json to allow the blocked resource
4. Redeploy

---

## 📊 Success Criteria

✅ Backend starts without errors  
✅ Security headers present in responses  
✅ Rate limiting works (429 after limit)  
✅ Input validation rejects invalid data  
✅ Frontend loads and works correctly  
✅ No CSP violations in browser console  
✅ API endpoints respond correctly  
✅ Security scan shows improvements  

---

## 📝 Post-Deployment Tasks

1. **Update documentation**:
   - Mark security fixes as deployed in SECURITY_FIX_PLAN.md
   - Update CURRENT_STATUS.md

2. **Monitor for issues**:
   - Check Render logs for errors
   - Check Vercel logs for errors
   - Monitor rate limit violations

3. **Create session notes**:
   - Document what was done
   - Note any issues encountered
   - Plan next steps

---

## 🎯 Next Steps (Future)

1. **API Keys**: Implement API key authentication
2. **User Accounts**: Add optional user registration
3. **Enhanced Monitoring**: Set up alerts for security events
4. **API Versioning**: Add /api/v1/ prefix
5. **CORS Restriction**: Limit to specific domains

---

## 📞 Need Help?

- Check logs: Render Dashboard → Logs
- Check logs: Vercel Dashboard → Deployments → Logs
- Review: SECURITY_IMPLEMENTATION.md
- Review: SECURITY_FIX_PLAN.md

---

**Status**: Ready for deployment! 🚀