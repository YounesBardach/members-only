<p align="center">
  <img src="https://i.postimg.cc/d3H873p6/Chat-GPT-Image-Aug-13-2025-04-34-43-PM.png" alt="Members Only Banner" width="900" />
</p>

<div align="center">

# Members Only (Node.js + Passport + PostgreSQL)

A small app built to practice authentication and authorization in
Node.js as part of The Odin Project.

[![Node.js](https://img.shields.io/badge/Node.js-18%2B-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4-black?logo=express&logoColor=white)](https://expressjs.com/)
[![Passport](https://img.shields.io/badge/Passport-Local-34E27A?logo=passport&logoColor=white)](http://www.passportjs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Railway-4169E1?logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![EJS](https://img.shields.io/badge/EJS-Templates-8BC34A)](https://ejs.co/)
[![connect-pg-simple](https://img.shields.io/badge/Session%20Store-connect--pg--simple-7952B3)](https://github.com/voxpelli/node-connect-pg-simple)

</div>

---

## Table of Contents

- [About](#about)
- [Requirements](#requirements)
- [Quick start](#quick-start)
- [Environment variables](#environment-variables)
- [Scripts](#scripts)
- [Tech stack](#tech-stack)
- [Project structure](#project-structure)
- [Database schema](#database-schema)
- [Routes](#routes)
- [Deployment (Railway)](#deployment-railway)
- [Notes](#notes)

---

## About

This app implements a private “Members Only” message board:

- Anyone can view the list of messages (anonymous authors for non-members)
- Users can sign up and log in
- Members can see message authors and timestamps
- Admins can delete messages

The project follows The Odin Project assignment for practicing authentication
with Passport.

- Assignment:
  [The Odin Project — NodeJS: Project Members Only](https://www.theodinproject.com/lessons/node-path-nodejs-members-only)
- Hosting: Backend and PostgreSQL are deployed on Railway

## Requirements

- Node.js 18+
- npm
- PostgreSQL (local for development; Railway in production)

## Quick start

```bash
# 1) Install dependencies
npm install

# 2) Create and populate .env (see below)

# 3) Create tables locally (optional if using Railway-managed DB with existing tables)
npm run db:init (js script)

# 4) Start the server
npm start
# Server: http://localhost:3080
```

Visit `/signup` to create an account, then `/login` to sign in. After logging in
you can:

- Visit `/vip` to join the club (see passcodes below)
- Create messages at `/messages/new`

## Environment variables

Create a `.env` in the project root:

```env
# Server
PORT=3080
NODE_ENV=development

# Sessions (choose one)
SESSION_SECRET=replace-with-strong-secret
# or (used automatically on Railway if set)
RAILWAY_SESSION_SECRET=replace-with-strong-secret

# Database: either provide a full URL or individual parts
DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DB_NAME

# If not using DATABASE_URL, provide all of the following:
DB_USER=postgres
DB_PASSWORD=postgres
DB_HOST=localhost
DB_PORT=5432
DB_NAME=members_only
```

Notes:

- The app prefers `DATABASE_URL` when present (typical on Railway). Otherwise it
  builds a connection string from `DB_*` values.
- Sessions are stored in Postgres using `connect-pg-simple` in a `user_sessions`
  table.

## Scripts

- `npm start` — start the server (`app.mjs`)
- `npm run db:init` — create tables (`users`, `messages`, and `user_sessions`)

## Tech stack

- **Backend:** Node.js, Express, EJS (server-rendered with
  `express-ejs-layouts`)
- **Auth:** Passport (Local strategy), `express-session`, `connect-pg-simple`,
  `connect-flash`
- **Database:** PostgreSQL (`pg`), raw SQL queries
- **Validation:** `express-validator`, server-side input sanitization

## Project structure

```
.
├─ public/
│  ├─ css/
│  └─ images/
├─ views/
│  ├─ errors/
│  └─ *.ejs
├─ routes/
│  ├─ homeRouter.mjs
│  ├─ loginRouter.mjs
│  ├─ signupRouter.mjs
│  ├─ vipRouter.mjs
│  └─ messageRouter.mjs
├─ controllers/
│  ├─ loginController.mjs
│  ├─ signupController.mjs
│  ├─ vipController.mjs
│  └─ messageController.mjs
├─ middleware/
│  ├─ auth.mjs
│  ├─ authentication/
│  │  └─ hashPassword.mjs
│  └─ validation/
│     ├─ loginValidation.mjs
│     ├─ signupValidation.mjs
│     └─ vipValidation.mjs
├─ models/
│  ├─ pool.mjs
│  ├─ createTables.mjs
│  ├─ userQueries.mjs
│  └─ messageQueries.mjs
├─ config/
│  └─ passport.mjs
├─ app.mjs
└─ README.md
```

## Database schema

Tables created by `models/createTables.mjs`:

- `users`
  - `id` (identity PK)
  - `first_name`, `last_name`
  - `username` (unique)
  - `password` (bcrypt hash)
  - `membership` (boolean, default `false`)
  - `admin` (boolean, default `false`)
- `messages`
  - `id` (identity PK)
  - `title`, `text`
  - `timestamp` (default `CURRENT_TIMESTAMP`)
  - `user_id` (FK → `users.id`, `ON DELETE CASCADE`)
- `user_sessions` (for `connect-pg-simple`)

## Routes

- **Home**
  - `GET /` — list all messages; author names visible to members
- **Auth**
  - `GET /login` — login page
  - `POST /login` — login
  - `GET /login/logout` — logout
  - `GET /signup` — sign-up page
  - `POST /signup` — create user
- **Membership**
  - `GET /vip` — members-only page (requires authentication)
  - `POST /vip` — submit passcodes to join club (and optionally become admin)
- **Messages** (require authentication)
  - `GET /messages/new` — new message form
  - `POST /messages` — create message
  - `POST /messages/:messageId/delete` — delete message (admins only in UI)

## Deployment (Railway)

This project is designed to be deployed entirely on Railway (web service +
PostgreSQL).

1. Create a Railway project and add a PostgreSQL service
2. Connect this repository as a web service
3. Set environment variables on the web service:
   - `NODE_ENV=production`
   - `RAILWAY_SESSION_SECRET` (or `SESSION_SECRET`) — strong random string
   - `DATABASE_URL` — usually injected automatically when you link the Postgres
     service
4. Start command: `npm start`
5. Run one-off task (first deploy only): `npm run db:init` to create tables

## Notes

- Passwords are hashed with `bcryptjs` at signup
- Session cookies are `secure` when `NODE_ENV=production`
- Flash messages are surfaced across views for success/error feedback
- VIP passcodes (demo): `vip` to join members; optional admin passcode `boss`
  (see `controllers/vipController.mjs`). For production, consider moving these
  to env vars.
