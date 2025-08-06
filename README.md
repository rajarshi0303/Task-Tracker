# 📝 Task Tracker
A full-stack Task Tracker application built with React, Node.js, and MongoDB, designed to help users securely manage their to-do tasks with user authentication, JWT-based session management, Zod validation, and clean UI supporting light/dark mode.

## 🚀 Features

- ✅ Authentication
  - Signup & Login with email and password
  - JWT-based authentication with secure HttpOnly cookies
  - Protected API & routes for logged-in users only

- 🧠 Task Management (CRUD)
  - Create tasks with:
  - title (required)
  - dueDate (optional)
  - completed status (default: false)
  - View all your tasks (Dashboard)
  - View individual task details
  - Edit or delete tasks
  - Toggle task completion

## 🎨 Frontend (React + TailwindCSS)
- Fully responsive UI with light/dark mode toggle
- React Router DOM-based routing
- Zustand for state management
- Axios for API integration
- Loading indicators & error messages
- Persistent login using JWT stored in cookies

## 🛡️ Backend (Node.js + Express)
- Modular MVC structure
- MongoDB & Mongoose ODM
- Rate limiting, Helmet, CORS, Cookie parser
- Zod for request body validation
- Secure API with authentication middleware

## 🧪 Testing
- Frontend: Vitest + Testing Library
- Backend: Jest + Supertest for route testing
- In-memory MongoDB server for isolated test runs

## 🖥️ Tech Stack
### Frontend
- React 19
- React Router DOM 7
- TailwindCSS 4
- Zustand, Axios, SadcnUI
- Vitest, Testing Library

### Backend
- Node.js, Express 
- MongoDB, Mongoose 
- JWT, BcryptJS
- Zod (Validation)
- Jest, Supertest

## 🧭 Getting Started

### 1. Clone the repository
```
git clone https://github.com/rajarshi0303/Task-Tracker.git
cd Task-Tracker
```

### 2. Setup Environment Variables
#### For Backend: Create .env or rename .env.example to .env in the backend/ directory:
```
PORT=3000
MONGO_URI=mongodb://localhost:27017/taskdb
ACCESS_TOKEN_SECRET=Your_ACCESS_TOKEN_SECRET
REFRESH_TOKEN_SECRET=Your_REFRESH_TOKEN_SECRET
```
#### For Frontend: Create .env or rename .env.example to .env in the frontend/ directory:
```
VITE_API_URL=http://localhost:3000
```

### 3. Install dependencies
```
cd backend
npm install            # installs backend dependencies
cd frontend
npm install            # installs frontend dependencies
```

### 4. Seed the Database 
This builds initial data with hashed passwords via insertMany():
```
cd backend
node seed.js
```

### 5. Start the Server & Client
#### Backend
```
cd backend
npm run test
```
#### Frontend
```
cd frontend
npm run test
```

## 🌟 Stretch Features
- 🔎 Task search & title filter
- 🧩 Toggle filter: All / Completed
- 🌗 Light/Dark Mode toggle
- 📦 Seed script for demo data (npm run seed)
