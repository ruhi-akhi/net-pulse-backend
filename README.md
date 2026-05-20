# Net Pulse — Internet Speed Test Platform 🚀

Net Pulse is a comprehensive internet speed testing and network performance analytics platform. Built using the MERN stack, it features precise metric calculations for download speed, upload speed, latency (ping), and jitter, along with an interactive historical tracking dashboard.



## 🔑 Test Credentials (Reviewer Access)
To review pre-populated speed test history, charts, and interactive analytics instantly, please use the following credentials on the login screen:

Email:demo@example.com
Password: demo123


## 🔗 Live Deployments & Repository
* **Frontend Live URL:** https://net-pulse-frontend-i27dym1dw-ruhi-buiya.vercel.app
* **Backend Live API URL:** https://net-pulse-backend.vercel.app
* **GitHub Repository:** [Insert Your GitHub Link Here]




========================================


## 📡 কোর এপিআই স্ট্যান্ডার্ডস (REST Specification)

### 🔓 অথেনটিকেশন মডিউল (Authentication Module)
* `POST /api/auth/register` - নতুন ইউজার অ্যাকাউন্ট তৈরি করে। পাসওয়ার্ড `bcryptjs` দ্বারা সুরক্ষিতভাবে এনক্রিপ্ট করা হয়।
* `POST /api/auth/login` - ইউজারের ক্রেডেনশিয়াল যাচাই করে একটি সিকিউরড JSON Web Token (JWT) রিটার্ন করে।
* `GET /api/auth/profile` - *[Protected Route]* শুধুমাত্র লগইন করা ইউজারের প্রোফাইল ডেটা প্রোভাইড করে।

### ⚡ টেলিমেট্রি ও ডায়াগনস্টিকস মডিউল (Telemetry & Diagnostics Module)
* `GET /api/tests/ping` - নেটওয়ার্কের লেটেন্সি (Ping) নিখুঁতভাবে পরিমাপ করার জন্য একটি অত্যন্ত লাইটওয়েট এন্ডপয়েন্ট।
* `GET /api/tests/download` - ফ্রন্টএন্ডে ডাউনলোডের রিয়েল-টাইম থ্রুটপুট হিসাব করার জন্য ডাইনামিক্যালি একটি ৫ মেগাবাইটের (5MB) ডামি ডাটা স্ট্রিম করে।
* `POST /api/tests/upload` - আপলোড স্পীড পরিমাপের সুবিধার্থে ফ্রন্টএন্ড থেকে পাঠানো ডামি পে-লোড রিসিভ করে।
* `POST /api/tests/record` - স্পীড টেস্টের ফাইনাল রেজাল্ট ডেটাবেজে (MongoDB) সংরক্ষণ করে (এটি গেস্ট এবং রেজিস্টার্ড—উভয় ইউজারের জন্যই কার্যকর)।

### 📊 এগ্রিগেশন ও ফিল্টার মডিউল (Aggregation & Filters Module)
* `GET /api/tests` - অ্যাডভান্সড কুয়েরি প্যারামিটার (`date` এবং `speed`) ব্যবহার করে ইউজারের পূর্ববর্তী সব টেস্ট হিস্ট্রি ফিল্টারড আকারে প্রোভাইড করে।
* `GET /api/analytics/dashboard` - শক্তিশালী MongoDB Aggregation Pipeline ব্যবহার করে সর্বোচ্চ, সর্বনিম্ন, গড় স্পীড এবং নেটওয়ার্কের লাইভ ট্রেন্ডের ডেটা প্রোভাইড করে।

#### 📈 নেটওয়ার্ক কোয়ালিটি লজিক (Network Quality Metrics):
* **Excellent Connection:** ডাউনলোড স্পীড > ৫০ Mbps **এবং** লেটেন্সি (Ping) < ২০ ms
* **Good Connection:** ডাউনলোড স্পীড ২০ Mbps থেকে ৫০ Mbps-এর মধ্যে।
* **Poor Connection:** লেটেন্সি (Ping) > ১০০ ms **অথবা** ডাউনলোড স্পীড < ৫ Mbps



## ⚙️ লোকাল ডেভেলপমেন্ট সেটাপ (Local Development Setup)

### ১. রিকোয়ারমেন্টস (Prerequisites)
আপনার কম্পিউটারে Node.js (v16+) এবং MongoDB লোকালি ইনস্টলড থাকতে হবে অথবা একটি সচল MongoDB Atlas কানেকশন স্ট্রিং থাকতে হবে।

### ২. ব্যাকএন্ড রান করার নিয়ম (Backend Initialization)
প্রজেক্টের রুট (Root) ফোল্ডারে গিয়ে টার্মিনালে নিচের কমান্ডগুলো রান করুন:
```bash
# ডিপেন্ডেন্সি ইনস্টল করার জন্য
npm install

# এনভায়রনমেন্ট ফাইল তৈরি করুন (.env.example ফাইলটি দেখে একটি .env ফাইল বানান)
PORT=5000
MONGODB_URI=mongodb://localhost:27017/net_pulse
JWT_SECRET=your_jwt_signature_hash
JWT_EXPIRES_IN=7d
DUMMY_FILE_SIZE_MB=5

# ডেভেলপমেন্ট সার্ভার চালু করার জন্য
npm run dev





















## 📁 Modular Project Architecture

The project is structured following clean-code practices, fully separating concerns via an MVC-like service layer layout on the backend and an atomic module pattern on the frontend.


net-pulse-backend/
├── src/                          # BACKEND CORE (Node.js + Express)
│   ├── config/
│   │   └── db.js                 # MongoDB Connection Configuration
│   ├── controllers/
│   │   ├── auth.controller.js    # Authentication Request Handlers
│   │   └── test.controller.js    # Telemetry and Aggregation Handlers
│   ├── middleware/
│   │   ├── auth.middleware.js    # JWT Guard/Route Protection Middleware
│   │   └── error.middleware.js   # Centralized Exception Framework
│   ├── models/
│   │   ├── user.model.js         # User Schema
│   │   └── speedTest.model.js    # Telemetry Record Schema (Guest & User)
│   ├── routes/
│   │   ├── auth.routes.js        # Auth Router Core
│   │   └── test.routes.js        # Speed Test Telemetry Routing
│   ├── services/
│   │   ├── auth.service.js       # Authentication Database Logic
│   │   └── test.service.js       # Business Logic & Aggregated Analytics
│   ├── validators/
│   │   ├── auth.validator.js     # Joi Schema Rules for Auth Inputs
│   │   └── test.validator.js     # Joi Schema Rules for Speed Testing
│   ├── app.js                    # Express Application Setup (CORS Enabled)
│   └── server.js                 # Server Bootstrapping / Listener Entry
│
├── frontend/                     # FRONTEND CORE (React.js + Vite)
│   ├── src/
│   │   ├── components/
│   │   │   └── Navbar.jsx        # Navigation Component Layout
│   │   ├── context/
│   │   │   └── AuthContext.jsx   # Global User Authentication State
│   │   ├── pages/
│   │   │   ├── Home.jsx          # Circular Emerald Gauge Performance Engine
│   │   │   ├── Dashboard.jsx     # Network Trends, Recharts & Dynamic Filters
│   │   │   ├── Login.jsx
│   │   │   └── Register.jsx
│   │   ├── services/
│   │   │   └── api.js            # Unified Axios Central Instance (Interceptors)
│   │   ├── App.jsx               # Navigation Shell Router
│   │   ├── index.css             # Tailwind CSS Configuration
│   │   └── main.jsx
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js

















