# MongoDB Database Setup

This guide will help you set up MongoDB for the IRRISmart application.

## 📋 Table of Contents

1. [Local MongoDB Setup](#local-mongodb-setup)
2. [MongoDB Atlas (Cloud) Setup](#mongodb-atlas-cloud-setup)
3. [Database Schema](#database-schema)
4. [API Endpoints](#api-endpoints)
5. [Environment Variables](#environment-variables)

## 🖥️ Local MongoDB Setup

### Install MongoDB

**macOS (using Homebrew):**
```bash
brew tap mongodb/brew
brew install mongodb-community
```

**Ubuntu/Debian:**
```bash
sudo apt-get install mongodb
```

**Windows:**
Download from [MongoDB Download Center](https://www.mongodb.com/try/download/community)

### Start MongoDB

**macOS:**
```bash
brew services start mongodb-community
```

**Linux:**
```bash
sudo systemctl start mongod
```

**Windows:**
MongoDB should start automatically as a service.

### Verify MongoDB is Running

```bash
mongosh
```

You should see the MongoDB shell prompt.

## ☁️ MongoDB Atlas (Cloud) Setup

1. **Create Account**
   - Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Sign up for a free account

2. **Create Cluster**
   - Click "Build a Database"
   - Choose "FREE" tier (M0)
   - Select your preferred region
   - Click "Create Cluster"

3. **Create Database User**
   - Go to "Database Access"
   - Click "Add New Database User"
   - Create username and password
   - Grant "Read and write to any database" role

4. **Whitelist IP Address**
   - Go to "Network Access"
   - Click "Add IP Address"
   - Choose "Allow Access from Anywhere" (0.0.0.0/0) for development
   - For production, use specific IP addresses

5. **Get Connection String**
   - Go to "Database" → "Connect"
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password

## 🗃️ Database Schema

### Users Collection

```typescript
{
  _id: ObjectId,
  email: string (unique, required),
  password: string (hashed, required),
  name: string (required),
  farmName?: string,
  createdAt: Date,
  updatedAt: Date
}
```

### Fields Collection

```typescript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  name: string (required),
  crop: string (required),
  area: number (hectares, required),
  color: string (hex color),
  coordinates: number[][] (polygon points),
  sensorData: {
    moisture: number (0-100%),
    temperature: number (°C),
    salinity: number (dS/m),
    lastUpdated: Date
  },
  irrigation: {
    isActive: boolean,
    totalMinutes: number,
    remainingMinutes: number,
    flowRate: number (L/min),
    lastIrrigation?: Date,
    lastFertigation?: Date
  },
  createdAt: Date,
  updatedAt: Date
}
```

## 🔌 API Endpoints

### Authentication

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "farmer@example.com",
  "password": "password123",
  "name": "John Doe",
  "farmName": "Green Valley Farm" // optional
}
```

**Response:**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": "...",
    "email": "farmer@example.com",
    "name": "John Doe",
    "farmName": "Green Valley Farm"
  }
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "farmer@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "user": {
    "id": "...",
    "email": "farmer@example.com",
    "name": "John Doe",
    "farmName": "Green Valley Farm"
  }
}
```

#### Get Current User
```http
GET /api/auth/me
```

**Response:**
```json
{
  "user": {
    "id": "...",
    "email": "farmer@example.com",
    "name": "John Doe",
    "farmName": "Green Valley Farm",
    "createdAt": "2025-10-03T..."
  }
}
```

#### Logout
```http
POST /api/auth/logout
```

### Fields

#### Get All Fields
```http
GET /api/fields
```

**Response:**
```json
{
  "fields": [
    {
      "_id": "...",
      "userId": "...",
      "name": "North Field",
      "crop": "Tomatoes",
      "area": 2.5,
      "color": "#22c55e",
      "coordinates": [[lng, lat], ...],
      "sensorData": {
        "moisture": 65,
        "temperature": 28,
        "salinity": 1.2,
        "lastUpdated": "2025-10-03T..."
      },
      "irrigation": {
        "isActive": true,
        "totalMinutes": 60,
        "remainingMinutes": 30,
        "flowRate": 2.5,
        "lastIrrigation": "2025-10-03T..."
      },
      "createdAt": "2025-10-03T...",
      "updatedAt": "2025-10-03T..."
    }
  ]
}
```

#### Get Single Field
```http
GET /api/fields/:id
```

#### Create Field
```http
POST /api/fields
Content-Type: application/json

{
  "name": "North Field",
  "crop": "Tomatoes",
  "area": 2.5,
  "color": "#22c55e",
  "coordinates": [
    [-121.123, 37.456],
    [-121.124, 37.457],
    [-121.125, 37.456]
  ]
}
```

#### Update Field
```http
PATCH /api/fields/:id
Content-Type: application/json

{
  "name": "Updated Field Name",
  "sensorData": {
    "moisture": 70,
    "temperature": 26,
    "salinity": 1.1
  },
  "irrigation": {
    "isActive": true,
    "remainingMinutes": 45
  }
}
```

#### Delete Field
```http
DELETE /api/fields/:id
```

## 🔐 Environment Variables

Update your `.env.local` file:

```env
# Mapbox Configuration
NEXT_PUBLIC_MAPBOX_TOKEN=your_mapbox_token_here

# MongoDB Configuration
# For local MongoDB:
MONGODB_URI=mongodb://localhost:27017/irrismart

# For MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/irrismart

# JWT Secret (IMPORTANT: Change this in production!)
JWT_SECRET=your-super-secret-jwt-key-change-in-production-please
```

## 🧪 Testing the API

### Using curl

**Register:**
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "name": "Test User",
    "farmName": "Test Farm"
  }'
```

**Login:**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }' \
  -c cookies.txt
```

**Create Field:**
```bash
curl -X POST http://localhost:3000/api/fields \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "name": "Test Field",
    "crop": "Wheat",
    "area": 1.5,
    "color": "#22c55e",
    "coordinates": [[-121.1, 37.4], [-121.2, 37.4], [-121.2, 37.5], [-121.1, 37.5]]
  }'
```

## 📊 Database Indexes

The application automatically creates these indexes for optimal performance:

- **Users:** `email` (unique)
- **Fields:** `userId` + `createdAt` (compound index)

## 🔒 Security Features

- ✅ Password hashing with bcrypt
- ✅ JWT authentication with HTTP-only cookies
- ✅ Input validation with Zod
- ✅ User-specific field isolation
- ✅ Secure password requirements (min 6 characters)
- ✅ SQL injection prevention (NoSQL)

## 📝 Notes

1. **Development vs Production:**
   - Use local MongoDB for development
   - Use MongoDB Atlas for production

2. **JWT Secret:**
   - Generate a strong random secret for production
   - Never commit `.env.local` to version control

3. **Database Backup:**
   - For MongoDB Atlas, automatic backups are included
   - For local MongoDB, set up regular backups

4. **Connection Pooling:**
   - Mongoose handles connection pooling automatically
   - The app maintains a single connection across hot reloads

## 🚀 Next Steps

1. Add your MongoDB connection string to `.env.local`
2. Start your Next.js application: `npm run dev`
3. Test the authentication endpoints
4. Create your first field!

For more help, see the [MongoDB Documentation](https://docs.mongodb.com/) or [Mongoose Documentation](https://mongoosejs.com/docs/).

