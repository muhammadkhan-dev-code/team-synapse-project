# UniRideSync — Campus Ride-Sharing Platform

> **Safe. Simple. Shared.** — A secure, real-time ride-sharing web app built exclusively for verified university students and faculty.

![UniRideSync Banner](./stui_design/01-screen.png)

---

## 📋 Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Project Architecture (MVC)](#project-architecture-mvc)
- [Folder Structure](#folder-structure)
- [Getting Started](#getting-started)
- [Pages & Routes](#pages--routes)
- [API Integration Guide (for Backend Developers)](#api-integration-guide-for-backend-developers)
  - [Base URL & Auth](#base-url--auth)
  - [Authentication Endpoints](#authentication-endpoints)
  - [Ride Endpoints](#ride-endpoints)
  - [User / Profile Endpoints](#user--profile-endpoints)
- [Data Models](#data-models)
- [Design System](#design-system)
- [Environment Variables](#environment-variables)
- [Contributing](#contributing)

---

## Overview

UniRideSync is a campus commute-sharing platform designed for university communities. It allows students and faculty to:

- **Post rides** they're offering with destination, time, available seats, and pricing.
- **Search & discover** available rides by destination, time, and seat count.
- **Request to join** rides and manage participant acceptance/decline.
- **Track ride history** — offered and taken — with ratings and status.
- **View driver profiles** with ratings, badges, vehicle info, and CO₂ savings.

---

## Tech Stack

| Layer       | Technology                                |
|-------------|-------------------------------------------|
| Framework   | React 19 + Vite 8                        |
| Styling     | Tailwind CSS v4                           |
| Routing     | React Router v6                           |
| Icons       | Lucide React                              |
| Architecture| MVC (Models, Services, Controllers, Views)|

---

## Project Architecture (MVC)

The codebase follows a clean **MVC (Model-View-Controller)** pattern:

```
┌─────────────────────────────────────────────────────────────┐
│                        VIEW LAYER                           │
│   views/pages/   — Full page components (6 pages)          │
│   views/components/ — Reusable UI components               │
├─────────────────────────────────────────────────────────────┤
│                     CONTROLLER LAYER                        │
│   controllers/useAuth.js    — Auth state (React Context)   │
│   controllers/useRides.js   — Ride CRUD & state hooks      │
│   controllers/useProfile.js — Profile state hook           │
├─────────────────────────────────────────────────────────────┤
│                      SERVICE LAYER                          │
│   services/api.js           — Base fetch wrapper with auth │
│   services/authService.js   — Login, logout, register      │
│   services/rideService.js   — Ride CRUD operations         │
│   services/userService.js   — Profile operations           │
├─────────────────────────────────────────────────────────────┤
│                       MODEL LAYER                           │
│   models/User.js            — User & Vehicle models        │
│   models/Ride.js            — Ride, Participant, History   │
└─────────────────────────────────────────────────────────────┘
```

---

## Folder Structure

```
client/
├── public/
├── src/
│   ├── models/                  # Data models (plain JS classes)
│   │   ├── User.js              # User, Vehicle
│   │   └── Ride.js              # Ride, Participant, RideHistory
│   │
│   ├── services/                # API service layer (backend-ready)
│   │   ├── api.js               # Base fetch wrapper (set BASE_URL here)
│   │   ├── authService.js       # Auth operations
│   │   ├── rideService.js       # Ride CRUD + mock data
│   │   └── userService.js       # Profile operations
│   │
│   ├── controllers/             # Business logic hooks
│   │   ├── useAuth.js           # AuthContext + login/logout hooks
│   │   ├── useRides.js          # useRides, useRideDetail, useCreateRide, useMyRides
│   │   └── useProfile.js        # useProfile hook
│   │
│   ├── views/
│   │   ├── components/          # Reusable UI components
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── RideCard.jsx
│   │   │   ├── SearchBar.jsx
│   │   │   ├── StatsCard.jsx
│   │   │   ├── RideHistoryItem.jsx
│   │   │   └── ParticipantRow.jsx
│   │   │
│   │   └── pages/               # Full page views
│   │       ├── LandingPage.jsx  # / — Marketing landing page
│   │       ├── LoginPage.jsx    # /login — Auth page
│   │       ├── DashboardPage.jsx # /dashboard — Browse rides
│   │       ├── PostRidePage.jsx  # /post-ride — Create a ride
│   │       ├── MyRidesPage.jsx   # /my-rides — User's rides
│   │       ├── RideDetailsPage.jsx # /rides/:id — Ride detail
│   │       └── ProfilePage.jsx   # /profile — User profile
│   │
│   ├── App.jsx                  # Route definitions
│   ├── main.jsx                 # Entry point (BrowserRouter + AuthProvider)
│   └── index.css                # Tailwind CSS + global styles
│
├── stui_design/                 # Original UI design screens (reference)
├── index.html
├── vite.config.js
└── package.json
```

---

## Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Set environment variables
cp .env.example .env
# Set VITE_API_URL to your backend URL

# 3. Start dev server
npm run dev

# 4. Build for production
npm run build
```

---

## Pages & Routes

| Route          | Page                | Auth Required |
|----------------|---------------------|---------------|
| `/`            | Landing Page        | ❌ No         |
| `/login`       | Login Page          | ❌ No         |
| `/signup`      | Signup (same view)  | ❌ No         |
| `/dashboard`   | Browse Rides        | ✅ Yes        |
| `/post-ride`   | Post a Ride         | ✅ Yes        |
| `/my-rides`    | My Rides            | ✅ Yes        |
| `/rides/:id`   | Ride Details        | ✅ Yes        |
| `/profile`     | User Profile        | ✅ Yes        |

---

## API Integration Guide (for Backend Developers)

The frontend is **fully wired** to use a real backend. All you need to do is:

1. Set `VITE_API_URL` in `.env` to your backend URL.
2. In each service file, **uncomment** the real `apiRequest()` call and **remove** the mock code.

### Base URL & Auth

- **Base URL**: `http://localhost:5000/api` (override with `VITE_API_URL`)
- **Auth**: Bearer token in `Authorization` header. Token stored in `localStorage` under key `uniride_token`.

```js
// services/api.js — already configured
Authorization: `Bearer ${token}`
```

---

### Authentication Endpoints

#### `POST /api/auth/login`
Login with university email.

**Request Body:**
```json
{
  "email": "student@university.edu",
  "password": "securePassword123"
}
```

**Response (200):**
```json
{
  "user": {
    "id": "usr_001",
    "name": "Alexander Chen",
    "email": "alexander.chen@university.edu",
    "avatar": "https://...",
    "rating": 4.9,
    "totalReviews": 128,
    "isVerified": true,
    "verifiedType": "Student",
    "co2Saved": 142,
    "totalRides": 86,
    "vehicle": {
      "make": "Toyota", "model": "Camry", "year": "2022",
      "color": "Navy Blue", "licensePlate": "ABC-1234"
    }
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error (401):**
```json
{ "message": "Invalid email or password" }
```

---

#### `POST /api/auth/register`
Register a new university account.

**Request Body:**
```json
{
  "name": "Jane Doe",
  "email": "jane.doe@university.edu",
  "password": "securePassword123"
}
```

**Response (201):** Same as login response.

---

#### `POST /api/auth/logout`
Invalidate the current session (optional, frontend also clears localStorage).

**Headers:** `Authorization: Bearer <token>`

**Response (200):** `{ "message": "Logged out" }`

---

#### `GET /api/auth/me`
Get the currently authenticated user.

**Headers:** `Authorization: Bearer <token>`

**Response (200):** User object (same as login response user field).

---

### Ride Endpoints

#### `GET /api/rides`
Get all available rides with optional filters.

**Query Parameters:**

| Param         | Type    | Description                        |
|---------------|---------|------------------------------------|
| `destination` | string  | Filter by destination keyword      |
| `time`        | string  | Filter by departure time (HH:MM)   |
| `seats`       | number  | Minimum seats required             |
| `sort`        | string  | `latest` or `price_asc`            |
| `page`        | number  | Pagination (default: 1)            |
| `limit`       | number  | Items per page (default: 10)       |

**Response (200):**
```json
{
  "rides": [
    {
      "id": "ride_001",
      "title": "Morning Campus Commute",
      "driver": {
        "id": "usr_d01", "name": "Alex Rivera",
        "avatar": "https://...", "rating": 5.0, "totalReviews": 42,
        "isVerified": true, "verifiedType": "Student"
      },
      "origin": "Campus Central Hub",
      "destination": "Downtown Tech District",
      "departureTime": "08:30 AM",
      "date": "2024-10-24",
      "seatsAvailable": 2,
      "totalSeats": 4,
      "price": 3.50,
      "status": "active",
      "estimatedTime": "18 min"
    }
  ],
  "total": 42,
  "page": 1,
  "limit": 10
}
```

---

#### `GET /api/rides/:id`
Get a single ride with full details including participants.

**Response (200):**
```json
{
  "id": "ride_005",
  "title": "Evening Campus Commuter",
  "driver": { /* full User object */ },
  "origin": "North Campus Hub",
  "destination": "Downtown Tech Center",
  "departureTime": "17:30",
  "date": "Oct 24",
  "seatsAvailable": 3,
  "totalSeats": 4,
  "price": 4.50,
  "status": "confirmed",
  "estimatedTime": "22 min",
  "notes": "Quiet ride, podcasts playing.",
  "participants": [
    {
      "id": "p_01",
      "user": { "id": "usr_p01", "name": "Maya Chen", "rating": 5.0, "totalRides": 45 },
      "status": "accepted"
    }
  ],
  "pendingRequests": [
    {
      "id": "p_02",
      "user": { "id": "usr_p02", "name": "Liam Henderson", "rating": 4.9, "totalRides": 12 },
      "status": "pending"
    }
  ]
}
```

---

#### `POST /api/rides`
Create a new ride (driver posts a ride).

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "origin": "Campus Central Hub",
  "destination": "Downtown Tech District",
  "departureTime": "2024-10-24T08:30:00",
  "seatsAvailable": 3,
  "totalSeats": 3,
  "price": 3.50,
  "notes": "No smoking, music allowed."
}
```

**Response (201):** The created ride object.

---

#### `POST /api/rides/:id/request`
Request to join a ride as a passenger.

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{ "success": true, "message": "Request sent successfully!" }
```

---

#### `PATCH /api/rides/:rideId/participants/:userId/accept`
Accept a passenger's join request (driver only).

**Headers:** `Authorization: Bearer <token>`

**Response (200):** `{ "success": true }`

---

#### `PATCH /api/rides/:rideId/participants/:userId/decline`
Decline a passenger's join request (driver only).

**Headers:** `Authorization: Bearer <token>`

**Response (200):** `{ "success": true }`

---

#### `GET /api/rides/my`
Get the current user's rides.

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "offered": [
    {
      "id": "rh_001",
      "origin": "Campus North",
      "destination": "West Station",
      "dateTime": "Yesterday, 4:30 PM",
      "vehicle": "Honda Civic (White)",
      "passengerCount": 3,
      "passengers": [{ "id": "p1", "avatar": "..." }],
      "ratingReceived": 5,
      "status": "completed"
    }
  ],
  "taken": [ /* same structure */ ]
}
```

---

### User / Profile Endpoints

#### `GET /api/users/:id`
Get a user's public profile.

**Response (200):**
```json
{
  "id": "usr_001",
  "name": "Alexander Chen",
  "email": "alexander.chen@university.edu",
  "avatar": "https://...",
  "rating": 4.9,
  "totalReviews": 128,
  "totalRides": 86,
  "badges": ["Safe Driver", "Punctual", "Great Conversation"],
  "isVerified": true,
  "verifiedType": "Student",
  "major": "CS Major",
  "year": "Senior Year",
  "bio": "Quiet rider, always on time.",
  "co2Saved": 142,
  "routesCount": 4,
  "vehicle": {
    "make": "Toyota", "model": "Camry", "year": "2022",
    "color": "Navy Blue", "licensePlate": "ABC-1234"
  }
}
```

---

#### `GET /api/users/me`
Get the current authenticated user's full profile.

**Headers:** `Authorization: Bearer <token>`

**Response (200):** Same as `/api/users/:id`.

---

#### `PATCH /api/users/me`
Update the current user's profile.

**Headers:** `Authorization: Bearer <token>`

**Request Body (all optional):**
```json
{
  "name": "Alex Chen",
  "bio": "Updated bio text",
  "avatar": "https://...",
  "vehicle": {
    "make": "Honda", "model": "Civic", "year": "2023",
    "color": "White", "licensePlate": "XYZ-5678"
  }
}
```

**Response (200):** Updated user object.

---

## Data Models

### User
| Field           | Type     | Description                              |
|-----------------|----------|------------------------------------------|
| `id`            | string   | Unique user ID                           |
| `name`          | string   | Full name                                |
| `email`         | string   | University email                         |
| `avatar`        | string   | URL to profile photo                     |
| `rating`        | number   | Average rating (1–5)                     |
| `totalReviews`  | number   | Number of ratings received               |
| `totalRides`    | number   | Total rides shared                       |
| `badges`        | string[] | Achievement badges                       |
| `isVerified`    | boolean  | University email verified                |
| `verifiedType`  | string   | "Student" / "Faculty" / "Staff"          |
| `major`         | string   | Academic major                           |
| `year`          | string   | Academic year                            |
| `bio`           | string   | Short bio                                |
| `co2Saved`      | number   | Total kg CO₂ saved                       |
| `routesCount`   | number   | Number of unique routes used             |
| `vehicle`       | Vehicle  | Driver's vehicle details (nullable)      |

### Ride
| Field             | Type          | Description                           |
|-------------------|---------------|---------------------------------------|
| `id`              | string        | Unique ride ID                        |
| `title`           | string        | Ride title/name                       |
| `driver`          | User          | Driver user object                    |
| `origin`          | string        | Pickup location                       |
| `destination`     | string        | Drop-off location                     |
| `departureTime`   | string        | "HH:MM AM/PM" or "HH:MM"             |
| `date`            | string        | Date string or ISO date               |
| `seatsAvailable`  | number        | Remaining available seats             |
| `totalSeats`      | number        | Total seats offered                   |
| `price`           | number        | Cost per passenger (USD)              |
| `status`          | string        | "active" / "confirmed" / "completed" / "cancelled" |
| `participants`    | Participant[] | Accepted passengers                   |
| `pendingRequests` | Participant[] | Pending join requests                 |
| `notes`           | string        | Optional driver notes                 |
| `estimatedTime`   | string        | Estimated travel duration             |

---

## Design System

| Token          | Value      |
|----------------|------------|
| Primary        | `#0A1F44`  |
| Secondary      | `#2563EB`  |
| Tertiary/Teal  | `#14B8A6`  |
| Background     | `#F8FAFC`  |
| Surface        | `#FFFFFF`  |
| Error          | `#EF4444`  |
| Font           | Inter      |
| Border Radius  | 8px / 16px |

---

## Environment Variables

Create a `.env` file at the project root:

```env
# Backend API base URL (no trailing slash)
VITE_API_URL=http://localhost:5000/api
```

---

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Make your changes following the MVC structure
4. Test thoroughly across all pages
5. Submit a pull request

---

*Built with ❤️ for the academic community. UniRideSync © 2024*
