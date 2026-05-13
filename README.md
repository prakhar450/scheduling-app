# Scheduling App

A full-stack appointment scheduling application where users can create availability slots and book meetings with each other. Built with Node.js, Express, and MongoDB.

## Features

- User registration and authentication (Passport.js)
- Create and manage personal schedules
- Add, view, and delete available time slots
- Book slots with other registered users
- Flash notifications for user actions

## Tech Stack

- **Backend:** Node.js, Express
- **Database:** MongoDB (Mongoose ODM)
- **Auth:** Passport.js with local strategy
- **Views:** EJS templates with partials
- **Sessions:** express-session with flash messages

## Getting Started

### Prerequisites

- Node.js
- MongoDB

### Setup

```bash
git clone https://github.com/prakhar450/scheduling-app.git
cd scheduling-app
npm install
```

Start MongoDB in a separate terminal:

```bash
mongod
```

Run the app:

```bash
node app.js
```

### Usage

1. Register a new account
2. Create a schedule (one per user)
3. Add available time slots with descriptions
4. Other users can browse and book your available slots
5. Booked slots appear in both users' accounts

## Project Structure

```
app.js               # Express server + middleware config
models/
  user.js            # User model (passport-local-mongoose)
  schedule.js        # Schedule model (references User + Slots)
  slot.js            # Slot model (timestamp, invitee, status)
routes/
  auth.js            # Registration and login routes
  schedules.js       # Schedule CRUD
  slots.js           # Slot management and booking
middleware/
  index.js           # Auth middleware
views/               # EJS templates
  schedules/         # Schedule views
  slots/             # Slot views
  partials/          # Shared components
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `DATABASEURL` | MongoDB connection string (defaults to localhost) |
