# SoundFlow - Music Streaming Service

A modern music streaming web application built with React, Node.js, and PostgreSQL.

## Features

- User authentication (login/registration)
- Music streaming with customizable quality settings
- Personalized playlists and recommendations
- Collaborative playlist editing
- Real-time music player
- Profile management
- What's New section for latest releases
- Search functionality

## Tech Stack

### Frontend
- React
- Vite
- Tailwind CSS
- React Router
- Redux Toolkit

### Backend
- Node.js
- Express.js
- PostgreSQL
- Sequelize ORM
- JWT Authentication

## Project Structure

```
soundflow/
├── frontend/          # React frontend application
└── backend/           # Node.js backend server
```

## Setup Instructions

### Frontend Setup
1. Navigate to the frontend directory
2. Install dependencies: `npm install`
3. Start development server: `npm run dev`

### Backend Setup
1. Navigate to the backend directory
2. Install dependencies: `npm install`
3. Set up environment variables
4. Start server: `npm run dev`

## Environment Variables

Create `.env` files in both frontend and backend directories with the following variables:

### Backend (.env)
```
PORT=5000
DB_HOST=localhost
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=soundflow
JWT_SECRET=your_jwt_secret
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:5000
``` 