# Panditji - Complete Project Documentation

Welcome to the **Panditji** project repository. Panditji is a comprehensive, full-stack web platform designed to seamlessly connect users with qualified Pandits for various Pujas, rituals, and astrology services. It provides tailored experiences through dedicated interfaces for Users, Pandits, and platform Administrators.

---

## 🌟 Core Features

### 1. User Experience & Booking
- **Smart Search & Discovery:** Dynamic search bar integrated into the Navbar to easily find specific Pujas or Pandits.
- **Detailed Pandit Profiles:** View comprehensive Pandit information including bios, years of experience, specializations, spoken languages, and user reviews.
- **Streamlined Booking System:** Smooth checkout process to book a Pandit for a selected Puja at a specified location and time.
- **User Dashboard & Profile:** A centralized hub where users can manage their personal profiles, view past and upcoming bookings, and manage their "Saved Pandits" list.
- **Push Notifications:** Integrated Firebase Cloud Messaging (FCM) to deliver real-time updates and alerts for bookings and profile activities.
- **Legal & Compliance:** Dedicated, easily accessible pages for Privacy Policy and Terms & Conditions.

### 2. Astrology & AI Features
- **Tarot Card Readings:** An interactive 3-card tarot spread feature that provides dynamic, randomized results for users seeking guidance.
- **Multi-Model AI Integration:** The platform incorporates various AI providers (Sarvam AI, Gemini, Groq, OpenRouter) to power intelligent interactions, astrology insights, and multimodal capabilities (Chat, Vision, Audio, Image generation).
- **Smart Model Fallbacks:** Robust error handling and fallback mechanisms ensure consistent AI availability using configured free-tier models when primary credits are exhausted.

### 3. Pandit Portal & Onboarding
- **"Become a Pandit" Application:** A comprehensive onboarding flow allowing prospective Pandits to submit their details, experience, languages, and upload verification documents.
- **Admin Approval Workflow:** New Pandit registrations are securely routed to the Admin Dashboard. Users are only granted the "Pandit" role upon explicit admin verification.
- **Pandit Dashboard:** A dedicated interface where approved Pandits can manage their public profiles, view their earnings, and handle their scheduled puja bookings.

### 4. Admin Management Panel
- **Dynamic Banner Editor:** Administrators can easily update the homepage hero banner (text, images, and embedded links to specific pujas) which syncs via a backend Supabase table.
- **Application Management:** Interface to review, approve, or reject pending Pandit onboarding applications.
- **Platform Analytics:** General oversight of platform users, active bookings, and AI model configurations.

---

## 🏗️ Architecture & Technology Stack

This project adopts a modern decoupled architecture, separating the client interface from the API and services layer.

### Frontend (`/frontend`)
- **Framework:** React.js built with Vite for lightning-fast development and optimized builds.
- **Styling & UI:** Tailwind CSS for utility-first styling, ensuring a fully responsive and aesthetic modern design.
- **Animations:** Framer Motion powers rich layout animations, sticky headers, and smooth scroll effects.
- **Icons:** Lucide-React and custom SVG icons for a minimalist, premium look.

### Backend (`/backend`)
- **Server Environment:** Node.js with Express.js architecture (`controllers`, `routes`, `middleware`, `services`).
- **Database:** Supabase (PostgreSQL) for structured relational data storage, managed with SQL migration scripts.
- **Push Notifications:** Firebase Cloud Messaging (FCM) architecture implemented for cross-device alerts.

---

## ⚙️ How the Project Works (Platform Workflow)

1. **Onboarding & Discovery:** 
   Users explore the platform via a highly animated, responsive homepage featuring dynamic banners. They can use the search bar to find matching Pujas or browse through high-rated Pandits.
2. **Booking Flow:**
   After selecting a Puja, the user chooses an available Pandit, confirms the time and location details, and completes the seamless checkout process.
3. **Pandit Verification & Engagement:**
   If a user wishes to offer services, they use the "Become a Pandit" form. Their application is paused in a pending state. An Administrator logs into the Admin Panel, reviews the documents, and approves the profile. The user is then granted access to the internal Pandit Dashboard to view their new bookings and earnings.
4. **Interactive Astrology:**
   Users seeking spiritual guidance can interact with the Astrology modules to draw Tarot Cards. The backend processes these requests (often leveraging integrated AI models like Sarvam AI) to provide unique, dynamic interpretations.
5. **Real-time Updates:**
   Throughout this lifecycle, FCM tokens ensure that both the User and Pandit receive immediate push notifications regarding booking statuses, messages, or administrative actions.

---

## ☁️ Deploy this Frontend Repo on Vercel

When you move `frontend/` into its own repository:

- Vercel does **not** require Docker for this Vite app.
- Framework preset: `Vite`
- Build command: `npm run build`
- Output directory: `dist`

You can keep the Dockerfile for local Docker usage, but Vercel deployment should use normal build settings.

---

## 🚀 Running the Project

### 1. Using Docker (Recommended)
To run the entire stack (Frontend + Backend) simultaneously:
1. Ensure Docker and Docker Compose are installed.
2. From the root directory (`/`), run:
   ```bash
   docker-compose up --build
   ```
3. Frontend: `http://localhost:80` | Backend: `http://localhost:5000`

### 2. Manual Setup

**Backend:**
```bash
cd backend
npm install
# Ensure .env is properly configured based on .env.example
npm run dev
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

---

*Note: Temporary output logs such as `build-output.txt` and database schema files have been organized securely within their respective component folders to maintain root parity.*
