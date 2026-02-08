# ECE Coding Platform MVP

A premium coding platform for ECE students to practice Verilog programming and digital electronics with beautiful animations and manual code review workflow.

## 🎯 Features

### ✅ Implemented (MVP)
- **User Authentication**: Email/password signup and login with JWT
- **Problems**: 8 Verilog coding problems (Easy to Hard difficulty)
- **Code Editor**: Monaco Editor with Verilog syntax highlighting
- **Manual Review**: Admin reviews submissions (no auto-execution)
- **Dashboard**: User stats, points, and rank
- **Leaderboard**: Top 10 users by points
- **Quizzes**: 3 MCQ quizzes with auto-scoring
- **Premium UI**: Glass morphism, gradient animations, GSAP effects
- **Responsive Design**: Mobile-friendly interface

### ❌ Future Features (Not in MVP)
- Automated Verilog compilation/execution
- Waveform visualization
- Google OAuth
- Real-time contests
- Plagiarism detection
- AI hints
- Advanced analytics

## 🛠️ Tech Stack

### Frontend
- **React 18** + **TypeScript**
- **Vite** - Build tool
- **Tailwind CSS** - Styling with custom theme
- **React Router** - Navigation
- **Axios** - API requests
- **Monaco Editor** - Code editing
- **GSAP** - Animations
- **Framer Motion** - React animations
- **tsParticles** - Background effects
- **React Hot Toast** - Notifications
- **Firebase** - Client SDK

### Backend
- **Node.js** + **Express** + **TypeScript**
- **Firebase Admin** - Database (Firestore)
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Winston** - Logging
- **Helmet** - Security
- **Express Rate Limit** - Rate limiting

## 📁 Project Structure

```
Ard-Proj/
├── frontend/                 # React + Vite + TypeScript
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/           # Page components
│   │   ├── context/         # React contexts (Auth)
│   │   ├── hooks/           # Custom hooks
│   │   ├── services/        # API and Firebase config
│   │   ├── types/           # TypeScript interfaces
│   │   └── utils/           # Constants and helpers
│   ├── public/
│   ├── package.json
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   └── tsconfig.json
│
├── backend/                  # Express + TypeScript
│   ├── src/
│   │   ├── config/          # Firebase Admin config
│   │   ├── middleware/      # Auth, error handling, rate limiting
│   │   ├── routes/          # API routes
│   │   ├── controllers/     # Route handlers
│   │   └── types/           # TypeScript interfaces
│   ├── package.json
│   └── tsconfig.json
│
└── scripts/
    └── seedDatabase.ts      # Database seeding script
```

## 🚀 Setup Instructions

### Prerequisites
- Node.js (v20.14.0 or higher)
- Firebase project
- npm or yarn

### 1. Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable **Firestore Database**
4. Create a **Service Account**:
   - Go to Project Settings → Service Accounts
   - Click "Generate New Private Key"
   - Save the JSON file

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env with your Firebase credentials:
# PORT=5000
# NODE_ENV=development
# JWT_SECRET=your_random_secret_key_here
# FIREBASE_PROJECT_ID=your_project_id
# FIREBASE_CLIENT_EMAIL=your_client_email
# FIREBASE_PRIVATE_KEY="your_private_key_with_newlines"
```

### 3. Seed Database

```bash
cd ../scripts

# Run seed script (make sure backend .env is configured)
npx tsx seedDatabase.ts
```

This will create:
- 8 Verilog problems
- 3 quizzes
- 2 test users (admin and student)

### 4. Frontend Setup

```bash
cd ../frontend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env with your Firebase web config:
# VITE_API_URL=http://localhost:5000/api
# VITE_FIREBASE_API_KEY=your_api_key
# VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
# VITE_FIREBASE_PROJECT_ID=your_project_id
# VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
# VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
# VITE_FIREBASE_APP_ID=your_app_id
```

### 5. Run the Application

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

The application will be available at:
- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:5000`

## 🔐 Test Credentials

After seeding the database, use these credentials:

**Admin:**
- Email: `admin@eceplatform.com`
- Password: `admin123`

**Student:**
- Email: `student@test.com`
- Password: `test123`

## 📊 Sample Problems

1. **Easy**: 2-to-1 Multiplexer, Half Adder, D Flip-Flop
2. **Medium**: 4-bit Ripple Carry Adder, 3-bit Up Counter, Sequence Detector (1011)
3. **Hard**: 4-bit ALU, FIFO Buffer

## 📝 API Endpoints

### Authentication
- `POST /api/auth/signup` - Create new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Problems
- `GET /api/problems` - List all problems (with filters)
- `GET /api/problems/:id` - Get problem details

### Submissions
- `POST /api/submissions/submit` - Submit code (pending review)
- `GET /api/submissions/user/:userId` - Get user submissions
- `PUT /api/submissions/:id/review` - Admin approve/reject (awards points)

### Leaderboard
- `GET /api/leaderboard` - Top 10 users

### Quizzes
- `GET /api/quizzes` - List all quizzes
- `GET /api/quizzes/:id` - Get quiz with questions
- `POST /api/quizzes/:id/submit` - Submit quiz answers

### Users
- `GET /api/users/:userId` - Get user profile
- `PUT /api/users/:userId` - Update profile

## 🎨 UI Features

- **Glass Morphism**: Frosted glass effect on cards
- **Gradient Text**: Electric blue to cyan gradients
- **Animations**: GSAP, Framer Motion, smooth transitions
- **Custom Scrollbar**: Themed scrollbar
- **Toast Notifications**: Success/error messages
- **Responsive**: Mobile-first design
- **Dark Theme**: Premium dark mode

## ⚠️ Known Limitations (MVP)

1. **No Auto-Execution**: Code submissions require manual admin review
2. **No Waveforms**: Waveform visualization not implemented
3. **Basic Auth**: Only email/password (no OAuth)
4. **Limited Users**: Designed for 4-5 users (Firebase free tier)
5. **No Pagination**: All data loaded at once

## 🔮 Future Roadmap

See `docs/FUTURE_FEATURES.md` for planned enhancements:
- Automated Verilog execution (Judge0/Docker)
- Waveform visualization
- Google OAuth
- Real-time contests
- Advanced analytics
- Plagiarism detection
- AI-powered hints

## 📄 License

ISC

## 👥 Contributors

Built for ECE students to practice Verilog programming.

---

**Note**: This is an MVP for testing core functionality. Scalability features will be added in future iterations.
