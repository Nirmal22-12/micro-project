# 🩸 HemoLife — Blood Donation Platform

A full-stack blood donation management platform built with **React**, **Express**, **PostgreSQL**, and **Tailwind CSS**.

---

## ✨ Features

- **User Authentication** — Register, login, JWT-based session management with role support (user / donor)
- **Dashboard** — Metrics cards, recent activity feed, blood-type inventory, quick actions
- **Donor Directory** — Searchable and filterable donor list with status badges and avatars
- **Find Donors** — Search donors by blood group and location
- **Blood Requests** — Create and manage urgent blood requests with hospital details
- **Campaigns** — Browse and register for blood donation campaigns
- **Donation History** — Log donations and track your full donation timeline
- **Donation Certificates** — Generate and print branded certificates for each donation
- **Profile Management** — Edit personal details, avatar, blood type, and contact info
- **Badges** — Earn achievement badges based on donation milestones
- **Email Notifications** — Welcome emails, urgent request alerts, and campaign updates
- **Cron Jobs** — Automated scheduled tasks for donor status management

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, React Router v6, Tailwind CSS 3.4, Vite 5 |
| Backend | Express 5, Node.js |
| Database | PostgreSQL |
| Auth | JWT (jsonwebtoken), bcryptjs |
| Email | Nodemailer |
| SMS | Twilio |
| Scheduling | node-cron |

---

## 📁 Project Structure

```
├── src/                    # React frontend
│   ├── components/         # Reusable UI components (Navbar, Button, Card, etc.)
│   ├── context/            # AuthContext (global auth state)
│   ├── pages/              # Page components (Home, Dashboard, Donors, etc.)
│   ├── services/           # API service functions
│   ├── styles/             # Global CSS
│   └── utils/              # Utility functions (eligibility checks)
│
├── backend/                # Express API server
│   ├── controllers/        # Route handlers (auth, donor, user, donation, etc.)
│   ├── middleware/          # Auth middleware, rate limiter
│   ├── routes/             # API route definitions
│   ├── utils/              # Email service, Twilio, cron jobs, token generation
│   ├── schema.sql          # Database schema
│   └── index.js            # Server entry point
│
├── package.json            # Frontend dependencies & scripts
└── .gitignore
```

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v18+)
- **PostgreSQL** (running locally or remote)

### 1. Clone the repository

```bash
git clone https://github.com/<your-username>/hemolife.git
cd hemolife
```

### 2. Set up the database

Create a PostgreSQL database and run the schema files:

```bash
psql -U postgres -d your_database -f backend/schema.sql
psql -U postgres -d your_database -f backend/schema_requests.sql
```

Then run the migrations:

```bash
cd backend
node migrate_donations.js
```

### 3. Configure environment variables

Create `backend/.env`:

```env
PORT=5000
DATABASE_URL=postgresql://username:password@localhost:5432/your_database
JWT_SECRET=your_jwt_secret
FRONTEND_URL=http://localhost:5173

# Optional
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
TWILIO_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
TWILIO_PHONE=your_twilio_phone
```

### 4. Install dependencies

```bash
# Root (frontend)
npm install

# Backend
cd backend
npm install
```

### 5. Start development

```bash
# From the root directory — starts both frontend and backend
npm run dev
```

- **Frontend** → http://localhost:5173
- **Backend API** → http://localhost:5000

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login and receive JWT |
| GET | `/api/donors` | List all donors |
| GET | `/api/donors/search` | Search donors by blood group |
| POST | `/api/requests` | Create a blood request |
| GET | `/api/campaigns` | List campaigns |
| PUT | `/api/users/profile` | Update user profile |
| GET | `/api/donations` | Get logged-in user's donations |
| POST | `/api/donations` | Log a new donation |
| GET | `/api/donations/:id/certificate` | Get donation certificate data |
| GET | `/api/stats` | Platform statistics |

---

## 📄 License

This project is for educational purposes.

---

## 📁 Folder Structure

```
src/
├── components/
│   ├── Navbar.jsx           # Fixed top nav with active link highlighting
│   ├── HeroSection.jsx      # Reusable full-width hero
│   ├── Button.jsx           # primary / secondary / outline / ghost variants
│   ├── Card.jsx             # Generic card + CardHeader / CardBody / CardFooter
│   ├── CampaignCard.jsx     # Donation drive card with progress bar
│   ├── FormInput.jsx        # FormInput / FormSelect / FormTextarea
│   ├── EligibilityCard.jsx  # Toggle-based eligibility check + StatusBadge
│   └── StatusBadge.jsx      # Re-export shim
│
├── pages/
│   ├── Home.jsx             # Landing page (hero + features + campaigns + CTA)
│   ├── Dashboard.jsx        # Admin metrics + activity + inventory
│   ├── Donors.jsx           # Donor registry table with live filtering
│   ├── AddDonor.jsx         # Registration form + eligibility logic
│   └── Profile.jsx          # Donor profile + history
│
├── services/
│   └── api.js               # Fetch-based API service (swap BASE_URL for backend)
│
├── utils/
│   └── eligibility.js       # Pure eligibility computation helpers
│
├── styles/
│   └── global.css           # Tailwind directives + CSS custom properties + overrides
│
├── App.jsx                  # BrowserRouter + route definitions
└── main.jsx                 # React 18 createRoot entry point
```

---

## 🎨 Design System

| Token | Value |
|-------|-------|
| Primary font | Poppins (300–800) |
| Display font | DM Serif Display |
| Primary red | `#e11d48` |
| Dark red | `#9f1239` / `#881337` |
| Border radius | 12 px (inputs) → 32 px (hero sections) |
| Shadow | `0 8px 32px rgba(193,21,42,.25)` |

### Page-level CSS overrides (`global.css`)

| Page | Override strategy |
|------|------------------|
| Home | Gradient-heavy backgrounds, floating glass cards |
| Dashboard | Clean white metric cards, accent top-border bars |
| Form / AddDonor | Structured minimal, 2-column grid, eligibility card blocks |
| Profile | Hero banner with decorative rings, side-by-side stats |

---

## 🩺 Eligibility Logic

Located in `src/utils/eligibility.js` and wired into `AddDonor.jsx`.

```js
import { computeEligibility } from "../utils/eligibility";

const status = computeEligibility(permValues, tempValues);
// → "eligible" | "temporary" | "permanent"
```

| Status | UI outcome |
|--------|-----------|
| `eligible` | Green status card, submit enabled |
| `temporary` | Orange status card, submit **disabled** |
| `permanent` | Red status card + warning banner, submit **disabled** |

---

## 🔌 Connecting a Backend

1. Copy `.env.example` → `.env.local`
2. Set `VITE_API_URL=https://your-api.com/api`
3. All calls in `src/services/api.js` will route there automatically.

---

## 📱 Responsi- Route-level protection scaffold ready in `App.jsx`
ed status card + warning banner, submit **disabled** |

---

## 🔌 Connecting a Backend

1. Copy `.env.example` → `.env.local`
2. Set `VITE_API_URL=https://your-api.com/api`
3. All calls in `src/services/api.js` will route there automatically.

---

## 📱 Responsive

- Mobile-first Tailwind breakpoints (`sm:`, `md:`, `lg:`)
- Hero illustration hidden on mobile
- Tables scroll horizontally on small screens
- Navbar collapses to hamburger below `md`

---

## 🛡️ Security & UX

- All form fields validated before submission
- Submit button disabled when eligibility check fails
- Input focus rings meet WCAG contrast guidelines
- Route-level protection scaffold ready in `App.jsx`
>>>>>>> 10599c165e729f901e6c8f8e643534aa9e6060ab
