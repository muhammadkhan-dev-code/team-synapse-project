# 🚗 UniRideSync
### Smart Campus Ride Coordination Platform

UniRideSync is a MERN Stack web application that helps university students coordinate rides with other students traveling in the same direction. Instead of waiting for fixed university transport schedules, students can post rides, browse available rides, and request to join them.

---

# 👥 Team Synapse

| Name | Role |
|------|------|
| Muhammad Khan | Database & Integration Lead |
| Talha Abid | Frontend Developer |
| Hamza Ali | Backend Developer |
| Zikra | Frontend Developer / Architecture |

---

# 📁 Project Structure

```
hackathon-project/
│
├── client/          # React + Tailwind CSS
├── server/          # Node.js + Express.js
├── README.md
└── .gitignore
```

---

# 🌿 Git Branches

```
main
develop
feature/frontend
feature/backend
feature/ai
feature/integration
```

## Branch Purpose

### main
- Production-ready code.
- Do NOT push directly.

### develop
- Integration branch.
- All completed features are merged here first.

### feature/frontend
Frontend development.

### feature/backend
Backend APIs and database.

### feature/ai
Ride matching logic, algorithms, and AI-related features.

### feature/integration
Testing, deployment, bug fixing, and frontend-backend integration.

---

# 👨‍💻 Team Workflow

## Step 1

Clone the repository.

```bash
git clone https://github.com/muhammadkhan-dev-code/team-synapse-project.git
cd team-synapse-project
```

---

## Step 2

Checkout your assigned branch.

Example:

```bash
git checkout feature/frontend
```

or

```bash
git checkout feature/backend
```

---

## Step 3

Before starting work every day

```bash
git pull origin develop
```

If needed, merge the latest changes from `develop` into your branch.

---

## Step 4

After completing your work

```bash
git add .
git commit -m "Describe your changes"
git push origin <your-branch>
```

Example

```bash
git push origin feature/frontend
```

---

## Step 5

Create a Pull Request

```
Your Branch
      ↓
   develop
```

Do NOT merge directly into `main`.

---

## Step 6

After testing

```
develop
      ↓
     main
```

Only the team lead should merge into `main`.

---

# 📌 Team Rules

### ✅ Do

- Pull the latest changes before starting work.
- Commit small and meaningful changes.
- Write clear commit messages.
- Test your code before pushing.
- Resolve conflicts before creating a Pull Request.
- Inform the team before making major changes.

---

### ❌ Don't

- Do not push directly to `main`.
- Do not modify another member's code without informing them.
- Do not upload unnecessary files (`node_modules`, `.env`, build folders).
- Do not force push (`git push --force`) unless approved by the team.

---

# 💬 Commit Message Examples

```
feat: Add login page

feat: Create ride API

fix: Resolve navbar responsiveness

style: Improve dashboard layout

refactor: Clean authentication middleware
```

---

# 📦 Running the Project

## Frontend

```bash
cd client
npm install
npm run dev
```

---

## Backend

```bash
cd server
npm install
npm run dev
```

---

# 🚀 Technology Stack

## Frontend

- React.js
- Tailwind CSS

## Backend

- Node.js
- Express.js

## Database

- MongoDB

## Authentication

- JWT
- University Email Verification

---

# 📄 License

This project was developed by **Team Synapse** for a Hackathon and is intended for educational purposes.