# 🧠 Running SIP Investment Advisor from IntelliJ IDEA

Complete guide for running the application in IntelliJ IDEA (or PyCharm).

---

## 🚀 Quick Start for IntelliJ IDEA

### Step 1: Open Project

1. Open IntelliJ IDEA
2. Click **Open** or **File → Open**
3. Navigate to: `/Users/srt231/Desktop/SRT_BOB/stock-sip-advisor`
4. Click **Open**

---

### Step 2: Setup Backend (Python)

#### 2.1 Configure Python Interpreter

1. **Open Project Structure**:
   - Mac: `Cmd+;` or **File → Project Structure**
   - Windows: `Ctrl+Alt+Shift+S`

2. **Add Python SDK**:
   - Click **SDKs** in left panel
   - Click `+` → **Add Python SDK**
   - Select **Virtualenv Environment**
   - Choose **New environment**
   - Location: `/Users/srt231/Desktop/SRT_BOB/stock-sip-advisor/backend/venv`
   - Base interpreter: `/Library/Frameworks/Python.framework/Versions/3.12/bin/python3`
   - Click **OK**

#### 2.2 Install Dependencies

1. **Open Terminal in IntelliJ**: 
   - View → Tool Windows → Terminal
   - Or press: `Alt+F12` (Windows) / `Option+F12` (Mac)

2. **Navigate and Setup**:
   ```bash
   cd backend
   python3 -m venv venv
   source venv/bin/activate
   pip3 install --upgrade pip
   pip3 install -r requirements.txt
   ```

#### 2.3 Create Run Configuration for Backend

1. **Click** the dropdown next to Run button (top-right)
2. **Select** "Edit Configurations..."
3. **Click** `+` → **Python**
4. **Configure**:
   - Name: `Backend Server`
   - Script path: `/Users/srt231/Desktop/SRT_BOB/stock-sip-advisor/backend/main.py`
   - Python interpreter: Select the venv you created
   - Working directory: `/Users/srt231/Desktop/SRT_BOB/stock-sip-advisor/backend`
5. **Click** OK

---

### Step 3: Setup Frontend (Node.js)

#### 3.1 Install Node Dependencies

In IntelliJ Terminal:
```bash
cd frontend
npm install
```

#### 3.2 Create Run Configuration for Frontend

1. **Click** the dropdown next to Run button
2. **Select** "Edit Configurations..."
3. **Click** `+` → **npm**
4. **Configure**:
   - Name: `Frontend Server`
   - Package.json: `/Users/srt231/Desktop/SRT_BOB/stock-sip-advisor/frontend/package.json`
   - Command: `run`
   - Scripts: `dev`
5. **Click** OK

---

### Step 4: Run the Application

#### Option A: Run Both Servers Separately

1. **Start Backend**:
   - Select "Backend Server" from dropdown
   - Click Run button (▶️) or press `Ctrl+R` (Mac) / `Shift+F10` (Windows)
   - Wait for "Running on http://0.0.0.0:5000"

2. **Start Frontend**:
   - Select "Frontend Server" from dropdown
   - Click Run button (▶️)
   - Wait for "Local: http://localhost:3000"

3. **Access Application**:
   - Open browser: `http://localhost:3000`

#### Option B: Use Compound Run Configuration

1. **Edit Configurations** → Click `+` → **Compound**
2. **Name**: `Full Application`
3. **Add**: Select both "Backend Server" and "Frontend Server"
4. **Click** OK
5. **Run**: Select "Full Application" and click Run

Now both servers start together! 🎉

---

## 🔧 Using IntelliJ Terminal

### Open Multiple Terminals

1. **Open Terminal**: `Alt+F12` (Windows) / `Option+F12` (Mac)
2. **Split Terminal**: Click `+` icon or right-click → "Split Right"
3. **Now you have 2 terminals side by side**

### Left Terminal - Backend:
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip3 install -r requirements.txt
python3 main.py
```

### Right Terminal - Frontend:
```bash
cd frontend
npm install
npm run dev
```

---

## 🎯 IntelliJ Keyboard Shortcuts

### Running & Debugging
- `Ctrl+R` (Mac) / `Shift+F10` (Windows) - Run
- `Ctrl+D` (Mac) / `Shift+F9` (Windows) - Debug
- `Cmd+F2` (Mac) / `Ctrl+F2` (Windows) - Stop
- `Cmd+Shift+F10` (Mac) / `Ctrl+Shift+F10` (Windows) - Run context configuration

### Terminal
- `Option+F12` (Mac) / `Alt+F12` (Windows) - Open terminal
- `Cmd+T` (Mac) / `Ctrl+T` (Windows) - New terminal tab

### Navigation
- `Cmd+E` (Mac) / `Ctrl+E` (Windows) - Recent files
- `Cmd+Shift+O` (Mac) / `Ctrl+Shift+N` (Windows) - Go to file
- `Cmd+B` (Mac) / `Ctrl+B` (Windows) - Go to declaration

### Search
- `Cmd+Shift+F` (Mac) / `Ctrl+Shift+F` (Windows) - Find in files
- `Cmd+F` (Mac) / `Ctrl+F` (Windows) - Find in file

---

## 🐛 Debugging in IntelliJ

### Debug Backend:

1. **Set Breakpoints**:
   - Open `backend/main.py` or `backend/routes.py`
   - Click in the gutter (left of line numbers)
   - Red dot appears

2. **Start Debug**:
   - Select "Backend Server" configuration
   - Click Debug button (🐛) or press `Ctrl+D` (Mac) / `Shift+F9` (Windows)

3. **Use Debug Tools**:
   - Step Over: `F8`
   - Step Into: `F7`
   - Resume: `F9`
   - Evaluate Expression: `Alt+F8`

### Debug Frontend:

1. **Install Browser Extension**:
   - Chrome: React Developer Tools
   - Firefox: React DevTools

2. **Use Browser DevTools**:
   - Open browser (F12)
   - Sources tab for JavaScript debugging
   - Console tab for logs

---

## 📁 IntelliJ Project Structure

```
stock-sip-advisor/
├── backend/                 # Python Flask backend
│   ├── venv/               # Virtual environment (auto-created)
│   ├── main.py             # Entry point - Run this!
│   ├── models.py           # Database models
│   ├── routes.py           # API endpoints
│   ├── sip_engine.py       # Recommendation logic
│   └── requirements.txt    # Python dependencies
├── frontend/               # React frontend
│   ├── node_modules/       # Node dependencies (auto-created)
│   ├── src/
│   │   ├── App.jsx         # Main component
│   │   ├── components/     # UI components
│   │   └── services/       # API client
│   └── package.json        # Node dependencies
└── [Documentation files]
```

---

## 🔍 IntelliJ Features to Use

### 1. Code Completion
- IntelliJ provides intelligent code completion
- Press `Ctrl+Space` for suggestions

### 2. Refactoring
- Right-click → Refactor
- Rename: `Shift+F6`
- Extract Method: `Cmd+Alt+M` (Mac) / `Ctrl+Alt+M` (Windows)

### 3. Version Control (Git)
- View → Tool Windows → Git
- Commit: `Cmd+K` (Mac) / `Ctrl+K` (Windows)
- Push: `Cmd+Shift+K` (Mac) / `Ctrl+Shift+K` (Windows)

### 4. Database Tools
- View → Tool Windows → Database
- Connect to SQLite database: `backend/sip_advisor.db`

### 5. HTTP Client
- Tools → HTTP Client → Test RESTful Web Service
- Test your API endpoints directly

---

## 🛠️ IntelliJ Plugins (Recommended)

Install these for better experience:

1. **Python** (if using IntelliJ Ultimate)
2. **JavaScript and TypeScript**
3. **React**
4. **.env files support**
5. **Rainbow Brackets**
6. **GitToolBox**

To install:
- File → Settings → Plugins (Mac: IntelliJ IDEA → Preferences → Plugins)
- Search and install

---

## 🐛 Troubleshooting IntelliJ

### Issue 1: Python interpreter not found
**Solution:**
1. File → Project Structure → SDKs
2. Add Python SDK pointing to: `/Library/Frameworks/Python.framework/Versions/3.12/bin/python3`

### Issue 2: "Cannot run program python"
**Solution:**
- Edit run configuration
- Change interpreter to `python3` explicitly
- Or use the venv interpreter

### Issue 3: Port already in use
**Solution:**
```bash
# In IntelliJ terminal
lsof -ti:5000 | xargs kill -9  # Kill backend
lsof -ti:3000 | xargs kill -9  # Kill frontend
```

### Issue 4: Module not found
**Solution:**
```bash
cd backend
source venv/bin/activate
pip3 install -r requirements.txt
```

### Issue 5: npm install fails
**Solution:**
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
```

---

## 📊 Viewing Logs in IntelliJ

### Backend Logs:
- Run tool window (bottom)
- Shows Flask server output
- API requests and responses

### Frontend Logs:
- Run tool window (separate tab)
- Shows Vite dev server output
- Build information

### Application Logs:
- Browser Console (F12)
- Network tab for API calls

---

## ✅ Quick Checklist for IntelliJ

- [ ] Project opened in IntelliJ
- [ ] Python interpreter configured (venv)
- [ ] Backend dependencies installed
- [ ] Frontend dependencies installed
- [ ] Backend run configuration created
- [ ] Frontend run configuration created
- [ ] Both servers can start
- [ ] Application accessible at http://localhost:3000

---

## 🎉 You're All Set!

Your SIP Investment Advisor is now fully configured in IntelliJ IDEA!

### To Run:
1. Select "Backend Server" → Click Run (▶️)
2. Select "Frontend Server" → Click Run (▶️)
3. Open `http://localhost:3000` in browser

### Or Use Compound Configuration:
1. Select "Full Application" → Click Run (▶️)
2. Both servers start automatically!

---

## 📚 Additional Resources

- **IntelliJ Documentation**: https://www.jetbrains.com/help/idea/
- **Python in IntelliJ**: https://www.jetbrains.com/help/idea/python.html
- **Node.js in IntelliJ**: https://www.jetbrains.com/help/idea/nodejs.html

For more details, check:
- MAC_SETUP_FIX.md - Mac-specific Python issues
- RUN_INSTRUCTIONS.md - Terminal-based instructions
- README.md - Complete documentation

Happy Coding with IntelliJ! 🚀💻