# SoundFlow Backend

Backend server for the SoundFlow music streaming application.

## Prerequisites

- Node.js (v14 or higher)
- PostgreSQL (v12 or higher) or Railway.com account
- npm or yarn

## Setup

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file in the root directory with the following variables:

   ### For local PostgreSQL:
   ```
   # Database Configuration
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=soundflow
   DB_USER=postgres
   DB_PASSWORD=postgres

   # JWT Configuration
   JWT_SECRET=your_jwt_secret_key_here
   JWT_EXPIRES_IN=7d

   # Server Configuration
   PORT=5000
   NODE_ENV=development
   ```

   ### For Railway PostgreSQL:
   ```
   # Database Configuration (Railway)
   DATABASE_URL=postgresql://postgres:password@containers-us-west-XX.railway.app:XXXXX/railway

   # JWT Configuration
   JWT_SECRET=your_jwt_secret_key_here
   JWT_EXPIRES_IN=7d

   # Server Configuration
   PORT=5000
   NODE_ENV=development
   ```

4. Create a PostgreSQL database:
   
   ### Local PostgreSQL:
   ```
   createdb soundflow
   ```
   Or using psql:
   ```
   psql -U postgres
   CREATE DATABASE soundflow;
   ```

   ### Railway PostgreSQL:
   - Create a new PostgreSQL database on Railway.com
   - Copy the connection URL from Railway dashboard
   - Paste it as the DATABASE_URL in your .env file

## Database Setup

Initialize the database and create tables:
```
npm run db:init
```

For development, you can force recreate all tables:
```
npm run db:init:force
```

Seed the database with sample data:
```
npm run db:seed
```

Or do both in one command:
```
npm run db:setup
```

## Running the Server

Development mode:
```
npm run dev
```

Production mode:
```
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login a user
- `GET /api/auth/me` - Get current user

### Users
- `GET /api/users/:id` - Get user profile
- `PUT /api/users/:id` - Update user profile
- `POST /api/users/:id/follow` - Follow a user
- `DELETE /api/users/:id/follow` - Unfollow a user

### Playlists
- `GET /api/playlists` - Get all playlists
- `GET /api/playlists/:id` - Get a playlist
- `POST /api/playlists` - Create a playlist
- `PUT /api/playlists/:id` - Update a playlist
- `DELETE /api/playlists/:id` - Delete a playlist
- `POST /api/playlists/:id/tracks/:trackId` - Add a track to a playlist
- `DELETE /api/playlists/:id/tracks/:trackId` - Remove a track from a playlist

### Tracks
- `GET /api/tracks` - Get all tracks
- `GET /api/tracks/:id` - Get a track
- `GET /api/tracks/search?q=query` - Search tracks
- `POST /api/tracks/:id/like` - Like a track
- `DELETE /api/tracks/:id/like` - Unlike a track

## License

ISC 