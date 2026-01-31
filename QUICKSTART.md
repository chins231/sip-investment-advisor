# 🚀 Quick Start Guide

Get your SIP Investment Advisor up and running in 5 minutes!

## Prerequisites Check

Before starting, ensure you have:
- ✅ Python 3.8+ installed (`python3 --version`)
- ✅ Node.js 16+ installed (`node --version`)
- ✅ npm installed (`npm --version`)

## Option 1: Automated Setup (Recommended)

### For macOS/Linux:
```bash
cd stock-sip-advisor
chmod +x setup.sh
./setup.sh
```

### For Windows:
Run these commands in PowerShell or Command Prompt:

```bash
cd stock-sip-advisor

# Setup Backend
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
cd ..

# Setup Frontend
cd frontend
npm install
cd ..
```

## Option 2: Manual Setup

### Step 1: Setup Backend

```bash
# Navigate to backend directory
cd stock-sip-advisor/backend

# Create virtual environment
python3 -m venv venv

# Activate virtual environment
# On macOS/Linux:
source venv/bin/activate
# On Windows:
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

### Step 2: Setup Frontend

```bash
# Navigate to frontend directory (from project root)
cd stock-sip-advisor/frontend

# Install dependencies
npm install
```

## Running the Application

You need TWO terminal windows:

### Terminal 1 - Backend Server

```bash
cd stock-sip-advisor/backend

# Activate virtual environment
source venv/bin/activate  # macOS/Linux
# OR
venv\Scripts\activate     # Windows

# Start the server
python main.py
```

You should see:
```
🚀 Starting SIP Advisor API...
📡 API will be available at http://localhost:5000
```

### Terminal 2 - Frontend Server

```bash
cd stock-sip-advisor/frontend

# Start the development server
npm run dev
```

You should see:
```
VITE v5.0.8  ready in XXX ms

➜  Local:   http://localhost:3000/
```

## Access the Application

Open your browser and navigate to:
```
http://localhost:3000
```

## Test the Application

1. **Fill in the form:**
   - Name: John Doe
   - Email: john@example.com
   - Risk Profile: Select "Balanced"
   - Investment Years: 10
   - Monthly Investment: ₹10,000

2. **Click "Get SIP Recommendations"**

3. **View your personalized recommendations!**

## Troubleshooting

### Backend Issues

**Problem:** `ModuleNotFoundError: No module named 'flask'`
**Solution:** Make sure virtual environment is activated and dependencies are installed:
```bash
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install -r requirements.txt
```

**Problem:** `Port 5000 already in use`
**Solution:** Change the port in `backend/main.py`:
```python
app.run(debug=True, host='0.0.0.0', port=5001)  # Change to 5001
```
Also update `frontend/src/services/api.js`:
```javascript
const API_BASE_URL = 'http://localhost:5001/api';
```

### Frontend Issues

**Problem:** `Cannot find module 'react'`
**Solution:** Install dependencies:
```bash
cd frontend
npm install
```

**Problem:** `Port 3000 already in use`
**Solution:** The Vite dev server will automatically use the next available port (3001, 3002, etc.)

### Database Issues

**Problem:** Database errors
**Solution:** Delete the database file and restart:
```bash
cd backend
rm sip_advisor.db
python main.py  # This will recreate the database
```

## API Testing

You can test the API directly using curl:

```bash
# Health check
curl http://localhost:5000/api/health

# Generate recommendations
curl -X POST http://localhost:5000/api/generate-recommendations \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "risk_profile": "medium",
    "investment_years": 10,
    "monthly_investment": 10000
  }'
```

## Next Steps

- 📖 Read the full [README.md](README.md) for detailed documentation
- 🔧 Customize the fund recommendations in `backend/sip_engine.py`
- 🎨 Modify the UI styling in `frontend/src/styles/index.css`
- 🚀 Deploy to production (see README.md for deployment guides)

## Need Help?

- Check the [README.md](README.md) for detailed documentation
- Review the code comments in each file
- Open an issue on GitHub

---

Happy Investing! 📈💰