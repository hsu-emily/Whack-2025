# ☕️ Punchie Pass

Punchie Pass is a delightful habit-tracking web app that turns building routines into the same satisfying experience as filling up a punch card at your favorite café.

Instead of boring checklists, you create gorgeous digital punch cards, “punch” them with a custom hole-punch cursor, and celebrate your progress with AI-powered coaching, rewards, and reflections.

> 🔗 **Live Site:** https://punchiepass.study  

---

## ✨ Inspiration

Punchie Pass was inspired by those nostalgic paper punch cards from coffee shops.  
We wanted to recreate:

- The **tangible satisfaction** of punching a card  
- The **visual progress** you can see at a glance  
- The **fun, cozy energy** of a café loyalty card  

Most habit trackers feel clinical and dull. Punchie Pass makes habit building playful, aesthetic, and rewarding.

---

## 🌟 Features

### 🃏 Custom Punch Cards
- Create punch cards for any habit or goal  
- Choose from multiple themes: Windows, Lace, Plaid, Camera, etc.  
- Customize:
  - Title & description  
  - Icon / emoji  
  - Number of punches & layout  

### 🕳 Interactive Punching Experience
- Custom **hole-punch cursor** that follows your mouse  
- Satisfying “punch” interaction when you complete a habit  
- Smooth animations and micro-interactions

### 🤖 AI-Powered Habit Support (Google Gemini)

**1. Goal → Habit Generator**
- Type a vague goal like “stop cramming for exams” or “be more consistent with working out”
- Gemini:
  - Breaks it into concrete, trackable habits  
  - Suggests reasonable frequencies  
  - Adds short descriptions  
- You can turn suggestions into punch cards with one click

**2. AI Reward Suggestions**
- Click “AI suggestions” while creating a habit  
- Gemini generates:
  - Low-cost, student-friendly rewards  
  - A mix of fun, self-care, and motivating incentives  
- Click to auto-fill the reward field

**3. Reflection AI Coach**
- Write a weekly reflection about how your habits went  
- We send:
  - The reflection  
  - Context about your habits and progress  
- Gemini responds as an **empathetic coach**:
  - Highlights what went well  
  - Validates challenges  
  - Suggests concrete next steps  

Includes error handling so reflections are still saved even if AI is down.

### 📊 Visual Progress & Dashboard

- Elegant **dashboard carousel** showing all your punch cards  
- At-a-glance stats:
  - Total punches  
  - Completed habits  
- Visual distinction between filled and empty punches

### 🎉 Sharing & Social

- Generate QR codes for your punch passes  
- Download punch cards as images (via `html2canvas`)  
- Celebrate completed habits with friends

### 📝 Reflection Journaling

- Weekly reflections tied to your habits  
- AI feedback + numbered suggestions for improvement  

---

## 🧠 Tech Stack

### Frontend

- **React 19** + **Vite**
- **Tailwind CSS 4** for styling
- **Framer Motion** for animations
- **Zustand** for state management
- **React Router** for navigation
- **Day.js** for date handling
- **html2canvas** for image export
- **react-qr-code** for QR generation

### Backend & Services

- **Firebase**
  - Authentication
  - Firestore
  - Storage
- **Google Gemini API**
  - Habit generation
  - Reward suggestions
  - Reflection coaching

### Dev & Tooling

- Vite for bundling / dev server
- ESLint for linting
- NPM for package management
- Deployed with **Vercel**

---

## 🏗 Key Technical Pieces

### 🎯 Custom Hole-Punch Cursor
- Hides the default cursor
- Tracks mouse position with React hooks
- Uses CSS transforms + Framer Motion for smooth follow & click animation

### 🧩 Dynamic Card Layout System
- Each theme defines:
  - Text positions
  - Icon placement
  - Punch grid layout
- Layout config keeps designs consistent across cards and screen sizes

### 🔄 Real-Time Habit Sync
- Habits and punch counts stored in Firestore
- Real-time listeners keep the dashboard in sync across devices

### 📸 Shareable Card Exports
- `html2canvas` used to snapshot card components
- Generated images can be downloaded or stored / shared

---

## 📁 Project Structure

```bash
Whack-2025/
├─ public/
├─ punch-app/
│  ├─ src/
│  │  ├─ assets/
│  │  ├─ components/
│  │  ├─ context/
│  │  ├─ pages/
│  │  ├─ services/        # firebase config, Gemini service, etc.
│  │  ├─ store/           # Zustand store
│  │  ├─ utils/
│  │  ├─ App.jsx
│  │  ├─ main.jsx
│  │  └─ index.css
│  ├─ index.html
│  ├─ package.json
│  ├─ vite.config.js
│  └─ ...other config files
└─ README.md
