# 🍎 Mac-Specific Setup & Python Fix for VSCode

## Problem: "python is not defined" in VSCode Terminal

This happens because VSCode's integrated terminal may not have Python in its PATH. Here's how to fix it:

---

## ✅ Solution 1: Use python3 instead of python

On Mac, Python 3 is accessed via `python3` command, not `python`.

### In VSCode Terminal:
```bash
# Instead of: python
# Use: python3

python3 --version  # This should work
```

### Updated Commands for Mac:

**Backend Setup:**
```bash
cd stock-sip-advisor/backend
python3 -m venv venv
source venv/bin/activate
pip3 install -r requirements.txt
python3 main.py
```

---

## ✅ Solution 2: Fix VSCode Terminal Shell

### Step 1: Check Your Shell
```bash
echo $SHELL
```

### Step 2: Add Python to PATH

**If using zsh (default on Mac):**

1. Open terminal in VSCode (`` Ctrl+` ``)
2. Edit your zsh config:
   ```bash
   nano ~/.zshrc
   ```
3. Add this line at the end:
   ```bash
   export PATH="/Library/Frameworks/Python.framework/Versions/3.12/bin:$PATH"
   ```
4. Save: `Ctrl+O`, Enter, then `Ctrl+X`
5. Reload:
   ```bash
   source ~/.zshrc
   ```

**If using bash:**

1. Edit bash profile:
   ```bash
   nano ~/.bash_profile
   ```
2. Add the same PATH line
3. Reload:
   ```bash
   source ~/.bash_profile
   ```

### Step 3: Restart VSCode
- Quit VSCode completely (Cmd+Q)
- Reopen VSCode
- Open integrated terminal
- Test: `python3 --version`

---

## ✅ Solution 3: Create Python Alias (Optional)

If you want to use `python` instead of `python3`:

1. Edit your shell config:
   ```bash
   nano ~/.zshrc  # or ~/.bash_profile
   ```

2. Add this line:
   ```bash
   alias python=python3
   alias pip=pip3
   ```

3. Reload:
   ```bash
   source ~/.zshrc  # or source ~/.bash_profile
   ```

4. Now you can use `python` command

---

## 🚀 Quick Start for Mac (Updated)

### Method 1: Using VSCode Terminal

1. **Open VSCode**
   - Open folder: `/Users/srt231/Desktop/SRT_BOB/stock-sip-advisor`

2. **Open Terminal**: Press `` Ctrl+` ``

3. **Split Terminal**: Click split icon (⊞)

4. **Left Terminal - Backend**:
   ```bash
   cd backend
   python3 -m venv venv
   source venv/bin/activate
   pip3 install -r requirements.txt
   python3 main.py
   ```

5. **Right Terminal - Frontend**:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

6. **Access**: `http://localhost:3000`

---

## 🔧 VSCode Python Extension Setup

### Step 1: Install Python Extension
1. Open Extensions (Cmd+Shift+X)
2. Search "Python"
3. Install "Python" by Microsoft

### Step 2: Select Python Interpreter
1. Press `Cmd+Shift+P`
2. Type: "Python: Select Interpreter"
3. Choose: `/Library/Frameworks/Python.framework/Versions/3.12/bin/python3`
4. Or choose: `./backend/venv/bin/python` (after creating venv)

### Step 3: Verify
1. Open `backend/main.py`
2. Bottom-left corner should show: "Python 3.12.5"

---

## 📝 Updated VSCode Tasks for Mac

I've updated the tasks to use `python3` specifically for Mac. The tasks will now work correctly.

---

## 🧪 Test Your Setup

Run these commands in VSCode terminal:

```bash
# Test Python
python3 --version
# Should show: Python 3.12.5

# Test pip
pip3 --version
# Should show pip version

# Test Node
node --version
# Should show Node version

# Test npm
npm --version
# Should show npm version
```

If all commands work, you're ready to go! ✅

---

## 🎯 Complete Mac Setup Script

Save this as a script or run line by line:

```bash
#!/bin/bash

# Navigate to project
cd /Users/srt231/Desktop/SRT_BOB/stock-sip-advisor

# Setup Backend
cd backend
python3 -m venv venv
source venv/bin/activate
pip3 install --upgrade pip
pip3 install -r requirements.txt
echo "✅ Backend setup complete!"

# Setup Frontend
cd ../frontend
npm install
echo "✅ Frontend setup complete!"

echo ""
echo "🎉 Setup Complete!"
echo ""
echo "To run the application:"
echo "1. Terminal 1: cd backend && source venv/bin/activate && python3 main.py"
echo "2. Terminal 2: cd frontend && npm run dev"
echo "3. Open: http://localhost:3000"
```

---

## 🐛 Common Mac Issues & Fixes

### Issue 1: "xcrun: error: invalid active developer path"
**Fix:**
```bash
xcode-select --install
```

### Issue 2: "Permission denied"
**Fix:**
```bash
chmod +x setup.sh
```

### Issue 3: "pip: command not found"
**Fix:**
```bash
python3 -m pip install --upgrade pip
# Then use: python3 -m pip install -r requirements.txt
```

### Issue 4: "Port 5000 already in use" (AirPlay on Mac)
**Fix Option 1:** Disable AirPlay Receiver
- System Preferences → Sharing → Uncheck "AirPlay Receiver"

**Fix Option 2:** Use different port
- Edit `backend/main.py` line 40:
  ```python
  app.run(debug=True, host='0.0.0.0', port=5001)
  ```
- Edit `frontend/src/services/api.js` line 3:
  ```javascript
  const API_BASE_URL = 'http://localhost:5001/api';
  ```

---

## ✅ Verification Checklist

- [ ] Python 3.12.5 installed and accessible
- [ ] `python3 --version` works in VSCode terminal
- [ ] Node.js and npm installed
- [ ] VSCode Python extension installed
- [ ] Python interpreter selected in VSCode
- [ ] Virtual environment created in backend folder
- [ ] Dependencies installed (backend and frontend)
- [ ] Both servers can start without errors
- [ ] Application accessible at http://localhost:3000

---

## 🎉 You're Ready!

Once all checks pass, you can run the application using any of the methods in VSCODE_GUIDE.md, just remember to use `python3` instead of `python` on Mac!

For any other issues, check:
- RUN_INSTRUCTIONS.md
- VSCODE_GUIDE.md
- QUICKSTART.md