# 🤖 AI-Finance-Dashboard

[![GitHub License](https://img.shields.io/github/license/manavsharma111/AI-Finance-Dashboard?style=flat-square&color=blue)](LICENSE)
[![MERN Stack](https://img.shields.io/badge/Stack-MERN-orange?style=flat-square)](https://www.mongodb.com/mern-stack)
[![Gemini AI](https://img.shields.io/badge/AI-Gemini-purple?style=flat-square)](https://deepmind.google/technologies/gemini/)
[![Groq AI](https://img.shields.io/badge/AI-Groq-orange?style=flat-square)](https://groq.com/)
[![Tailwind CSS v4](https://img.shields.io/badge/CSS-Tailwind%20v4-38bdf8?style=flat-square)](https://tailwindcss.com/)
[![React 19](https://img.shields.io/badge/Frontend-React%2019-20232a?style=flat-square&logo=react)](https://react.dev/)


An advanced, **AI-powered Personal Finance Dashboard** that simplifies smart expense tracking, interactive analytics, and provides personalized financial insights. Powered by a modern MERN stack, Tailwind CSS v4, and integrated with **Google Gemini & Groq AI** for intelligent financial advisory.

---

## 🚀 Key Features

*   **📊 Interactive Financial Dashboard:** Get a bird's-eye view of your financial health with beautiful charts (Line, Bar, and Pie charts via Recharts) displaying your income, expenses, and net savings.
*   **🤖 AI Financial Advisor (Gemini & Groq):** Receive personalized financial advice, spending pattern alerts, and actionable recommendations generated dynamically based on your actual budget history.
*   **📧 Secure Email OTP Authentication:** High-security register/login flow powered by **Nodemailer** for email-based One-Time Password verification.
*   **💸 Smart Transaction Tracking:** Categorize, filter, add, and delete income sources and expenses seamlessly.
*   **📤 Data Export (CSV & Excel):** Download full reports of your transaction history in `.csv` or `.xlsx` format for external auditing or records.
*   **⚡ Premium UI/UX:** Stunning modern dark-mode aesthetic with smooth scroll animations, glassmorphism, responsive grids, and visual animations powered by **Framer Motion, GSAP**, and **tsParticles**.

---

## 🛠️ Technology Stack

### Frontend
*   **Library:** React 19 (Functional components, hooks, context)
*   **Tooling & Bundler:** Vite (Ultra-fast local development)
*   **Styling:** Tailwind CSS v4 (Sleek dark theme, fluid utilities)
*   **Animations:** Framer Motion & GSAP (Smooth UI transitions and micro-animations)
*   **Interactive Visuals:** tsParticles (Stunning background interactive particle effect)
*   **Charts & Analytics:** Recharts (Dynamic and responsive SVG chart system)
*   **Routing:** React Router Dom v7
*   **API Client:** Axios (Integrated central configurations)
*   **Utilities:** XLSX & CSV Stringify (For seamless Excel/CSV reports)

### Backend
*   **Runtime Environment:** Node.js
*   **Framework:** Express.js (Modular routes & controller-based architecture)
*   **Database:** MongoDB & Mongoose (NoSQL database for flexible data schemas)
*   **Security:** JSON Web Tokens (JWT) for secure session handling & BcryptJS for robust password hashing
*   **OTP Delivery:** Nodemailer (For generating and sending secure OTP codes)
*   **AI Integration:** `@google/generative-ai` (Gemini model) & `groq-sdk` (Llama models)

---

## 📂 Folder Structure

```text
AI-Finance-Dashboard/
├── Frontend/                 # React SPA
│   ├── src/
│   │   ├── assets/           # Statics & media
│   │   ├── components/       # Reusable components (TimeFrame, Charts, Forms)
│   │   ├── pages/            # Core views (Dashboard, Income, Expense, Profile)
│   │   ├── utils/            # Helper scripts (exportCsv, exportUtils)
│   │   ├── App.jsx           # Main routing & layout initialization
│   │   ├── index.css         # Tailwind directives & global styling
│   │   └── main.jsx          # DOM Entry point
│   ├── package.json          # Frontend dependencies
│   └── vite.config.js        # Vite config with Tailwind CSS plugin
│
├── backend/                  # Node.js & Express REST API
│   ├── config/               # Database and configuration setups (db.js)
│   ├── controllers/          # API logical controllers (Auth, Income, Expense, AI)
│   ├── middleware/           # JWT and authorization middlewares
│   ├── models/               # MongoDB models (userModel, incomeModel, expenseModel)
│   ├── routes/               # API endpoint router files (userRoute, aiRoute, etc.)
│   ├── scripts/              # Local development & testing utilities
│   ├── utlis/                # Emailing & utility scripts (mail.js)
│   ├── server.js             # Express API entry point
│   ├── package.json          # Backend dependencies
│   └── vercel.json           # Production deployment configurations
│
└── LICENSE                   # MIT License
```

---

## ⚙️ Environment Configuration

To run this application locally, you must configure environment files for both the **Frontend** and **Backend**.

### Backend Setup (`backend/.env`)
Create a `.env` file inside the `backend` directory and add the following:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key
GEMINI_API_KEY=your_google_gemini_api_key
GROQ_API_KEY=your_groq_api_key
EMAIL=your_nodemailer_sender_email@gmail.com
EMAIL_PASSWORD=your_nodemailer_app_password
```

> [!TIP]
> For Nodemailer, make sure to generate an **App Password** from your Google Account settings rather than using your raw login password.

### Frontend Setup (`Frontend/.env`)
Create a `.env` file inside the `Frontend` directory:
```env
VITE_API_URL=http://localhost:5000/api
```

---

## 🚀 Getting Started

### Prerequisites
*   Node.js (v18 or higher recommended)
*   MongoDB Atlas account or local MongoDB instance

### Step 1: Clone the Repository
```bash
git clone https://github.com/manavsharma111/AI-Finance-Dashboard.git
cd AI-Finance-Dashboard
```

### Step 2: Set up the Backend
1. Navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure your `.env` variables as outlined in [Environment Configuration](#backend-setup-backendenv).
4. Start the server in development mode:
   ```bash
   npm run dev
   ```

### Step 3: Set up the Frontend
1. Open a new terminal and navigate to the Frontend folder:
   ```bash
   cd Frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`.

---

## 🔒 Security & Best Practices
*   **Password Hashing:** Passwords are never saved as plain text; they are safely salted and hashed using `bcryptjs`.
*   **Protected API Routes:** All financial endpoints are protected via JWT middleware to ensure users can only view or modify their own data.
*   **Validation:** Inputs are vetted using `validator` to prevent SQL/NoSQL Injection or XSS vulnerabilities.

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🤝 Contributing
Contributions are always welcome! Feel free to fork this repository, open an issue, or submit a pull request with your improvements.
