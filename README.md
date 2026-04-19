# College Appointment System Backend API

Node.js + Express + MongoDB backend for students and professors to manage appointment slots and bookings.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Create environment file:
   ```bash
   cp .env.example .env
   ```
3. Update `.env` with your MongoDB URI and JWT secret.
4. Start server:
   ```bash
   npm run dev
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register student/professor
- `POST /api/auth/login` - Login and receive JWT
- `GET /api/auth/profile` - Current authenticated user

### Professor Availability
- `POST /api/availability` - Create availability slot (professor only)
- `GET /api/availability/:professorId` - List available slots for professor
- `PUT /api/availability/:slotId` - Update slot (professor owner)
- `DELETE /api/availability/:slotId` - Delete slot (professor owner)

### Appointments
- `GET /api/appointments/available` - List available slots (optional `professorId` filter)
- `POST /api/appointments` - Book appointment (student only)
- `GET /api/appointments/my-appointments` - List authenticated user's appointments
- `GET /api/appointments/:appointmentId` - Appointment details
- `DELETE /api/appointments/:appointmentId` - Cancel appointment (owner/assigned professor)
- `GET /api/appointments` - Professor list view of appointments

## Status Tracking

Appointments use `pending`, `confirmed`, `cancelled` states and store `cancelledAt` when cancelled.
