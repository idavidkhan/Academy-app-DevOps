# Trescol Skill - Complete Project Documentation

---

## 1. Project Overview

### Introduction
Trescol Skill is a comprehensive web platform for a skill development and training institute. It enables students to explore courses, register for programs, and stay updated with news, while providing administrators with a powerful dashboard to manage content, trainers, and registrations.

### Technology Stack

#### Backend
- **Framework**: Express.js (Node.js)
- **Database**: MySQL
- **Database Driver**: `mysql2/promise`
- **Authentication**: JWT (JSON Web Tokens) & bcryptjs
- **File Uploads**: Multer
- **Task Scheduling**: node-cron

#### Frontend
- **Library**: React.js
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM (v6)
- **State Management**: React Context API
- **Rich Text Editor**: Froala Editor
- **Icons**: Lucide React & React Icons
- **Animations**: AOS, Animate.css, Three.js (Fiber)

### Core Features

#### For Users (Students)
- **Course Catalog**: Browse available courses with detailed information (duration, fees, learning outcomes).
- **Online Registration**: Register for courses and upload payment slips for verification.
- **Registration Tracking**: Check status of course applications using Application ID.
- **Instructors Gallery**: Learn more about the trainers and their specialties.
- **News & Announcements**: Keep up with the latest updates from the institute.
- **FAQ & Contact**: Get help and contact the institute directly.

#### For Administrators
- **Secure Login**: Protected admin dashboard.
- **Content Management System (CMS)**: Manage courses, teachers, news, FAQs, and videos.
- **Registration Management**: Review student applications, verify payment slips, and update enrollment statuses.
- **Institute Info Management**: Update contact details, bank information, and "About Us" content (Mission, Vision, Founder Bio).
- **Newsletter Management**: Monitor subscribers.

### Architecture
The project follows a decoupled architecture:
1. **Frontend**: A single-page application (SPA) that communicates with the backend via a RESTful API.
2. **Backend**: A REST API that handles business logic, authentication, and database operations.
3. **Database**: A relational MySQL database storing all persistent data.
4. **Storage**: Local filesystem for handling uploaded images and documents (under `/uploads`).

---

## 2. Database Schema

### Overview
The project uses a MySQL database to manage all application data. The schema consists of 13 main tables.

### Tables

#### 1. `admins`
Stores administrator credentials for dashboard access.
- `id` (INT, PK, AI)
- `username` (VARCHAR 100, UNIQUE)
- `password` (VARCHAR 255) - Hashed with bcrypt

#### 2. `courses`
Stores course details offered by the institute.
- `id` (INT, PK, AI)
- `title` (VARCHAR 255)
- `image` (VARCHAR 255) - Path to course thumbnail
- `trainer_id` (INT, FK) - Links to `teachers.id`
- `description` (TEXT)
- `duration` (VARCHAR 50)
- `fees` (VARCHAR 50)
- `learning_outcomes` (TEXT)
- `created_at` (TIMESTAMP)

#### 3. `teachers` (Instructors)
Details about the trainers at the institute.
- `id` (INT, PK, AI)
- `name` (VARCHAR 100)
- `designation` (VARCHAR 150)
- `bio` (TEXT)
- `languages` (VARCHAR 255)
- `specialties` (VARCHAR 255)
- `image` (VARCHAR 255)
- `linkedin`, `twitter`, `facebook`, `github` (VARCHAR 255)
- `created_at` (TIMESTAMP)

#### 4. `registrations`
Student applications for courses.
- `id` (INT, PK, AI)
- `name`, `email`, `phone`, `cnic`
- `application_id` (VARCHAR 20, UNIQUE) - Generated for tracking
- `last_degree`, `skills`
- `course_id` (INT, FK) - Links to `courses.id`
- `course_title` (VARCHAR 100)
- `slip` (VARCHAR 255) - Path to uploaded payment slip image
- `status` (ENUM: 'Payment Pending', 'Pending', 'Verified', 'Rejected')
- `created_at`, `updated_at` (TIMESTAMP)

#### 5. `course_schedules`
Timing and venue for specific courses.
- `id` (INT, PK, AI)
- `course_id` (INT, FK) - Links to `courses.id`
- `start_date`, `end_date` (DATETIME)
- `venue` (VARCHAR 255)
- `timing` (VARCHAR 100)
- `created_at` (TIMESTAMP)

#### 6. `news`
Articles and announcements.
- `id` (INT, PK, AI)
- `author`, `category`, `title`, `title_tag`
- `duration` (VARCHAR 100) - Reading time
- `meta_description` (TEXT)
- `content` (LONGTEXT) - Rich text from editor
- `written_by` (VARCHAR 255)
- `image` (VARCHAR 255)
- `created_at` (DATETIME)

#### 7. `about`
Section-based content for the "About Us" page.
- `id` (INT, PK, AI)
- `section` (VARCHAR 255) - e.g., 'mission', 'vision', 'founder'
- `card_heading`, `card_paragraph` (for grid sections)
- `trainer_name`, `title`, `quote`, `bio`, `image` (specifically for 'founder')
- `created_at` (TIMESTAMP)

#### 8. `contact_info`
General contact details for the institute.
- `id` (INT, PK, AI)
- `phone`, `email`, `support_email`, `office_name`
- `address_line1`, `address_line2`, `city`, `country`
- `working_days`, `weekend`
- `map_location` (TEXT) - Embed URL for Google Maps
- `facebook`, `linkedin`, `twitter`, `github` (VARCHAR 255)
- `created_at` (TIMESTAMP)

#### 9. `bank_info`
Bank details for registration fees.
- `BankID` (INT, PK, AI)
- `bank_name`, `account_title`, `account_number`, `iban`, `branch_code`, `branch_address`

#### 10. `contact_messages`
Messages submitted via the contact form.
- `id` (INT, PK, AI)
- `name`, `email`, `phone`, `subject`, `message`, `created_at`

#### 11. `faqs`
- `id` (INT, PK, AI)
- `question`, `answer` (TEXT)

#### 12. `subscribers`
Newsletter subscriptions.
- `id` (INT, PK, AI)
- `email` (VARCHAR 191, UNIQUE)
- `subscribed_at` (TIMESTAMP)

#### 13. `video`
Links to promotional videos.
- `id` (INT, PK, AI)
- `title`, `thumbnail`, `videoUrl`, `created_at`

### Relationships
- `courses.trainer_id` -> `teachers.id` (Many-to-One)
- `registrations.course_id` -> `courses.id" (Many-to-One)
- `course_schedules.course_id` -> `courses.id" (Many-to-One)

---

## 3. API Documentation

### Base URL
The backend server runs locally on `http://localhost:5000/api` by default.

### Authentication
#### `POST /auth/login`
Admin login to receive a JWT token.
- **Request Body**: `{ username, password }`
- **Response**: `{ token }`

### Courses
#### `GET /courses`
Retrieve all courses with trainer details.
#### `GET /courses/:id`
Retrieve a single course by ID.
#### `POST /courses` (Admin)
Add a new course (Multipart/form-data).
#### `PUT /courses/:id` (Admin)
Update an existing course.
#### `DELETE /courses/:id` (Admin)

### Teachers (Instructors)
#### `GET /teachers`
Retrieve all teachers.
#### `GET /teachers/:id`
Retrieve a single teacher by ID.
#### `POST /teachers` (Admin)
Add a new teacher (Multipart/form-data).

### Registrations
#### `POST /registrations`
Submit a new course registration.
#### `POST /registrations/upload-slip`
Upload a payment slip.
#### `GET /registrations/status/:application_id`
Check the status of a registration.
#### `GET /registrations` (Admin)
Retrieve all registrations for the admin panel.
#### `PATCH /registrations/:id/status` (Admin)
Update registration status.

### News & Blog
#### `GET /news`
Retrieve all news articles.
#### `GET /news/:id`
Retrieve a single news article by ID.
#### `POST /news` (Admin)
Add a news article (Multipart/form-data).

### Other Endpoints
- **About Content**: `GET /about`, `PUT /about/:id` (Admin)
- **FAQs**: `GET /faqs`, `POST /faqs`, `DELETE /faqs/:id` (Admin)
- **Contact Info**: `GET /contact-info`, `PUT /contact-info/:id` (Admin)
- **Bank Info**: `GET /bank-info`, `PUT /bank-info/:id` (Admin)
- **Subscribers**: `GET /subscribers`, `POST /subscribers`
- **Videos**: `GET /video`, `POST /video`, `DELETE /video/:id` (Admin)
- **Contact Messages**: `POST /contact-form`, `GET /contact-form` (Admin)
