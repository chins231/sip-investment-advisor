# ✅ EXACT Commands to Type (Copy These!)

## ⚠️ IMPORTANT: Don't copy the ```bash lines!

When you see code blocks in markdown files, **DON'T copy the ```bash or ``` lines**.
Only copy the actual commands!

---

## 🚀 Step-by-Step Commands for Mac

### Step 1: Open Terminal in IntelliJ
- Press: `Option+F12` or `Fn+Option+F12`
- Or click "Terminal" at the bottom

### Step 2: Navigate to Backend
Type this command and press Enter:
```
cd backend
```

### Step 3: Create Virtual Environment
Type this command and press Enter:
```
python3 -m venv venv
```
Wait for it to finish (takes 10-20 seconds)

### Step 4: Activate Virtual Environment
Type this command and press Enter:
```
source venv/bin/activate
```
You should see `(venv)` appear in your terminal prompt

### Step 5: Upgrade pip
Type this command and press Enter:
```
pip3 install --upgrade pip
```

### Step 6: Install Dependencies
Type this command and press Enter:
```
pip3 install -r requirements.txt
```
This takes 1-2 minutes. Wait for it to complete.

### Step 7: Start Backend Server
Type this command and press Enter:
```
python3 main.py
```

You should see:
```
🚀 Starting SIP Advisor API...
📡 API will be available at http://localhost:5000
 * Running on http://0.0.0.0:5000
```

✅ **Backend is running! Keep this terminal open!**

---

## 🎨 Frontend Commands (New Terminal)

### Step 8: Open Second Terminal
- Click the `+` icon in terminal panel
- Or open a new terminal tab

### Step 9: Navigate to Frontend
Type this command and press Enter:
```
cd frontend
```

### Step 10: Install Node Modules
Type this command and press Enter:
```
npm install
```
This takes 1-2 minutes. Wait for it to complete.

### Step 11: Start Frontend Server
Type this command and press Enter:
```
npm run dev
```

You should see:
```
VITE v5.0.8  ready in XXX ms

➜  Local:   http://localhost:3000/
```

✅ **Frontend is running! Keep this terminal open too!**

---

## 🌐 Step 12: Open Browser

Open your web browser and go to:
```
http://localhost:3000
```

🎉 **Your SIP Investment Advisor app should now be running!**

---

## 📋 Quick Copy-Paste Version

If you want to copy all backend commands at once:

**Backend (Terminal 1):**
```
cd backend
python3 -m venv venv
source venv/bin/activate
pip3 install --upgrade pip
pip3 install -r requirements.txt
python3 main.py
```

**Frontend (Terminal 2):**
```
cd frontend
npm install
npm run dev
```

---

## 🐛 If You Get Errors

### Error: "zsh: unmatched '"
**Cause:** You copied the markdown code block markers (```bash or ```)
**Solution:** Only copy the actual commands, not the ``` lines

### Error: "cd: no such file or directory"
**Cause:** You're not in the right directory
**Solution:** 
```
cd /Users/srt231/Desktop/SRT_BOB/stock-sip-advisor
cd backend
```

### Error: "python3: command not found"
**Solution:** Python is not installed or not in PATH
```
which python3
```
If nothing shows, install Python from python.org

### Error: "npm: command not found"
**Solution:** Node.js is not installed
Install from nodejs.org

### Error: "Port 5000 already in use"
**Solution:**
```
lsof -ti:5000 | xargs kill -9
```
Then run `python3 main.py` again

---

## 🛑 How to Stop

When you want to stop the servers:

1. Click on the terminal
2. Press `Ctrl+C`
3. Repeat for the other terminal

---

## 🔄 Running Again Later

Next time, you only need these commands:

**Backend:**
```
cd /Users/srt231/Desktop/SRT_BOB/stock-sip-advisor/backend
source venv/bin/activate
python3 main.py
```

**Frontend:**
```
cd /Users/srt231/Desktop/SRT_BOB/stock-sip-advisor/frontend
npm run dev
```

---

## ✅ Success Checklist

- [ ] Terminal opened in IntelliJ
- [ ] Navigated to backend folder
- [ ] Virtual environment created
- [ ] Virtual environment activated (see `(venv)` in prompt)
- [ ] Dependencies installed
- [ ] Backend server running (shows "Running on :5000")
- [ ] Second terminal opened
- [ ] Navigated to frontend folder
- [ ] Node modules installed
- [ ] Frontend server running (shows "Local: http://localhost:3000")
- [ ] Browser opened to http://localhost:3000
- [ ] Application loads successfully

---

## 💡 Pro Tip

After typing each command:
1. Press **Enter**
2. Wait for it to complete
3. Look for any error messages
4. Then type the next command

Don't copy multiple commands at once until you're comfortable with the process!

---

## 🎉 You're Done!

Once both servers are running and you can see the app in your browser, you're all set!

The application will help you get personalized SIP investment recommendations based on your risk profile and investment duration.

Happy Investing! 📈💰