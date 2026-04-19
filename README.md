<div align="center">

```
 ██████╗██████╗  ██████╗ ██╗    ██╗██████╗ ███████╗███████╗███╗   ██╗███████╗███████╗
██╔════╝██╔══██╗██╔═══██╗██║    ██║██╔══██╗██╔════╝██╔════╝████╗  ██║██╔════╝██╔════╝
██║     ██████╔╝██║   ██║██║ █╗ ██║██║  ██║███████╗█████╗  ██╔██╗ ██║███████╗█████╗  
██║     ██╔══██╗██║   ██║██║███╗██║██║  ██║╚════██║██╔══╝  ██║╚██╗██║╚════██║██╔══╝  
╚██████╗██║  ██║╚██████╔╝╚███╔███╔╝██████╔╝███████║███████╗██║ ╚████║███████║███████╗
 ╚═════╝╚═╝  ╚═╝ ╚═════╝  ╚══╝╚══╝ ╚═════╝ ╚══════╝╚══════╝╚═╝  ╚═══╝╚══════╝╚══════╝
```

### Real-time Venue Intelligence PWA

[![Deployed on Cloud Run](https://img.shields.io/badge/Deployed%20on-Google%20Cloud%20Run-4285F4?logo=google-cloud&logoColor=white)](https://crowdsense-824287351953.asia-south1.run.app)
[![Firebase](https://img.shields.io/badge/Backend-Firebase-FFCA28?logo=firebase&logoColor=black)](https://firebase.google.com)
[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black)](https://reactjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?logo=typescript&logoColor=white)](https://typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-5.0-646CFF?logo=vite&logoColor=white)](https://vitejs.dev)
[![PWA](https://img.shields.io/badge/PWA-Ready-5A0FC8?logo=pwa&logoColor=white)](https://web.dev/progressive-web-apps)

**[🚀 Live Demo](https://crowdsense-824287351953.asia-south1.run.app) · [📦 Repository](https://github.com/risshiisshh/CrowdSense)**

</div>

---

## 🎯 What is CrowdSense?

CrowdSense is a **real-time venue intelligence Progressive Web App (PWA)** that transforms the experience of attending any large event — sports matches, concerts, F1 races, comedy shows, and more.

The app provides fans with:
- **Live crowd heatmaps** so you always know where to go
- **AI-powered navigation** to avoid peak queues
- **In-seat food ordering** with live wait time tracking
- **Smart gate recommendations** to minimize entry time
- **Gamification** — earn points, unlock badges, redeem rewards

> Built with a **Kinetic HUD** design philosophy — dark, high-contrast, data-dense, and alive with real-time feedback.

---

## 🌟 Features

### 📍 Venue Map
- Generic SVG map that works for **any event type** (Cricket, Football, F1, Concerts, Comedy)
- **Heatmap mode** — color-coded crowd density per zone
- **2D Plan mode** — structural layout view
- Tap any zone to see occupancy %, capacity, wait time, trend
- Gate status indicators (G1–G4) with open/closed status
- Your seat location pinned on the map

### 🍔 Food & Ordering
- Browse menu items from 5 food counters
- Filter by cuisine, veg/non-veg, category
- Live **wait time indicators** per counter
- Add to cart → place order → real-time status tracking (Placed → Preparing → On the Way → Delivered)
- Floating persistent cart widget

### 🎫 Wallet
- Live match ticket with QR code (scan at gate)
- **6 upcoming events** across:
  - 🏏 Cricket (IPL)
  - 🎵 Concert (Coldplay)
  - 🏎️ F1 (Bahrain GP)
  - ⚽ Football (ISL Final)
  - 🎤 Comedy (Stand-up)
- View/Buy Ticket for each event
- Season attendance heatmap

### 📊 My Stats
- Activity timeline for the day
- **Polished route map** — animated Bezier curved paths with direction arrows
- AI impact metrics (time saved, queues avoided, steps saved)
- Achievements & badges
- Your stats vs. average attendee

### 🛡️ Admin Dashboard
- Real-time KPI cards (crowd count, high-risk zones, wait times, active alerts)
- **Interactive trend chart** — hover for tooltip, click to pin data points with glow
- Live alert feed
- Broadcast platform-wide alerts
- Event simulation buttons (Goal, Halftime, Match End, Emergency Drill)
- Service counter wait time management

### ⚙️ Settings
- All toggles **fully wired** to user preferences:
  - Live Updates, Food Alerts, Haptic Feedback, AR Features
  - Dark/Light mode, Compact View, Data Sharing
- **Haptic feedback** via `navigator.vibrate()` on supported devices
- Firebase `signOut()` on logout

### 👤 Profile
- Inline name editing (no modal)
- XP bar with tier progression (Bronze → Silver → Gold → Platinum → Legend)
- Badges earned display
- Points history
- Rewards redemption
- Referral code

### 🔴 AR Preview
- Camera view with AR overlay
- Zone density overlays in camera feed

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18 + TypeScript |
| **Build Tool** | Vite 5 + PWA Plugin |
| **Styling** | Tailwind CSS + Custom CSS Variables |
| **State** | Zustand (with `persist` middleware) |
| **Routing** | React Router v6 |
| **Backend** | Firebase (Auth + Firestore) |
| **Containerization** | Docker (nginx:alpine) |
| **Deployment** | Google Cloud Run (asia-south1) |
| **CI/CD** | gcloud run deploy --source |

---

## 🗂️ Project Structure

```
CrowdSense/
├── public/               # Static assets, PWA manifest
├── src/
│   ├── components/       # Reusable UI components
│   │   ├── chat/         # AI chat bot
│   │   ├── food/         # Cart, food cards, order tracker
│   │   ├── layout/       # NavBar, Sidebar, PageWrapper, BottomNav
│   │   ├── map/          # StadiumMap SVG, ZoneTooltip, SeatView
│   │   ├── profile/      # Badges, PointsHistory, RewardCard
│   │   └── ui/           # Badge, Card, LiveDot, Toast, XPBar, etc.
│   ├── data/
│   │   └── mockData.ts   # Mock data (zones, events, menu, users)
│   ├── hooks/            # Custom React hooks
│   │   ├── useAuth.ts    # Firebase auth + Firestore profile
│   │   ├── useCrowdZones.ts  # Real-time zone data
│   │   ├── useFoodMenu.ts    # Menu items + counters
│   │   ├── useNotifications.ts # Real-time alerts
│   │   ├── useOrders.ts      # Order placement + tracking
│   │   └── useProfile.ts     # Badges, points, profile updates
│   ├── lib/
│   │   ├── firebase.ts   # Firebase init (env-aware)
│   │   ├── crowd.ts      # Zone color/fill utilities
│   │   ├── points.ts     # Points formatting
│   │   └── badges.ts     # Badge logic
│   ├── pages/            # 10 full pages
│   ├── store/
│   │   └── useAppStore.ts # Global Zustand store
│   └── types/
│       └── index.ts      # 14 TypeScript interfaces
├── Dockerfile            # Multi-stage build → nginx
├── nginx.conf            # SPA fallback, gzip, cache headers
├── firestore.rules       # Firestore security rules
├── .env.example          # Firebase config template
└── .dockerignore
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 20+
- npm 10+

### 1. Clone & Install

```bash
git clone https://github.com/risshiisshh/CrowdSense.git
cd CrowdSense
npm install
```

### 2. Run in Demo Mode (no Firebase needed)

```bash
npm run dev
# → http://localhost:5173
```

The app runs with rich mock data — perfect for development.

### 3. Enable Firebase Backend (optional)

Create a `.env` file:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef
VITE_USE_FIREBASE=true
```

Then restart the dev server. See `.env.example` for a template.

---

## 🔥 Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com) → Create project
2. Add a Web App → Copy config to `.env`
3. Enable **Authentication** → Google + Email/Password
4. Create **Firestore Database** → `asia-south1` → test mode
5. Deploy [Firestore security rules](./firestore.rules)

---

## 🐳 Docker

```bash
# Build
docker build --build-arg VITE_USE_FIREBASE=false -t crowdsense .

# Run
docker run -p 8080:8080 crowdsense
# → http://localhost:8080
```

---

## ☁️ Deploy to Google Cloud Run

```bash
# One-time setup
gcloud auth login
gcloud config set project YOUR_PROJECT_ID
gcloud services enable cloudbuild.googleapis.com run.googleapis.com artifactregistry.googleapis.com

# Deploy
gcloud run deploy crowdsense \
  --source . \
  --region asia-south1 \
  --platform managed \
  --allow-unauthenticated \
  --port 8080 \
  --memory 256Mi \
  --min-instances 0 \
  --max-instances 3 \
  --set-build-env-vars "VITE_FIREBASE_API_KEY=...,VITE_USE_FIREBASE=true"
```

After deployment, add your Cloud Run URL to **Firebase Console → Authentication → Authorized Domains**.

---

## 📱 PWA Installation

On mobile, open the live URL in Chrome/Safari → tap **"Add to Home Screen"**. The app works offline with service worker caching.

---

## 🗺️ Pages

| Route | Page | Description |
|-------|------|-------------|
| `/login` | Login | Google + Email/Password auth |
| `/home` | Home | Live scoreboard, active order, quick actions |
| `/dashboard` | Venue Map | SVG heatmap, zone selection, gate status |
| `/food` | Food | Menu browser, cart, ordering |
| `/wallet` | Wallet | QR ticket, upcoming events |
| `/stats` | My Stats | Activity timeline, route map, achievements |
| `/profile` | Profile | Edit profile, badges, rewards |
| `/notifications` | Alerts | Real-time venue alerts |
| `/settings` | Settings | All preferences, theme, haptics |
| `/admin` | Admin | Analytics, crowd control, simulation |
| `/ar` | AR View | Camera overlay with crowd data |

---

## 💰 Cost (Free Tier)

| Service | Free Tier | Monthly Cost |
|---------|-----------|-------------|
| Cloud Run | 2M requests/month | **$0** |
| Firebase Auth | 50K users/month | **$0** |
| Firestore | 50K reads/day | **$0** |
| Cloud Build | 120 min/day | **$0** |

---

## 🔮 Roadmap

- [ ] Real-time crowd data from sensors/cameras
- [ ] Payment integration (Razorpay) for food orders
- [ ] Push notifications via Firebase Cloud Messaging
- [ ] AR camera overlays (WebXR)
- [ ] Admin crowd simulation engine
- [ ] Accessibility audit (WCAG 2.1 AA)

---

<div align="center">

Made with ⚡ by **Rishabh Shevde**

**[Live App](https://crowdsense-824287351953.asia-south1.run.app)** · **[GitHub](https://github.com/risshiisshh/CrowdSense)**

</div>
