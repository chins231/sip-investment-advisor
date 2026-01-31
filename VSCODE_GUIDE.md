# 🎨 Running SIP Investment Advisor from VSCode

This guide shows you how to run the application directly from Visual Studio Code IDE.

## 📋 Prerequisites

1. **Install VSCode Extensions** (if not already installed):
   - Python (by Microsoft)
   - Pylance
   - ESLint
   - Prettier

2. **Open the Project**:
   - Open VSCode
   - File → Open Folder
   - Navigate to `/Users/srt231/Desktop/SRT_BOB/stock-sip-advisor`
   - Click "Open"

---

## 🚀 Method 1: Using VSCode Tasks (Easiest)

### First Time Setup:

1. **Setup Backend**:
   - Press `Cmd+Shift+P` (Mac) or `Ctrl+Shift+P` (Windows/Linux)
   - Type "Tasks: Run Task"
   - Select "Setup Backend"
   - Wait for installation to complete

2. **Setup Frontend**:
   - Press `Cmd+Shift+P` (Mac) or `Ctrl+Shift+P` (Windows/Linux)
   - Type "Tasks: Run Task"
   - Select "Setup Frontend"
   - Wait for npm install to complete

### Running the Application:

**Option A: Run Both Servers Together** (Recommended)
1. Press `Cmd+Shift+B` (Mac) or `Ctrl+Shift+B` (Windows/Linux)
2. This will start both backend and frontend servers automatically
3. Two terminal panels will open showing both servers

**Option B: Run Servers Separately**
1. Press `Cmd+Shift+P` → "Tasks: Run Task" → "Run Backend Server"
2. Press `Cmd+Shift+P` → "Tasks: Run Task" → "Run Frontend Server"

### Access the Application:
- Open browser: `http://localhost:3000`

---

## 🐍 Method 2: Using VSCode Integrated Terminal

### Step 1: Open Integrated Terminal
- Press `` Ctrl+` `` (backtick) or View → Terminal

### Step 2: Split Terminal
- Click the split terminal icon (⊞) in the terminal panel
- You'll now have two terminal windows

### Step 3: Setup and Run Backend (Left Terminal)
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python main.py
```

### Step 4: Setup and Run Frontend (Right Terminal)
```bash
cd frontend
npm install
npm run dev
```

---

## 🔧 Method 3: Using VSCode Debug Configuration

### Run Backend with Debugger:

1. Open `backend/main.py` in VSCode
2. Press `F5` or click "Run and Debug" in the sidebar
3. Select "Python: Run main.py"
4. Backend will start with debugging enabled

### Run Frontend:
- Use integrated terminal method for frontend (Method 2, Step 4)

---

## 📂 VSCode File Explorer Tips

### Quick Navigation:
- `Cmd+P` (Mac) or `Ctrl+P` (Windows/Linux) - Quick file search
- `Cmd+Shift+E` - Toggle file explorer
- `Cmd+B` - Toggle sidebar

### Important Files to Know:
```
stock-sip-advisor/
├── .vscode/
│   ├── launch.json      # Debug configurations
│   ├── tasks.json       # Task definitions
│   └── settings.json    # Workspace settings
├── backend/
│   ├── main.py          # Start here for backend
│   ├── sip_engine.py    # Recommendation logic
│   └── routes.py        # API endpoints
└── frontend/
    └── src/
        ├── App.jsx      # Main React component
        └── components/  # UI components
```

---

## 🎯 VSCode Shortcuts for This Project

### Running Tasks:
- `Cmd+Shift+B` / `Ctrl+Shift+B` - Run default build task (starts both servers)
- `Cmd+Shift+P` / `Ctrl+Shift+P` - Command palette (access all tasks)

### Terminal:
- `` Ctrl+` `` - Toggle terminal
- `Cmd+Shift+5` / `Ctrl+Shift+5` - Split terminal
- `Cmd+\` / `Ctrl+\` - Split editor

### Debugging:
- `F5` - Start debugging
- `Shift+F5` - Stop debugging
- `F9` - Toggle breakpoint
- `F10` - Step over
- `F11` - Step into

### File Navigation:
- `Cmd+P` / `Ctrl+P` - Quick open file
- `Cmd+Shift+F` / `Ctrl+Shift+F` - Search in files
- `Cmd+Click` / `Ctrl+Click` - Go to definition

---

## 🔍 Viewing Logs in VSCode

### Backend Logs:
- Look for the terminal panel labeled "Run Backend Server"
- You'll see Flask startup messages and API requests

### Frontend Logs:
- Look for the terminal panel labeled "Run Frontend Server"
- You'll see Vite dev server messages

### Browser Console:
- Open browser DevTools (F12)
- Check Console tab for frontend errors
- Check Network tab for API calls

---

## 🛑 Stopping the Servers

### From VSCode Terminal:
1. Click on the terminal panel
2. Press `Ctrl+C` to stop the server
3. Repeat for both backend and frontend terminals

### From Task Manager:
- Click the trash icon (🗑️) next to the terminal name

---

## 🐛 Troubleshooting in VSCode

### Problem: Python interpreter not found
**Solution:**
1. Press `Cmd+Shift+P` / `Ctrl+Shift+P`
2. Type "Python: Select Interpreter"
3. Choose the one in `backend/venv/bin/python`

### Problem: Terminal shows "command not found"
**Solution:**
1. Make sure you're in the correct directory
2. Check if virtual environment is activated (you should see `(venv)` in terminal)
3. Try restarting VSCode

### Problem: Port already in use
**Solution:**
1. Open terminal in VSCode
2. Kill the process:
   ```bash
   lsof -ti:5000 | xargs kill -9  # For backend
   lsof -ti:3000 | xargs kill -9  # For frontend
   ```

### Problem: Module not found errors
**Solution:**
1. Open terminal in backend directory
2. Activate venv: `source venv/bin/activate`
3. Reinstall: `pip install -r requirements.txt`

---

## 💡 Pro Tips for VSCode

1. **Use Workspace**:
   - File → Save Workspace As → "SIP-Advisor.code-workspace"
   - This saves your window layout and settings

2. **Multi-cursor Editing**:
   - `Cmd+D` / `Ctrl+D` - Select next occurrence
   - `Cmd+Shift+L` / `Ctrl+Shift+L` - Select all occurrences

3. **Zen Mode**:
   - `Cmd+K Z` / `Ctrl+K Z` - Distraction-free coding

4. **Integrated Git**:
   - Source Control panel (Cmd+Shift+G / Ctrl+Shift+G)
   - Commit, push, pull directly from VSCode

5. **Extensions to Install**:
   - Python
   - ESLint
   - Prettier
   - GitLens
   - Auto Rename Tag
   - Path Intellisense

---

## 📊 Monitoring in VSCode

### Watch Variables (Python):
1. Set breakpoint in `backend/main.py`
2. Press F5 to start debugging
3. Use Debug panel to watch variables

### React DevTools:
1. Install React Developer Tools browser extension
2. Open browser DevTools
3. Use React tab to inspect components

---

## ✅ Quick Checklist

- [ ] VSCode opened with project folder
- [ ] Python extension installed
- [ ] Backend virtual environment created
- [ ] Backend dependencies installed
- [ ] Frontend dependencies installed
- [ ] Both servers running in split terminals
- [ ] Browser opened to http://localhost:3000
- [ ] Application working correctly

---

## 🎉 You're Ready!

Now you can develop and run the SIP Investment Advisor directly from VSCode with:
- ✅ Integrated debugging
- ✅ Code completion
- ✅ Git integration
- ✅ Terminal management
- ✅ Task automation

Happy coding! 💻📈