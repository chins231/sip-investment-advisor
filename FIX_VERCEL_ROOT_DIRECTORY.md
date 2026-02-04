# Fix Vercel Deployment - Set Root Directory

## The Problem
Vercel is trying to build from the repository root, but our frontend code is in the `frontend/` subdirectory. Even though the files exist in git, Vercel can't find them because it's looking in the wrong place.

## The Solution
Configure Vercel to use `frontend` as the Root Directory.

## Step-by-Step Instructions

### Method 1: Via Vercel Dashboard (RECOMMENDED)

1. **Go to your Vercel project**:
   - Visit: https://vercel.com/dashboard
   - Click on your "sip-investment-advisor" project

2. **Go to Settings**:
   - Click the "Settings" tab at the top

3. **Find "Root Directory" setting**:
   - Scroll down to find "Root Directory" section
   - It's usually under "Build & Development Settings"

4. **Set Root Directory**:
   - Click "Edit" next to Root Directory
   - Enter: `frontend`
   - Click "Save"

5. **Redeploy**:
   - Go back to "Deployments" tab
   - Click "Redeploy" on the latest deployment
   - Or click the three dots (⋮) → "Redeploy"

### Method 2: Check "3 Recommendations"

In your deployment error screen, you saw "3 Recommendations". Click on that to see what Vercel suggests. It might automatically detect that you need to set the root directory.

### Method 3: Alternative vercel.json Configuration

If the above doesn't work, we can try a different approach. Let me know and I'll update the vercel.json file differently.

## What This Does

Setting Root Directory to `frontend` tells Vercel:
- "Look for package.json in the `frontend/` folder"
- "Run npm install in the `frontend/` folder"
- "Run npm run build in the `frontend/` folder"
- "Deploy the `dist/` folder from `frontend/dist/`"

## After Setting Root Directory

Once you set the root directory and redeploy:
1. Vercel will clone the repo
2. It will `cd` into the `frontend/` directory automatically
3. It will find `package.json` there
4. It will run `npm install` successfully
5. It will run `npm run build` successfully
6. Deployment will succeed! ✅

## Verification

After redeploying, check the build logs. You should see:
```
Cloning github.com/chins231/sip-investment-advisor...
Cloning completed: 277.000ms
Running "vercel build"
Vercel CLI 50.9.6
Running "install" command: `npm install`...
✓ Dependencies installed
Running "build" command: `npm run build`...
✓ Build completed
```

No more "cd: frontend: No such file or directory" error!

## Why This Happened

Previously, Vercel was working because we had a different configuration. When we updated vercel.json to fix other issues, we inadvertently broke the root directory configuration.

## Need Help?

If you can't find the Root Directory setting:
1. Take a screenshot of your Vercel project Settings page
2. Look for "Build & Development Settings" or "General" section
3. The Root Directory option should be there

Or let me know and I'll provide an alternative solution!