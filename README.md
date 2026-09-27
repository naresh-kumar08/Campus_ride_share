# 🚌 Campus Ride Share

A secure, student-only ride-sharing platform connecting verified students within the university community. Built with **React** (frontend) and **Node.js + Express + MongoDB** (backend).

---

## ✨ Features

- 🔒 **Verified Users Only** — Only `@jecrcu.edu.in` emails allowed (configurable)
- 💰 **Transparent Fares** — Auto-calculated at ₹5/km
- ⭐ **Two-sided Rating** — Both rider and passenger rate each other after every trip
- 📋 **Complaint System** — Report issues directly to admin
- 🛡️ **Admin Dashboard** — Full control: manage users, rides, complaints
- 📧 **OTP Email Verification** — Secure account creation via email OTP
- 🔑 **JWT Authentication** — Secure, stateless login

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, React Router v6, Axios |
| Backend | Node.js, Express 5, Mongoose |
| Database | MongoDB Atlas |
| Auth | JWT (jsonwebtoken) |
| Email | Nodemailer + Gmail SMTP |
| Deployment | Render.com |

---

## 🚀 Deploy to Render (Step-by-Step)

### Step 1 — Push to GitHub

```bash
# In your project root
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/campus-ride-share.git
git push -u origin main
```

### Step 2 — Deploy Backend on Render

1. Go to [render.com](https://render.com) → **New → Web Service**
2. Connect your GitHub repo
3. Set **Root Directory** → `Backend`
4. Set **Build Command** → `npm install`
5. Set **Start Command** → `npm start`
6. Add these **Environment Variables**:

| Key | Value |
|---|---|
| `DATABASE` | Your MongoDB Atlas URI |
| `ACCESS_TOKEN_SECRET` | Any long random string |
| `FRONTEND_URL` | Your frontend Render URL (set after step 3) |
| `SENDER_EMAIL_ADDRESS` | Your Gmail address |
| `EMAIL_PASSWORD` | Your [Gmail App Password](https://myaccount.google.com/apppasswords) |

7. Click **Deploy**. Note the backend URL (e.g., `https://campus-ride-share-backend.onrender.com`)

### Step 3 — Deploy Frontend on Render

1. Go to **New → Static Site**
2. Connect your GitHub repo
3. Set **Root Directory** → `Frontend`
4. Set **Build Command** → `npm install && npm run build`
5. Set **Publish Directory** → `build`
6. Add **Environment Variable**:

| Key | Value |
|---|---|
| `REACT_APP_API_URL` | Your backend URL from Step 2 |

7. Click **Deploy**

### Step 4 — Connect Frontend ↔ Backend

1. Go to your **Backend service** on Render
2. Update `FRONTEND_URL` environment variable to your frontend URL
3. Click **Manual Deploy**

---

## 🔧 Local Development

### Backend
```bash
cd Backend
cp .env.example .env    # Fill in your values
npm install
npm run dev             # Runs on port 8000
```

### Frontend
```bash
cd Frontend
cp .env.example .env    # Set REACT_APP_API_URL=http://localhost:8000
npm install
npm start               # Runs on port 3000
```

---

## 📧 Gmail Setup (for OTP emails)

1. Enable 2-Step Verification on your Google account
2. Go to: [Google App Passwords](https://myaccount.google.com/apppasswords)
3. Create a new App Password for **Mail**
4. Use that 16-character password as `EMAIL_PASSWORD` (NOT your Gmail login password)

> **Note:** Emails are optional — the app works without them. If email isn't configured, registration still works and the admin can verify accounts manually.

---

## 🗂 Project Structure

```
Campus_ride_share/
├── Backend/
│   ├── controllers/     # Route handlers
│   ├── middleware/      # Auth, error handling
│   ├── models/          # Mongoose schemas
│   ├── routes/          # Express routers
│   ├── utils/           # Email, token, fare utilities
│   ├── server.js        # Entry point
│   └── .env.example     # Environment variables template
├── Frontend/
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── context/     # React Context (auth state)
│   │   ├── hooks/       # Custom hooks
│   │   ├── pages/       # Page-level components
│   │   └── api.js       # Axios instance with auth headers
│   └── .env.example     # Environment variables template
└── render.yaml          # Render.com blueprint
```

---

## 🆘 Emergency Contacts

- Police Emergency: **100**
- Women Safety Helpline: **1091**
- Campus Helpline: **+91-800-000-0000**
