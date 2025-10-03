# MongoDB Quick Start Guide

## 🚀 Getting Started

### 1. Install MongoDB (if using local database)

**macOS:**
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

**Or use MongoDB Atlas (Cloud):**
- Sign up at https://www.mongodb.com/cloud/atlas
- Create a free cluster
- Get your connection string
- Update `MONGODB_URI` in `.env.local`

### 2. Environment Variables

Your `.env.local` is already configured with:
```env
MONGODB_URI=mongodb://localhost:27017/irrismart
JWT_SECRET=your-super-secret-jwt-key-change-in-production-please
```

**For MongoDB Atlas**, replace with:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/irrismart
```

### 3. Start Your Application

```bash
npm run dev
```

The database will connect automatically!

## 📱 Using the API

### Example: Register a User

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "farmer@example.com",
    "password": "password123",
    "name": "John Farmer",
    "farmName": "Sunny Valley Farm"
  }'
```

### Example: Login

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{
    "email": "farmer@example.com",
    "password": "password123"
  }'
```

### Example: Create a Field

```bash
curl -X POST http://localhost:3000/api/fields \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "name": "North Field",
    "crop": "Tomatoes",
    "area": 2.5,
    "color": "#22c55e",
    "coordinates": [
      [-121.123, 37.456],
      [-121.124, 37.457],
      [-121.125, 37.458],
      [-121.123, 37.456]
    ]
  }'
```

### Example: Get All Fields

```bash
curl http://localhost:3000/api/fields -b cookies.txt
```

## 🔍 Frontend Integration Example

### Create a Login Form Component

```typescript
// components/login-form.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function LoginForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      router.push("/dashboard");
      router.refresh();
    } else {
      alert("Login failed");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        type="email"
        placeholder="Email"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
      />
      <Input
        type="password"
        placeholder="Password"
        value={formData.password}
        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
      />
      <Button type="submit">Login</Button>
    </form>
  );
}
```

### Fetch Fields in Component

```typescript
// components/fields-list.tsx
"use client";

import { useEffect, useState } from "react";

export function FieldsList() {
  const [fields, setFields] = useState([]);

  useEffect(() => {
    fetch("/api/fields")
      .then((res) => res.json())
      .then((data) => setFields(data.fields));
  }, []);

  return (
    <div>
      {fields.map((field) => (
        <div key={field._id}>
          <h3>{field.name}</h3>
          <p>Crop: {field.crop}</p>
          <p>Area: {field.area} ha</p>
          <p>Moisture: {field.sensorData.moisture}%</p>
        </div>
      ))}
    </div>
  );
}
```

### Update Map to Use Database

Update `components/full-screen-map.tsx` to save fields to database:

```typescript
const handleZoneCreate = async (feature: Feature<Polygon>) => {
  // ... existing code ...

  // Save to database
  const res = await fetch("/api/fields", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: zoneData.name,
      crop: zoneData.crop,
      area: zoneData.area,
      color: zoneData.color,
      coordinates: feature.geometry.coordinates[0],
    }),
  });

  if (res.ok) {
    const { field } = await res.json();
    console.log("Field saved to database:", field);
  }
};
```

## 🗂️ Database Structure

### Users Collection
```javascript
{
  _id: ObjectId("..."),
  email: "farmer@example.com",
  password: "$2a$10$...", // hashed
  name: "John Farmer",
  farmName: "Sunny Valley Farm",
  createdAt: ISODate("2025-10-03T..."),
  updatedAt: ISODate("2025-10-03T...")
}
```

### Fields Collection
```javascript
{
  _id: ObjectId("..."),
  userId: ObjectId("..."),
  name: "North Field",
  crop: "Tomatoes",
  area: 2.5,
  color: "#22c55e",
  coordinates: [[-121.123, 37.456], ...],
  sensorData: {
    moisture: 65,
    temperature: 28,
    salinity: 1.2,
    lastUpdated: ISODate("2025-10-03T...")
  },
  irrigation: {
    isActive: true,
    totalMinutes: 60,
    remainingMinutes: 30,
    flowRate: 2.5,
    lastIrrigation: ISODate("2025-10-03T...")
  },
  createdAt: ISODate("2025-10-03T..."),
  updatedAt: ISODate("2025-10-03T...")
}
```

## 🔐 Authentication Flow

1. User registers → Password is hashed → User saved to DB
2. User logs in → Password verified → JWT token created → Cookie set
3. Protected routes check cookie → Verify JWT → Allow/deny access
4. Fields are user-specific → Only show fields for logged-in user

## 📊 Viewing Data

### Using MongoDB Compass (GUI)
1. Download: https://www.mongodb.com/products/compass
2. Connect to `mongodb://localhost:27017`
3. Browse `irrismart` database
4. View `users` and `fields` collections

### Using MongoDB Shell
```bash
mongosh
use irrismart
db.users.find()
db.fields.find()
```

## 🛠️ Useful Commands

**Clear all users:**
```javascript
db.users.deleteMany({})
```

**Clear all fields:**
```javascript
db.fields.deleteMany({})
```

**Find fields for specific user:**
```javascript
db.fields.find({ userId: ObjectId("...") })
```

**Update sensor data:**
```javascript
db.fields.updateOne(
  { _id: ObjectId("...") },
  { $set: { "sensorData.moisture": 75 } }
)
```

## ✅ Next Steps

1. ✅ MongoDB is configured
2. ✅ API routes are ready
3. ✅ Database models are set up
4. 🔄 Create login/register pages
5. 🔄 Update map component to use real database
6. 🔄 Add authentication middleware to protect routes

For full API documentation, see `DATABASE_SETUP.md`

