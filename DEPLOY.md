# 🚀 Deploy Your BrainScroll Study App - FREE

This guide will help you publish your research app for free!

## Step 1: Create a GitHub Repository

1. Go to https://github.com/new
2. Repository name: `brainscroll-study`
3. Select "Public"
4. Click "Create repository"
5. **Don't close this page!** You'll see commands to push your code

## Step 2: Push Your Code to GitHub

On your computer, open Command Prompt and run these commands:

```bash
cd C:\Users\kirol\Downloads\brainscroll-study
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/brainscroll-study.git
git push -u origin main
```

Replace `YOUR_USERNAME` with your GitHub username!

## Step 3: Deploy Backend (Railway - FREE)

1. Go to https://railway.app
2. Click "Login" → "Continue with GitHub"
3. Click "New Project" → "Deploy from GitHub repo"
4. Select `brainscroll-study`
5. Railway auto-detects Node.js - just click "Deploy"
6. Wait for deployment... then go to "Settings" → "Environment Variables"
7. Add these two variables (generate keys from https://randomkeygen.com):
   - `DATA_ENCRYPTION_KEY`: (paste a key)
   - `JWT_SECRET`: (paste another key)
8. Your backend URL will be shown (like `https://brainscroll-study-backend.up.railway.app`)
9. **Copy this URL!**

## Step 4: Deploy Frontend (Vercel - FREE)

1. Go to https://vercel.com
2. Click "Login" → "Continue with GitHub"
3. Click "Add New..." → "Project"
4. Import `brainscroll-study` from GitHub
5. Click "Environment Variables" and add:
   - Name: `VITE_API_URL`
   - Value: (paste your Railway backend URL from Step 3)
6. Click "Deploy"
7. Wait... then get your live URL! (like `https://brainscroll-study.vercel.app`)

## Step 5: Create Your Admin Password

1. Go to https://railway.app → your project → "Logs"
2. Or SSH into your Railway app
3. Run: `node scripts/createResearcher.js admin YOURPASSWORD`

## ✅ You're Done!

Your app is now live at your Vercel URL!

- **Participants use**: Your main Vercel URL
- **Admin dashboard**: Add `/admin/login` to your URL (e.g., `https://xxx.vercel.app/admin/login`)

---

## ⚠️ Important Passwords to Remember

| What | Password |
|------|----------|
| GitHub (if you set one) | You chose this |
| Railway | You chose this |
| Vercel | You chose this |
| **Admin Dashboard** | `YOURPASSWORD` (from Step 5) |

---

## Need Help?

Your app has:
- **Participant site**: Main study flow for students
- **Admin dashboard**: View results, export data (at `/admin/login`)
