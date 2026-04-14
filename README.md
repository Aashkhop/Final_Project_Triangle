# 🔺 Project Triangle — AI-Powered Freelancer Ecosystem

> Solving the Triple Constraint of Scope, Time & Cost with intelligent AI-driven project management.

[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=flat-square&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-Vite-61DAFB?style=flat-square&logo=react&logoColor=black)](https://reactjs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-Backend-000000?style=flat-square&logo=express&logoColor=white)](https://expressjs.com/)
[![MySQL](https://img.shields.io/badge/MySQL-Database-4479A1?style=flat-square&logo=mysql&logoColor=white)](https://www.mysql.com/)
[![Gemini AI](https://img.shields.io/badge/Google-Gemini%20AI-4285F4?style=flat-square&logo=google&logoColor=white)](https://ai.google.dev/)
[![Socket.io](https://img.shields.io/badge/Socket.io-Real--time-010101?style=flat-square&logo=socketdotio&logoColor=white)](https://socket.io/)
[![Twilio](https://img.shields.io/badge/Twilio-SMS%20%26%20Calls-F22F46?style=flat-square&logo=twilio&logoColor=white)](https://www.twilio.com/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-CSS-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-brightgreen?style=flat-square)](LICENSE)

---

**Project Triangle** is a full-stack, AI-enhanced freelance project management platform built on the MERN stack. It addresses the classic **Project Management Triangle** — balancing Scope, Time, and Cost — using **Google Gemini AI** for intelligent scoping, **Socket.io** for real-time collaboration, and **Twilio** for SMS and voice notifications. Clients can post projects, freelancers can bid, and both parties can track progress through a live visual dashboard.

---

## 📌 Table of Contents

- [✨ Features](#-features)
- [🗂️ Project Structure](#️-project-structure)
- [🛠️ Tech Stack](#️-tech-stack)
- [🤖 Google Gemini AI Integration](#-google-gemini-ai-integration)
- [💬 Real-Time Features — Socket.io](#-real-time-features--socketio)
- [📲 Twilio Integration](#-twilio-integration)
- [⚙️ Installation](#️-installation)
- [🔑 Environment Configuration](#-environment-configuration)
- [🗄️ Database Setup](#️-database-setup)
- [🚀 Usage](#-usage)
- [🌐 API Overview](#-api-overview)
- [🛣️ Roadmap](#️-roadmap)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)

---

## ✨ Features

| Feature | Description | Status |
|---|---|---|
| 🤖 **AI Scope Generator** | Gemini automatically breaks project descriptions into milestones, timelines, and budget estimates | ✅ Active |
| 💬 **Real-Time Chat** | Instant client-freelancer messaging powered by Socket.io | ✅ Active |
| 📊 **Triple Constraint Tracker** | Live visual monitoring of Scope, Time, and Cost against project targets | ✅ Active |
| 🔐 **JWT Authentication** | Secure role-based login for clients and freelancers | ✅ Active |
| 📑 **AI Project Summarizer** | Gemini-generated summaries of long project discussions and timelines | ✅ Active |
| 📋 **Bidding System** | Freelancers submit competitive proposals with cost estimates and portfolios | ✅ Active |
| 📲 **Twilio Notifications** | SMS and voice call alerts for bid updates, milestone completions, and deadlines | ✅ Active |
| 📱 **Responsive UI** | Fully optimized dashboard for desktop and mobile browsers | ✅ Active |

---

## 🗂️ Project Structure

```
Final_Project_Triangle/
│
├── backend/                        # Node.js + Express — REST API & AI logic
│   ├── controllers/                # Route handlers (projects, bids, chat, AI)
│   ├── models/                     # MySQL schema models
│   ├── middleware/                  # JWT authentication & request validation
│   ├── routes/                     # API route definitions
│   ├── config/                     # DB connection & environment setup
│   └── server.js                   # Express + Socket.io server entry point
│
├── client/                         # React (Vite) — primary frontend app
│   └── src/
│       ├── components/             # Reusable UI (Chat, Dashboard, Navbar, Bid cards)
│       ├── pages/                  # Home, Project View, Freelancer Profile, Login
│       ├── context/                # Auth context & global state management
│       └── main.jsx                # App entry point
│
├── project-triangle-frontend/      # Alternate / staging frontend build
│
├── node_modules/                   # Root-level Node dependencies
│
├── Dump20251007 (2).sql            # MySQL database dump — import to seed DB
├── package.json                    # Root dependencies (Tailwind, Twilio)
├── .gitignore
└── README.md
```

---

## 🛠️ Tech Stack

**Frontend**
- [React.js](https://reactjs.org/) with [Vite](https://vitejs.dev/) — fast, modern UI build tool
- [Tailwind CSS v4](https://tailwindcss.com/) — utility-first styling
- [Socket.io Client](https://socket.io/) — real-time bidirectional communication

**Backend**
- [Node.js](https://nodejs.org/) + [Express.js](https://expressjs.com/) — RESTful API server
- [Socket.io](https://socket.io/) — real-time event-driven messaging
- [JWT](https://jwt.io/) — stateless authentication and authorization
- [Twilio](https://www.twilio.com/) — SMS and voice call notifications

**Database**
- [MySQL](https://www.mysql.com/) — relational database for users, projects, bids, and messages
- SQL dump file included: `Dump20251007 (2).sql`

**AI**
- [Google Gemini API](https://ai.google.dev/) — AI scoping, summarization, and project review

---

## 🤖 Google Gemini AI Integration

Gemini is the intelligence engine behind Project Triangle's most powerful features. It is called entirely from the backend (Express API routes) — keeping the API key secure and off the client.

### What Gemini Does

**AI Scope Generator** — A client describes their project in plain language. Gemini analyzes it and generates a structured breakdown: deliverables, recommended milestones, estimated timeline, and a realistic budget range.

**AI Project Summarizer** — On long-running projects, Gemini reads through the chat history and milestone logs and generates a concise plain-language progress summary for both parties.

**Scope Compliance Review** — When a freelancer marks a milestone as complete, Gemini compares the deliverables against the original project scope and flags any discrepancies.

### API Flow

```
Client submits project description
        │
        ▼
  Express API route receives request
        │
        ▼
  Prompt built with project context
        │
        ▼
  Gemini API called (server-side only)
        │
        ▼
  Structured JSON response parsed
        │
        ▼
  Milestones, timeline & budget saved to MySQL
        │
        ▼
  Dashboard updated with AI-generated plan
```

### Getting Your Gemini API Key

1. Visit [https://ai.google.dev/](https://ai.google.dev/) and sign in with your Google account
2. Click **"Get API Key"** → **"Create API Key in new project"**
3. Copy the key and add it to your `backend/.env` file as `GEMINI_API_KEY`

> ⚠️ Always call Gemini from your Express backend routes — never expose the API key in React/frontend code.

---

## 💬 Real-Time Features — Socket.io

Project Triangle uses **Socket.io** for instant, bidirectional communication between clients and freelancers without page refreshes.

**Real-time events include:**
- Live chat messages between client and freelancer
- Instant bid notifications when a new proposal arrives
- Milestone status updates reflected immediately on both sides
- Dashboard constraint meters (Scope/Time/Cost) updating in real time

The Socket.io server runs alongside Express on the same port using `http.createServer()`.

---

## 📲 Twilio Integration

**Twilio** handles all out-of-app communications so users never miss critical project updates.

| Notification | Trigger | Channel |
|---|---|---|
| New bid received | Freelancer submits a proposal | SMS |
| Bid accepted / rejected | Client responds to proposal | SMS |
| Milestone completed | Freelancer marks deliverable done | SMS |
| Deadline approaching | 24 hours before a milestone due date | SMS + Voice Call |
| Payment released | Client approves milestone | SMS |

### Setting Up Twilio

1. Create a free account at [https://www.twilio.com/](https://www.twilio.com/)
2. Get your **Account SID**, **Auth Token**, and a **Twilio Phone Number** from the console
3. Add these to your `backend/.env` (see [Environment Configuration](#-environment-configuration))

---

## ⚙️ Installation

### Prerequisites

- Node.js 18 or higher
- MySQL 8.0 or higher
- A Google Gemini API key ([free tier](https://ai.google.dev/))
- A Twilio account ([free trial](https://www.twilio.com/))

### Step 1 — Clone the Repository

```bash
git clone https://github.com/Aashish/Final_Project_Triangle.git
cd Final_Project_Triangle
```

### Step 2 — Backend Setup

```bash
cd backend
npm install
```

### Step 3 — Frontend Setup

```bash
cd ../client
npm install
```

### Step 4 — Configure Environment Variables

Create `.env` files for both backend and frontend (see [Environment Configuration](#-environment-configuration) below).

### Step 5 — Import the Database

```bash
mysql -u your_mysql_user -p your_database_name < "Dump20251007 (2).sql"
```

### Step 6 — Start Both Servers

In one terminal (backend):

```bash
cd backend
npm run dev
```

In another terminal (frontend):

```bash
cd client
npm run dev
```

- **Backend API:** `http://localhost:5000`
- **Frontend Dashboard:** `http://localhost:5173`

---

## 🔑 Environment Configuration

### Backend — `backend/.env`

```env
# ── Server ───────────────────────────────────────────
PORT=5000
NODE_ENV=development

# ── MySQL Database ────────────────────────────────────
DB_HOST=localhost
DB_PORT=3306
DB_USER=your_mysql_username
DB_PASSWORD=your_mysql_password
DB_NAME=project_triangle

# ── Authentication ────────────────────────────────────
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=7d

# ── Google Gemini AI ──────────────────────────────────
GEMINI_API_KEY=your_google_gemini_api_key_here

# ── Twilio (SMS & Voice) ──────────────────────────────
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=+1XXXXXXXXXX
```

### Frontend — `client/.env`

```env
# ── Backend API URL ───────────────────────────────────
VITE_API_URL=http://localhost:5000/api

# ── Socket.io Server ──────────────────────────────────
VITE_SOCKET_URL=http://localhost:5000
```

> ⚠️ Add both `.env` files to `.gitignore`. **Never commit credentials to GitHub.**

> 💡 Generate a strong JWT secret with:
> ```bash
> node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
> ```

---

## 🗄️ Database Setup

A complete MySQL dump is included in the repository (`Dump20251007 (2).sql`). Import it to get the full schema with sample data:

```bash
# Create the database first
mysql -u root -p -e "CREATE DATABASE project_triangle;"

# Import the dump
mysql -u root -p project_triangle < "Dump20251007 (2).sql"
```

**Core tables include:** `users`, `projects`, `bids`, `milestones`, `messages`, `notifications`

---

## 🚀 Usage

Once both servers are running:

1. **Register** as a Client or Freelancer on the sign-up page
2. **Clients** — Post a new project; Gemini AI will auto-generate a scope breakdown, milestones, and budget estimate
3. **Freelancers** — Browse open projects and submit competitive proposals with custom bids
4. **Clients** — Review proposals and accept the best fit; the freelancer gets an SMS notification via Twilio
5. **Both parties** — Use the real-time chat to collaborate; the Triple Constraint dashboard tracks Scope, Time, and Cost live
6. **Freelancers** — Mark milestones complete; Gemini reviews the deliverables against the original scope
7. **Clients** — Approve completed milestones; payment release triggers an SMS confirmation

---

## 🌐 API Overview

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/auth/register` | Register a new user | No |
| `POST` | `/api/auth/login` | Login and get JWT token | No |
| `GET` | `/api/projects` | List all open projects | Yes |
| `POST` | `/api/projects` | Create a new project | Yes (Client) |
| `GET` | `/api/projects/:id` | Get project details | Yes |
| `POST` | `/api/projects/:id/bids` | Submit a bid on a project | Yes (Freelancer) |
| `PUT` | `/api/bids/:id/accept` | Accept a freelancer's bid | Yes (Client) |
| `POST` | `/api/ai/scope` | Generate AI project scope | Yes |
| `POST` | `/api/ai/summary` | Generate AI project summary | Yes |
| `GET` | `/api/chat/:projectId` | Get chat history | Yes |
| `POST` | `/api/milestones/:id/complete` | Mark milestone complete | Yes (Freelancer) |

---

## 🛣️ Roadmap

Planned features for upcoming releases:

- [ ] Stripe integration — automated milestone-based payment releases
- [ ] GitHub sync — pull repository commits directly into project milestones
- [ ] AI-powered freelancer ranking — Gemini scores proposals based on relevance and past ratings
- [ ] Voice commands — use Gemini for voice-activated project updates
- [ ] Email notifications alongside Twilio SMS
- [ ] Admin panel — platform-wide user and project management
- [ ] Deployed production version (Render + PlanetScale)

---

## 🤝 Contributing

Contributions are welcome! Here's how to get involved:

```bash
# 1. Fork the repository on GitHub

# 2. Clone your fork
git clone https://github.com/YOUR-USERNAME/Final_Project_Triangle.git

# 3. Create a feature branch
git checkout -b feature/your-feature-name

# 4. Make your changes and commit
git add .
git commit -m "feat: describe your change here"

# 5. Push and open a Pull Request
git push origin feature/your-feature-name
```

### Guidelines

- Keep backend and frontend concerns separated in their respective folders
- Comment Gemini prompt logic clearly — it helps collaborators tune AI output
- Test API routes with Postman or Thunder Client before submitting a PR
- For major changes, open an issue first to discuss the approach

### 🐛 Reporting Issues

[Open an issue](https://github.com/Aashish/Final_Project_Triangle/issues) with:
- A clear description and steps to reproduce
- Expected vs. actual behaviour
- Relevant error logs or screenshots

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

*Made with ❤️ by [Aashish](mailto:aashishkhopkar@gmail.com) — Reimagining freelance project management with AI.*
