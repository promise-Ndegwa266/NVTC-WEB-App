# 🎓 NVTC (Nakuru Vocational Training Centre) – Complete Web Application

A comprehensive web application for managing student records, admin authentication, and course management for Nakuru Vocational Training Centre (NVTC). Built with **Express.js** and **MongoDB** on the backend, with a clean, responsive frontend.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Features](#features)
- [Installation & Setup](#installation--setup)
- [Environment Variables](#environment-variables)
- [Database Schema](#database-schema)
- [API Endpoints](#api-endpoints)
- [Frontend Pages](#frontend-pages)
- [Authentication Flow](#authentication-flow)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

---

## 🚀 Overview

NVTC Web Application is a full-stack platform designed to digitize and streamline the administration of Nakuru Vocational Training Centre. It handles:

- ✅ Student record management (CRUD operations with MongoDB)
- ✅ Admin authentication (login, session management, password recovery)
- ✅ Admin user management (create, list, delete admins)
- ✅ Student search and filtering (by name, admission number)
- ✅ Course and department management
- ✅ Responsive, modern UI with smooth animations

This project was built as a collaborative effort to replace manual paper-based systems with a secure, efficient digital solution.

---

## 🛠️ Tech Stack

### **Backend**
| Technology | Purpose |
|------------|---------|
| **Node.js** | JavaScript runtime environment |
| **Express.js** | Web framework for building REST APIs |
| **MongoDB** | NoSQL database for storing student and admin data |
| **Mongoose** | ODM for MongoDB schema modeling and validation |
| **bcryptjs** | Password hashing for secure authentication |
| **jsonwebtoken (JWT)** | Token-based authentication |
| **express-session** | Session management (alternative to JWT) |
| **cors** | Cross-Origin Resource Sharing middleware |
| **dotenv** | Environment variable management |

### **Frontend**
| Technology | Purpose |
|------------|---------|
| **HTML5** | Structure and semantic markup |
| **CSS3** | Styling with custom properties and responsive design |
| **JavaScript (Vanilla)** | Client-side interactivity and DOM manipulation |
| **Font Awesome 6** | Icon library for UI elements |
| **Google Fonts (Inter)** | Clean, modern typography |

### **Dev Tools**
| Tool | Purpose |
|------|---------|
| **Git** | Version control |
| **GitHub** | Repository hosting and collaboration |
| **VS Code** | Code editor |
| **Postman** | API testing |
| **MongoDB Compass** | Database GUI |

---

## 📁 Project Structure
nvtc-webapp/
├── backend/
│ ├── config/
│ │ ├── db.js # MongoDB connection
│ │ └── passport.js # (optional) Auth strategies
│ ├── models/
│ │ ├── Student.js # Student schema
│ │ ├── Admin.js # Admin schema
│ │ └── Course.js # Course schema
│ ├── routes/
│ │ ├── auth.js # Authentication routes (login, register)
│ │ ├── students.js # Student CRUD routes
│ │ ├── admins.js # Admin management routes
│ │ └── courses.js # Course management routes
│ ├── middleware/
│ │ ├── auth.js # JWT verification / session check
│ │ └── errorHandler.js # Global error handling
│ ├── controllers/
│ │ ├── studentController.js
│ │ ├── adminController.js
│ │ └── authController.js
│ ├── utils/
│ │ └── validation.js # Input validation helpers
│ ├── .env # Environment variables
│ ├── server.js # Entry point
│ └── package.json
│
├── views/
│ ├── pages/
│ │ ├── index.html # Landing page
│ │ ├── admin-login.html # Admin login page
│ │ ├── admin-management.html # Admin management dashboard
│ │ ├── recover-password.html # Password recovery form
│ │ ├── dashboard.html # Main dashboard (after login)
│ │ ├── mongo-query.html # Student search/query page
│ │ ├── courses.html # Course list page
│ │ └── 404.html # Custom error page
│ ├── static/
│ │ ├── css/
│ │ │ ├── style.css
│ │ │ ├── style-admin.css
│ │ │ ├── style-recover.css
│ │ │ └── style-404.css
│ │ ├── js/
│ │ │ └── script.js
│ │ └── images/
│ │ └── (logo and assets)
│ └── README.md
│
├── .gitignore
├── package.json
├── package-lock.json
└── README.md # You are here!

---

## ✨ Features

### 🔐 **Authentication & Authorization**
- Admin login with email/username and password
- Password hashing with bcrypt
- Session-based or JWT authentication
- Remember me functionality
- Secure password recovery flow
- Protected routes (dashboard, admin management)

### 👥 **Admin Management**
- Register new admins (first name, last name, email, username, password)
- List all registered admins in a table
- Delete admins with confirmation
- Duplicate prevention (username/email must be unique)

### 👨‍🎓 **Student Management**
- CRUD operations on student records
- Search students by:
  - First Name
  - Last Name
  - Admission Number
- View all student records in a clean, responsive table
- MongoDB aggregation for advanced filtering

### 📊 **Dashboard**
- Overview of total students, courses, and admins
- Quick links to key features
- Recent activity feed (optional)

### 🎨 **User Interface**
- Clean, modern design following NVTC brand colors
- Smooth animations and transitions
- Fully responsive (mobile, tablet, desktop)
- Toast notifications for feedback
- Loading states for async operations

---

## 🔧 Installation & Setup

### **Prerequisites**
- Node.js (v14 or higher)
- MongoDB (local or Atlas cloud)
- Git (optional)

### **Step 1: Clone the Repository**
```bash
git clone https://github.com/yourusername/nvtc-webapp.git
cd nvtc-webapp

### **Step 2: Install Backend Dependencies**
```bash
cd backend
npm install

### **Step 3: Configure Environment Variables**

# .env
PORT=5000
MONGO_URI=mongodb://localhost:27017/nvtc_db
# or MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/nvtc_db

JWT_SECRET=your_super_secret_jwt_key_here
SESSION_SECRET=your_session_secret_here

# Optional: Email config for password recovery
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

### **Step 4: Run App**
```bash

npm run dev
npm run start
