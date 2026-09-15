# WorkForce — Employee Management System

WorkForce is a full-stack employee management system designed to help organizations manage employee records, attendance, and workforce information from a centralized dashboard.

## Features

### Authentication

- User registration and login
- JWT-based authentication
- Secure HTTP-only authentication cookies
- Protected application routes
- Password hashing with bcrypt
- Logout functionality

### Dashboard

- Total employee statistics
- Active employee statistics
- Employees currently on leave
- Department count
- Recent employees
- Recent activity
- Functional employee search
- Quick employee creation

### Employee Management

- View employees
- Search and filter employees
- Add employees
- Edit employee information
- Delete employees
- View employee details
- Track employee status
- Organize employees by department

### Attendance

- View attendance by date
- Employee check-in
- Employee check-out
- Attendance status tracking
- Working-hours calculation
- Attendance statistics

### Settings

- Profile management interface
- Notification preferences
- Security settings
- Workspace settings

## Tech Stack

### Frontend

- React
- Vite
- React Router
- Lucide React
- CSS

### Backend

- Node.js
- Express.js
- JWT
- bcryptjs
- Zod
- Cookie Parser
- CORS

### Database

- PostgreSQL
- Prisma ORM
- Prisma PostgreSQL adapter

## Project Structure

```text
employee-management/
├── client/
│   ├── api/
│   │   ├── api.js
│   │   ├── attendance.js
│   │   ├── auth.js
│   │   └── employees.js
│   ├── context/
│   │   └── AuthContext.jsx
│   └── src/
│       ├── components/
│       ├── pages/
│       │   ├── Attendance.jsx
│       │   ├── Dashboard.jsx
│       │   ├── Employees.jsx
│       │   ├── Login.jsx
│       │   ├── Register.jsx
│       │   └── Settings.jsx
│       ├── App.css
│       ├── App.jsx
│       └── index.css
│
├── server/
│   ├── prisma/
│   │   ├── migrations/
│   │   └── schema.prisma
│   ├── src/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── routes/
│   │   ├── utils/
│   │   └── server.js
│   ├── .env
│   ├── package.json
│   └── prisma7.config.ts
│
└── README.md
```

## Database Models

### User

Stores application user accounts and authentication information.

### Employee

Stores employee information including:

- Name
- Email
- Phone
- Position
- Department
- Salary
- Hire date
- Employment status

### Attendance

Stores daily attendance records including:

- Employee
- Date
- Check-in time
- Check-out time
- Attendance status

Each employee can have one attendance record per day.

## API Routes

### Authentication

```
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
```

### Employees

```
GET    /api/employees
POST   /api/employees
GET    /api/employees/:id
PUT    /api/employees/:id
DELETE /api/employees/:id
```

### Attendance

```
GET  /api/attendance
POST /api/attendance/check-in
POST /api/attendance/check-out
```

### Health Check

```
GET /api/health
```

## Getting Started

### Prerequisites

Make sure you have the following installed:

- Node.js
- npm
- PostgreSQL

### 1. Clone the repository

```bash
git clone https://github.com/VIOLA895/employee-management.git
cd employee-management
```

### 2. Install frontend dependencies

```bash
cd client
npm install
```

### 3. Install backend dependencies

```bash
cd ../server
npm install
```

### 4. Configure environment variables

Create a `.env` file inside the `server` directory:

```env
DATABASE_URL="postgresql://USERNAME:PASSWORD@localhost:5432/employee_management"
JWT_SECRET="your-secret-key"
PORT=5000
```

Replace the database username and password with your local PostgreSQL credentials.

> **Never commit the `.env` file to GitHub.**

### 5. Run database migrations

From the `server` directory:

```bash
npx prisma migrate dev
npx prisma generate
```

### 6. Start the backend

```bash
npm run dev
```

The backend runs on:

```
http://localhost:5000
```

### 7. Start the frontend

Open another terminal:

```bash
cd client
npm run dev
```

The frontend runs on:

```
http://localhost:5173
```

## Authentication Flow

1. A user registers an account.
2. The password is hashed before being stored.
3. The user logs in with their credentials.
4. The server generates a JWT.
5. The JWT is stored in an HTTP-only cookie.
6. Protected requests include the authentication cookie.
7. Authentication middleware verifies the JWT before allowing access.

## Development Commands

Run the frontend:

```bash
cd client
npm run dev
```

Run the backend:

```bash
cd server
npm run dev
```

Build the frontend:

```bash
cd client
npm run build
```

Run Prisma Studio:

```bash
cd server
npx prisma studio
```

## Security

The application includes:

- Password hashing with bcrypt
- JWT authentication
- HTTP-only authentication cookies
- Protected API routes
- Authentication middleware
- CORS configuration
- Environment variables for sensitive configuration
- Input validation

Sensitive credentials and environment variables should never be committed to the repository.

## Future Improvements

Potential future improvements include:

- Role-based access control
- Password reset functionality
- Persistent profile settings
- Email notifications
- Attendance reports
- Employee performance tracking
- Exporting employee and attendance data
- Advanced analytics
- Production deployment configuration

## Author

**Viola Kambuni**

GitHub: [https://github.com/VIOLA895](https://github.com/VIOLA895)

## License

This project is intended for portfolio and educational purposes.
