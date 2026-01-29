# MongoDB Setup Guide

Your Beers eCommerce app now uses **MongoDB** as the database.

## Prerequisites

MongoDB must be installed and running on your system.

### Install MongoDB

#### macOS
```bash
# Using Docker (recommended)
docker run -d -p 27017:27017 --name mongodb mongo:latest

# OR Download from MongoDB Community Server
# Visit: https://www.mongodb.com/try/download/community
```

#### Windows/Linux
```bash
# Download from MongoDB Community Server
# Visit: https://www.mongodb.com/try/download/community
```

## Getting Started

### 1. Start MongoDB
If using Docker:
```bash
docker start mongodb
```

If installed locally:
```bash
mongod
```

### 2. Seed the Database
From the backend directory, run:
```bash
cd backend
node seed.js
```

This will populate your MongoDB with 6 Nepali beers.

### 3. Start the Backend
```bash
cd backend
npm start
# Backend runs on http://localhost:5001
```

### 4. Start the Frontend (in another terminal)
```bash
npm run dev
# Frontend runs on http://localhost:3000
```

## Environment Variables

**Backend (.env.local)**
```
MONGODB_URI=mongodb://localhost:27017/beers-ecommerce
PORT=5001
```

## Database Schema

### Beer Collection
```javascript
{
  _id: ObjectId,
  name: String,
  brewery: String,
  style: String,
  description: String,
  rating: Number (0-5),
  abv: Number,
  image: String,
  price: Number,
  createdAt: Date,
  updatedAt: Date
}
```

## MongoDB Connection Issues?

If you get connection errors:

1. **Make sure MongoDB is running**
   ```bash
   # Check if MongoDB is running on port 27017
   lsof -i :27017
   ```

2. **For Docker users**, ensure the container is running:
   ```bash
   docker ps
   ```

3. **Alternative: Use MongoDB Atlas (Cloud)**
   - Sign up at https://www.mongodb.com/cloud/atlas
   - Create a cluster and get your connection string
   - Replace `MONGODB_URI` in `.env.local` with your Atlas URL

## Commands

- `npm start` - Start backend server with MongoDB
- `node seed.js` - Seed initial data to MongoDB
- `npm run dev` - Start backend in development mode
