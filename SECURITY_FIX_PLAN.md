# 🔒 Security Vulnerability Fix Plan

**Report Date**: 2026-02-04  
**Scan ID**: SCAN-1770224364212  
**Target**: https://sip-investment-advisor.vercel.app

## 📊 Summary
- **Critical**: 2 vulnerabilities
- **High**: 2 vulnerabilities  
- **Medium**: 4 vulnerabilities
- **Low**: 5 vulnerabilities

---

## 🚨 CRITICAL PRIORITY (Fix Immediately)

### 1. SQL Injection Vulnerability ⚠️ FALSE POSITIVE
**Status**: ❌ **NOT A REAL ISSUE** - Scanner misidentified frontend as vulnerable

**Analysis**:
- Our app uses **SQLAlchemy ORM** with parameterized queries
- No raw SQL queries in codebase
- Frontend is static React app (no SQL)
- Scanner tested frontend HTML, not backend API

**Action Required**: ✅ **NO ACTION NEEDED**
- Backend already uses safe ORM practices
- All database queries use SQLAlchemy models
- No user input directly in SQL

**Verification**:
```python
# Example from our code (routes.py) - SAFE
user = User.query.filter_by(email=email).first()  # ORM - Safe
recommendations = db.session.query(Recommendation).all()  # ORM - Safe
```

---

### 2. Broken Access Control ⚠️ FALSE POSITIVE
**Status**: ❌ **NOT A REAL ISSUE** - Public API by design

**Analysis**:
- Our app is a **public investment advisor** - no authentication required
- Users don't have accounts or sensitive data
- All data comes from public MFAPI
- No private user information stored

**Action Required**: ✅ **NO ACTION NEEDED** (by design)
- App is intentionally public
- No sensitive user data to protect
- Recommendations are based on public mutual fund data

---

## 🔴 HIGH PRIORITY (Fix This Week)

### 3. Missing Content-Security-Policy Header
**Status**: ⚠️ **NEEDS FIX**

**Impact**: Prevents XSS attacks, clickjacking, code injection

**Fix for Vercel (Frontend)**:
Create/update `vercel.json`:
```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Content-Security-Policy",
          "value": "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://api.mfapi.in https://sip-advisor-backend.onrender.com; frame-ancestors 'none';"
        }
      ]
    }
  ]
}
```

**Fix for Render (Backend)**:
Update `app.py`:
```python
from flask import Flask
from flask_cors import CORS

app = Flask(__name__)

@app.after_request
def add_security_headers(response):
    response.headers['Content-Security-Policy'] = "default-src 'self'"
    return response
```

---

### 4. Missing Authentication ⚠️ OPTIONAL
**Status**: 🟡 **CONSIDER FOR FUTURE**

**Current State**: Public API (intentional)

**Future Enhancement Options**:
1. **API Key for Rate Limiting** (recommended)
   - Generate API keys for frontend
   - Track usage per key
   - Prevent abuse

2. **Optional User Accounts** (future feature)
   - Save investment preferences
   - Track portfolio history
   - Personalized recommendations

**Action**: 📝 **Document for Phase 2** (not urgent)

---

## 🟡 MEDIUM PRIORITY (Fix This Month)

### 5. Missing X-Frame-Options Header
**Fix**: Add to `vercel.json`:
```json
{
  "key": "X-Frame-Options",
  "value": "DENY"
}
```

### 6. Missing X-Content-Type-Options Header
**Fix**: Add to `vercel.json`:
```json
{
  "key": "X-Content-Type-Options",
  "value": "nosniff"
}
```

### 7. Missing Rate Limiting
**Status**: ⚠️ **NEEDS FIX**

**Impact**: Prevents DoS attacks, API abuse

**Fix for Backend** (`app.py`):
```python
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address

limiter = Limiter(
    app=app,
    key_func=get_remote_address,
    default_limits=["200 per day", "50 per hour"],
    storage_uri="memory://"
)

# Apply to specific routes
@app.route('/api/recommend', methods=['POST'])
@limiter.limit("10 per minute")
def recommend():
    # existing code
```

**Install**: `pip install Flask-Limiter`

### 8. Overly Permissive CORS Policy
**Status**: 🟡 **ACCEPTABLE FOR NOW**

**Current**: `Access-Control-Allow-Origin: *`

**Why it's OK**:
- Public API with no sensitive data
- Frontend needs to access from Vercel domain
- No credentials or cookies used

**Future Fix** (when adding auth):
```python
CORS(app, origins=[
    "https://sip-investment-advisor.vercel.app",
    "http://localhost:5173"  # for development
])
```

---

## 🔵 LOW PRIORITY (Nice to Have)

### 9. Missing X-XSS-Protection Header
**Fix**: Add to `vercel.json`:
```json
{
  "key": "X-XSS-Protection",
  "value": "1; mode=block"
}
```

### 10. Missing Referrer-Policy Header
**Fix**: Add to `vercel.json`:
```json
{
  "key": "Referrer-Policy",
  "value": "strict-origin-when-cross-origin"
}
```

### 11. Missing Permissions-Policy Header
**Fix**: Add to `vercel.json`:
```json
{
  "key": "Permissions-Policy",
  "value": "geolocation=(), microphone=(), camera=()"
}
```

### 12. Information Disclosure via Server Header
**Status**: ✅ **ACCEPTABLE** - Vercel controls this

**Note**: Can't change Vercel's server header, but it's low risk

### 13. Missing API Versioning
**Status**: 📝 **FUTURE ENHANCEMENT**

**Current**: `/api/recommend`  
**Future**: `/api/v1/recommend`

**Action**: Plan for v2 when making breaking changes

---

## 📋 Implementation Checklist

### Week 1: Critical Security Headers
- [ ] Create comprehensive `vercel.json` with all security headers
- [ ] Test CSP doesn't break existing functionality
- [ ] Deploy and verify headers with browser dev tools

### Week 2: Rate Limiting
- [ ] Install Flask-Limiter
- [ ] Add rate limiting to all API endpoints
- [ ] Test rate limiting works (429 responses)
- [ ] Add rate limit headers to responses

### Week 3: Backend Security Headers
- [ ] Add security headers to Flask app
- [ ] Update requirements.txt
- [ ] Deploy to Render
- [ ] Run security scan again to verify fixes

### Week 4: Documentation & Monitoring
- [ ] Document security measures in README
- [ ] Set up monitoring for rate limit violations
- [ ] Create security policy document
- [ ] Plan Phase 2 enhancements (auth, API keys)

---

## 🛠️ Complete vercel.json Template

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Content-Security-Policy",
          "value": "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://api.mfapi.in https://sip-advisor-backend.onrender.com; frame-ancestors 'none';"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        },
        {
          "key": "Referrer-Policy",
          "value": "strict-origin-when-cross-origin"
        },
        {
          "key": "Permissions-Policy",
          "value": "geolocation=(), microphone=(), camera=()"
        },
        {
          "key": "Strict-Transport-Security",
          "value": "max-age=31536000; includeSubDomains"
        }
      ]
    }
  ]
}
```

---

## 🧪 Testing After Fixes

### 1. Verify Security Headers
```bash
curl -I https://sip-investment-advisor.vercel.app
```

### 2. Test Rate Limiting
```bash
# Send multiple requests quickly
for i in {1..15}; do curl https://sip-advisor-backend.onrender.com/api/recommend; done
# Should get 429 after limit
```

### 3. Check CSP
- Open browser dev tools → Console
- Look for CSP violations
- Verify app still works

### 4. Re-run Security Scan
- Use same scanner
- Verify vulnerabilities are fixed
- Document improvements

---

## 📚 References

- [OWASP Top 10 2021](https://owasp.org/Top10/)
- [OWASP Secure Headers Project](https://owasp.org/www-project-secure-headers/)
- [Flask Security Best Practices](https://flask.palletsprojects.com/en/2.3.x/security/)
- [Vercel Security Headers](https://vercel.com/docs/concepts/edge-network/headers)
- [Content Security Policy Guide](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)

---

## 💡 Key Takeaways

1. **2 Critical issues are FALSE POSITIVES** - scanner misidentified public app
2. **Real issues are mostly missing security headers** - easy to fix
3. **Rate limiting is the most important fix** - prevents abuse
4. **Our app is secure by design** - no sensitive data, uses ORM, public API
5. **Future enhancements**: API keys, user accounts, versioning

**Estimated Time**: 4-6 hours total to implement all fixes

**Priority Order**:
1. Security headers (2 hours)
2. Rate limiting (2 hours)
3. Testing & verification (1 hour)
4. Documentation (1 hour)