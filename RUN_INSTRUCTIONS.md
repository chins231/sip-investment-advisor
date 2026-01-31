# 🚀 How to Run the SIP Investment Advisor Application

Follow these step-by-step instructions to get your application running.

## Prerequisites

Make sure you have installed:
- Python 3.8 or higher
- Node.js 16 or higher
- npm (comes with Node.js)

Check your versions:
```bash
python3 --version
node --version
npm --version
```

---

## Step-by-Step Instructions

### Step 1: Navigate to Project Directory

```bash
cd /Users/srt231/Desktop/SRT_BOB/stock-sip-advisor
```

---

### Step 2: Setup Backend

#### 2.1 Navigate to Backend Directory
```bash
cd backend
```

#### 2.2 Create Virtual Environment
```bash
python3 -m venv venv
```

#### 2.3 Activate Virtual Environment

**On macOS/Linux:**
```bash
source venv/bin/activate
```

**On Windows:**
```bash
venv\Scripts\activate
```

You should see `(venv)` appear in your terminal prompt.

#### 2.4 Install Python Dependencies
```bash
pip install --upgrade pip
pip install -r requirements.txt
```

This will install Flask, SQLAlchemy, pandas, numpy, and other required packages.

#### 2.5 Start the Backend Server
```bash
python main.py
```

You should see:
```
🚀 Starting SIP Advisor API...
📡 API will be available at http://localhost:5000
 * Running on http://0.0.0.0:5000
```

**✅ Keep this terminal window open!** The backend server needs to keep running.

---

### Step 3: Setup Frontend (Open a NEW Terminal)

#### 3.1 Open a New Terminal Window
Keep the backend terminal running and open a **new terminal window**.

#### 3.2 Navigate to Frontend Directory
```bash
cd /Users/srt231/Desktop/SRT_BOB/stock-sip-advisor/frontend
```

#### 3.3 Install Node Dependencies
```bash
npm install
```

This will install React, Vite, Recharts, Axios, and other required packages.

#### 3.4 Start the Frontend Development Server
```bash
npm run dev
```

You should see:
```
VITE v5.0.8  ready in XXX ms

➜  Local:   http://localhost:3000/
➜  Network: use --host to expose
```

**✅ Keep this terminal window open too!**

---

### Step 4: Access the Application

Open your web browser and go to:
```
http://localhost:3000
```

You should see the SIP Investment Advisor homepage! 🎉

---

## 🎯 Testing the Application

1. **Fill in the form:**
   - Name: Your Name
   - Email: your.email@example.com
   - Risk Profile: Click on "Balanced" (or choose Conservative/Aggressive)
   - Investment Years: 10
   - Monthly Investment: 10000

2. **Click "Get SIP Recommendations"**

3. **View Results:**
   - Portfolio Summary with expected returns
   - Asset Allocation Pie Chart
   - Recommended Mutual Funds
   - Investment Strategy

---

## 🛑 Stopping the Application

To stop the servers:

1. **Stop Frontend**: Go to the frontend terminal and press `CTRL + C`
2. **Stop Backend**: Go to the backend terminal and press `CTRL + C`

---

## 🔄 Restarting the Application

Next time you want to run the app:

**Terminal 1 (Backend):**
```bash
cd /Users/srt231/Desktop/SRT_BOB/stock-sip-advisor/backend
source venv/bin/activate  # On macOS/Linux
python main.py
```

**Terminal 2 (Frontend):**
```bash
cd /Users/srt231/Desktop/SRT_BOB/stock-sip-advisor/frontend
npm run dev
```

---

## 🐛 Troubleshooting

### Problem: "Command not found: python3"
**Solution:** Try using `python` instead of `python3`

### Problem: "Port 5000 already in use"
**Solution:** 
1. Find and kill the process using port 5000:
   ```bash
   lsof -ti:5000 | xargs kill -9
   ```
2. Or change the port in `backend/main.py` (line 40):
   ```python
   app.run(debug=True, host='0.0.0.0', port=5001)
   ```

### Problem: "Module not found" errors
**Solution:** Make sure virtual environment is activated and reinstall:
```bash
source venv/bin/activate
pip install -r requirements.txt
```

### Problem: Frontend won't start
**Solution:** Delete node_modules and reinstall:
```bash
cd frontend
rm -rf node_modules
npm install
npm run dev
```

### Problem: Database errors
**Solution:** Delete and recreate the database:
```bash
cd backend
rm sip_advisor.db
python main.py  # This will recreate the database
```

---

## 📱 Quick Command Reference

### Backend Commands
```bash
# Navigate to backend
cd /Users/srt231/Desktop/SRT_BOB/stock-sip-advisor/backend

# Activate virtual environment (macOS/Linux)
source venv/bin/activate

# Activate virtual environment (Windows)
venv\Scripts\activate

# Start server
python main.py

# Deactivate virtual environment
deactivate
```

### Frontend Commands
```bash
# Navigate to frontend
cd /Users/srt231/Desktop/SRT_BOB/stock-sip-advisor/frontend

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

---

## 🎓 What's Happening Behind the Scenes?

1. **Backend (Port 5000)**: 
   - Flask server handles API requests
   - SQLite database stores user profiles and recommendations
   - Recommendation engine calculates optimal SIP portfolios

2. **Frontend (Port 3000)**:
   - React app provides the user interface
   - Vite serves the development build with hot reload
   - Axios sends requests to the backend API

3. **Communication**:
   - Frontend sends HTTP requests to `http://localhost:5000/api`
   - Backend processes requests and returns JSON responses
   - Frontend displays the results with charts and tables

---

## ✅ Success Checklist

- [ ] Backend server running on http://localhost:5000
- [ ] Frontend server running on http://localhost:3000
- [ ] Can access the application in browser
- [ ] Form accepts input and validates
- [ ] Recommendations are generated successfully
- [ ] Charts and data display correctly

---

## 🎉 You're All Set!

Your SIP Investment Advisor application is now running. Start exploring and getting personalized investment recommendations!

For more details, check:
- **README.md** - Full documentation
- **QUICKSTART.md** - Quick setup guide
- **PROJECT_OVERVIEW.md** - Technical details

Happy Investing! 📈💰