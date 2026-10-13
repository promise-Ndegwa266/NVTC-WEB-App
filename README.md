# NVCT Web System

A Node.js and Express-based web application for Nakuru Vocational Training Centre (NVTC). The project supports public information pages, student enrollment, admin access, file uploads, and email-driven authentication workflows.

## Overview

This system is designed to help manage the day-to-day operations of a vocational training institute. It includes:

- Public website pages for the school
- Student enrollment form with document upload support
- Student login and two-factor authentication using email OTP codes
- Admin login and password recovery flow
- MongoDB-backed storage for students and admin users
- EJS-based views and static frontend assets

## Tech Stack

- Node.js
- Express.js
- MongoDB + Mongoose
- EJS
- bcryptjs
- Nodemailer
- dotenv
- Multer
- Redis integration support

## Project Structure

```text
NVCT-Web-System/
├── App.js
├── README.md
├── package.json
├── atlas-credentials.env
├── envContext.txt
├── DATABASE/
│   ├── Admin.js
│   ├── Candidates.js
│   ├── DormBooking.js
│   ├── EnrollmentForm.js
│   ├── ExamReport.js
│   ├── Memo.js
│   ├── Message.js
│   └── Students.js
├── Routes/
│   ├── admin_rought/
│   │   ├── Admin_authontification.js
│   │   └── Admin_dashoad.js
│   ├── db_uploads/
│   │   └── Enrollment_form.js
│   └── students_rought/
│       ├── Login_authontificatio.js
│       └── Student_dashoad.js
├── static/
│   ├── CSS and image assets
│   └── img/
├── scripts/
│   └── Frontend JavaScript files
├── views/
│   ├── adminlogin.ejs
│   ├── courses.ejs
│   ├── dashboad.ejs
│   ├── enrollform.ejs
│   ├── enrollment_form_upload.ejs
│   ├── file_Upload_error.ejs
│   ├── forfor.ejs
│   ├── form.ejs
│   ├── gallery.ejs
│   ├── newadmin.ejs
│   ├── passwordrecovary.ejs
│   ├── publickpage.ejs
│   ├── rulesAndRegulation.ejs
│   ├── student-enrollment.ejs
│   ├── student_view.ejs
│   ├── studenttwofa.ejs
│   ├── v.ejs
│   └── voterdashboad.ejs
├── Documents/
│   ├── rules_and_regulations_new.docx
│   └── rules_and_regulations_new.pdf
├── Uploads/
├── Cache/
│   └── Redis.js
├── .gitignore
└── .env (local, not committed)
```

## Features

### Public website
- Landing page
- Courses page
- Gallery page
- Rules and regulations page
- Enrollment form access

### Student workflow
- Student login
- Email-based OTP verification
- Student dashboard access checks
- Student data management and records

### Admin workflow
- Admin login
- Password recovery email flow
- Default admin creation on startup if no admin exists
- Admin-facing dashboard operations

### Enrollment system
- Multi-field student enrollment form
- File upload handling for supporting documents
- Email confirmation after submission
- Completion and error pages for uploads

## Installation

1. Clone the repository.
2. Open the project folder.
3. Install dependencies:

```bash
npm install
```

4. Create a `.env` file in the project root with your local configuration.

## Environment Variables

The app expects values similar to the following:

```env
DATABASE_URL=mongodb://127.0.0.1:27017/NVTC
REDIS_URL=redis://127.0.0.1:6379

ADMIN_USER=admin
ADMIN_PASSWORD=admin@1234
ADMIN_EMAIL=your_admin_email@example.com
ADMIN_FIRSTNAME=Default
ADMIN_SECONDNAME=Admin

SENDEREMAIL=your_email@gmail.com
APPLICATIONPASSWORD=your_gmail_app_password
```

Notes:
- `DATABASE_URL` is required for MongoDB connectivity.
- `SENDEREMAIL` and `APPLICATIONPASSWORD` are used by Nodemailer for OTP and recovery emails.
- A local `.env` file should be used instead of relying on tracked environment files.

## Running the App

Start the app in development mode:

```bash
npm run dev
```

Or run it normally:

```bash
npm start
```

The server listens on port `3000` by default.

```text
http://localhost:3000
```

## Main Routes

```text
GET /                      -> Public landing page
GET /cources              -> Courses page
GET /gallery              -> Gallery page
GET /enrollment-form      -> Student enrollment form
GET /rules-and-regulations -> Rules page
POST /password-backup     -> Admin password recovery request
GET /recover-password     -> Recovery page
GET /version/:name        -> Version route

/admin-dashboad/*         -> Admin routes
/student-dashboad/*      -> Student routes
/authorizetion/*          -> Student auth routes
/admin-authorization/*   -> Admin auth routes
/uploads/*               -> Enrollment upload routes
```

## Important Notes

- The app automatically creates a default admin if none exists in the database on startup.
- Student OTP verification is stored in memory for the current runtime, which is fine for local development but should be replaced with persistent storage in production.
- Some file and route names contain spelling inconsistencies such as `Admin_dashoad`, `publickpage`, and `Login_authontificatio`; these are part of the current codebase and may be cleaned up later.
- The project uses classic server-rendered EJS pages rather than a modern API-driven frontend.

## Future Improvements

Possible enhancements include:

- Replace in-memory OTP storage with Redis or a database
- Improve validation and error handling across forms
- Strengthen admin and student session security
- Refactor route naming and project structure for maintainability
- Add a cleaner API layer and better separation of concerns

## License

This repository does not currently include a formal license file. Please confirm usage rights with the project owner before public or commercial reuse.

## Contact

Project owner: Promise Ndegwa

Repository: NVCT-Web-System
