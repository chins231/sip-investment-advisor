# 🚀 Simple IntelliJ IDEA Guide (No SDK Setup Required!)

Since you're using IntelliJ IDEA (not PyCharm), you don't need to configure Python SDK. Just use the built-in terminal!

---

## ✅ Easiest Method: Use IntelliJ Terminal Only

### Step 1: Open Project
1. Open IntelliJ IDEA
2. **File → Open**
3. Navigate to: `/Users/srt231/Desktop/SRT_BOB/stock-sip-advisor`
4. Click **Open**

### Step 2: Open Terminal in IntelliJ
- **Mac**: Press `Option+F12` or `Fn+Option+F12`
- **Or**: View → Tool Windows → Terminal
- **Or**: Click "Terminal" tab at bottom of IntelliJ

### Step 3: Split Terminal (Important!)
1. Look at the terminal panel at the bottom
2. Click the **`+`** icon (or split icon) to create a second terminal
3. Now you have 2 terminals side by side

### Step 4: Setup & Run Backend (Left Terminal)

Type these commands one by one:

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip3 install -r requirements.txt
python3 main.py
```

**What you'll see:**
```
🚀 Starting SIP Advisor API...
📡 API will be available at http://localhost:5000
 * Running on http://0.0.0.0:5000
```

✅ **Keep this terminal running!** Don't close it.

### Step 5: Setup & Run Frontend (Right Terminal)

Click on the second terminal and type:

```bash
cd frontend
npm install
npm run dev
```

**What you'll see:**
```
VITE v5.0.8  ready in XXX ms

➜  Local:   http://localhost:3000/
```

✅ **Keep this terminal running too!**

### Step 6: Open Application

Open your browser and go to:
```
http://localhost:3000
```

🎉 **You should see the SIP Investment Advisor app!**

---

## 📸 Visual Guide

### What Your IntelliJ Should Look Like:

```
┌─────────────────────────────────────────────────────┐
│  IntelliJ IDEA - stock-sip-advisor                  │
├─────────────────────────────────────────────────────┤
│  File  Edit  View  Navigate  Code  Analyze  Tools   │
├─────────────────────────────────────────────────────┤
│                                                      │
│  [Your code files here]                             │
│                                                      │
├──────────────────┬──────────────────────────────────┤
│ Terminal 1       │ Terminal 2                       │
│ (Backend)        │ (Frontend)                       │
│                  │                                  │
│ (venv) % python3 │ % npm run dev                    │
│ main.py          │                                  │
│ Running on       │ Local: http://localhost:3000     │
│ :5000            │                                  │
└──────────────────┴──────────────────────────────────┘
```

---

## 🎯 Step-by-Step with Screenshots

### Finding the Terminal:

1. **Look at the bottom of IntelliJ window**
2. You'll see tabs like: "Terminal", "Problems", "TODO", etc.
3. **Click "Terminal"** tab
4. Terminal panel opens at the bottom

### Splitting the Terminal:

1. **Look for icons in the terminal panel** (top-right of terminal)
2. You'll see icons like: `+`, `⊞`, `⚙️`, `×`
3. **Click the `+` icon** or **split icon (⊞)**
4. A new terminal appears next to the first one

### If You Can't Find Split Icon:

**Alternative Method:**
1. Right-click in the terminal area
2. Select "Split Right" or "Split Vertically"
3. Or just open a new terminal tab with `+` and switch between tabs

---

## 🔄 If Something Goes Wrong

### Problem: "python3: command not found"
**Solution:**
```bash
# Check if Python is installed
which python3

# If not found, install Python 3 from python.org
# Then restart IntelliJ
```

### Problem: "npm: command not found"
**Solution:**
```bash
# Check if Node.js is installed
which node

# If not found, install Node.js from nodejs.org
# Then restart IntelliJ
```

### Problem: Terminal not showing
**Solution:**
- View → Tool Windows → Terminal
- Or press `Option+F12` (Mac)

### Problem: Can't split terminal
**Solution:**
- Just use one terminal and switch between tabs
- Or open a new terminal tab with `+` icon

### Problem: Port 5000 already in use
**Solution:**
```bash
# Kill the process using port 5000
lsof -ti:5000 | xargs kill -9

# Then run backend again
python3 main.py
```

---

## 🛑 Stopping the Servers

When you want to stop:

1. **Click on the terminal** (backend or frontend)
2. **Press `Ctrl+C`** (this stops the server)
3. **Repeat for the other terminal**

---

## 🔄 Running Again Later

Next time you want to run the app:

### Terminal 1 (Backend):
```bash
cd /Users/srt231/Desktop/SRT_BOB/stock-sip-advisor/backend
source venv/bin/activate
python3 main.py
```

### Terminal 2 (Frontend):
```bash
cd /Users/srt231/Desktop/SRT_BOB/stock-sip-advisor/frontend
npm run dev
```

---

## 💡 Pro Tips for IntelliJ

### 1. Create a Bookmark
- Right-click on `backend/main.py`
- Select "Add to Favorites"
- Quick access from sidebar

### 2. Use Search
- Press `Cmd+Shift+O` (Mac) to quickly find files
- Type filename and press Enter

### 3. Terminal Shortcuts
- `Option+F12` - Toggle terminal
- `Cmd+T` - New terminal tab
- `Ctrl+C` - Stop running process

### 4. View Both Files
- Drag a file tab to the right edge
- IntelliJ splits the editor
- View backend and frontend code side by side

---

## ✅ Quick Checklist

- [ ] IntelliJ IDEA opened
- [ ] Project folder opened
- [ ] Terminal panel visible at bottom
- [ ] Two terminals created (or tabs)
- [ ] Backend commands run successfully
- [ ] Frontend commands run successfully
- [ ] Backend shows "Running on :5000"
- [ ] Frontend shows "Local: http://localhost:3000"
- [ ] Browser opened to http://localhost:3000
- [ ] Application loads successfully

---

## 🎉 That's It!

You don't need to configure any Python SDK or interpreters in IntelliJ IDEA. Just use the terminal like you would in any other terminal application!

The terminal in IntelliJ is just a regular Mac terminal, so all your normal commands work:
- `python3` ✅
- `pip3` ✅
- `npm` ✅
- `node` ✅

---

## 📞 Need Help?

If you're still stuck:

1. **Check MAC_SETUP_FIX.md** - For Python-specific issues
2. **Check RUN_INSTRUCTIONS.md** - For detailed terminal commands
3. **Try the regular Mac Terminal** - If IntelliJ terminal has issues

The application works the same whether you run it from:
- IntelliJ Terminal ✅
- Mac Terminal ✅
- VSCode Terminal ✅
- Any other terminal ✅

Happy Coding! 🚀