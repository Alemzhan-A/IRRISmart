# 🔐 Authentication Guide

## Overview

IRRISmart now includes a complete authentication system with:
- ✅ User registration and login
- ✅ JWT-based authentication with HTTP-only cookies
- ✅ Protected routes (redirect to login if not authenticated)
- ✅ User context available throughout the app
- ✅ Secure password hashing with bcrypt
- ✅ Beautiful login/register UI

## 🚀 Getting Started

### 1. Set Up MongoDB

Make sure MongoDB is running and your `.env.local` is configured:

```env
MONGODB_URI=mongodb://localhost:27017/irrismart
JWT_SECRET=your-super-secret-jwt-key-change-in-production-please
```

### 2. Start the Application

```bash
npm run dev
```

### 3. Register Your First User

1. Navigate to http://localhost:3000
2. You'll be automatically redirected to `/login`
3. Click "Sign up" to go to `/register`
4. Fill out the registration form:
   - **Name**: Your full name
   - **Email**: Your email address
   - **Farm Name**: (Optional) Your farm's name
   - **Password**: At least 6 characters
   - **Confirm Password**: Must match password

5. Click "Create Account"
6. You'll be automatically logged in and redirected to the dashboard

## 📱 Authentication Flow

### Registration Flow
```
User fills form → POST /api/auth/register → 
Password hashed → User saved to DB → 
JWT token created → Cookie set → 
User logged in → Redirect to dashboard
```

### Login Flow
```
User enters credentials → POST /api/auth/login → 
Password verified → JWT token created → 
Cookie set → User logged in → 
Redirect to dashboard
```

### Protected Route Flow
```
User visits page → Middleware checks cookie → 
If no token → Redirect to /login
If token valid → Allow access
```

### Logout Flow
```
User clicks logout → Confirmation dialog → 
POST /api/auth/logout → Cookie cleared → 
Redirect to /login
```

## 🔑 Using Authentication in Components

### Get Current User

```typescript
"use client";

import { useAuth } from "@/lib/contexts/auth-context";

export function MyComponent() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>Not authenticated</div>;
  }

  return (
    <div>
      <h1>Welcome, {user.name}!</h1>
      <p>Email: {user.email}</p>
      <p>Farm: {user.farmName}</p>
    </div>
  );
}
```

### Manual Login

```typescript
"use client";

import { useAuth } from "@/lib/contexts/auth-context";

export function LoginButton() {
  const { login } = useAuth();

  const handleLogin = async () => {
    try {
      await login("farmer@example.com", "password123");
      // User is now logged in and redirected
    } catch (error) {
      console.error("Login failed:", error.message);
    }
  };

  return <button onClick={handleLogin}>Login</button>;
}
```

### Manual Logout

```typescript
"use client";

import { useAuth } from "@/lib/contexts/auth-context";

export function LogoutButton() {
  const { logout } = useAuth();

  return <button onClick={logout}>Logout</button>;
}
```

### Check Authentication Status

```typescript
"use client";

import { useAuth } from "@/lib/contexts/auth-context";

export function ProtectedComponent() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>Please log in to view this content</div>;
  }

  return <div>Protected content for {user.name}</div>;
}
```

## 🛡️ Security Features

### Password Security
- **Hashing**: Passwords are hashed using bcrypt with salt rounds
- **Never Stored**: Plain text passwords are never stored
- **Validation**: Minimum 6 characters required

### Token Security
- **HTTP-Only Cookies**: Tokens stored in HTTP-only cookies (not accessible via JavaScript)
- **Secure Flag**: Enabled in production for HTTPS-only transmission
- **SameSite**: Set to 'lax' to prevent CSRF attacks
- **Expiration**: Tokens expire after 7 days

### Route Protection
- **Middleware**: Automatically protects all routes except `/login` and `/register`
- **Server-Side**: Validation happens on the server
- **API Protection**: API routes check authentication before processing

## 📂 File Structure

```
app/
├── (auth)/                    # Auth route group (no layout)
│   ├── layout.tsx            # Simple layout for auth pages
│   ├── login/
│   │   └── page.tsx          # Login page
│   └── register/
│       └── page.tsx          # Register page
├── api/
│   ├── auth/
│   │   ├── login/route.ts    # Login endpoint
│   │   ├── register/route.ts # Register endpoint
│   │   ├── logout/route.ts   # Logout endpoint
│   │   └── me/route.ts       # Get current user
│   └── fields/
│       ├── route.ts          # GET/POST fields (protected)
│       └── [id]/route.ts     # GET/PATCH/DELETE field (protected)
├── layout.tsx                # Root layout with AuthProvider
└── page.tsx                  # Dashboard (protected)

lib/
├── auth/
│   ├── jwt.ts                # JWT signing/verification
│   └── middleware.ts         # Auth middleware helpers
├── contexts/
│   └── auth-context.tsx      # Auth context & hooks
└── db/
    ├── models/
    │   ├── User.ts           # User model
    │   └── Field.ts          # Field model
    └── mongodb.ts            # MongoDB connection

middleware.ts                 # Next.js middleware for route protection
```

## 🎨 UI Components

### Login Page (`/login`)
- Beautiful gradient background
- Email and password fields
- Error message display
- Loading states
- Link to registration

### Register Page (`/register`)
- Full name input
- Email input
- Farm name (optional)
- Password with confirmation
- Validation feedback
- Link to login

### Sidebar
- Displays user's name and farm
- User avatar icon
- Logout button with confirmation
- Only shown when authenticated

## 🧪 Testing Authentication

### Test User Registration

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@farm.com",
    "password": "password123",
    "name": "Test Farmer",
    "farmName": "Test Farm"
  }'
```

### Test Login

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{
    "email": "test@farm.com",
    "password": "password123"
  }'
```

### Test Protected Endpoint

```bash
curl http://localhost:3000/api/fields \
  -b cookies.txt
```

### Test Get Current User

```bash
curl http://localhost:3000/api/auth/me \
  -b cookies.txt
```

## 🔄 User Context API

The `useAuth()` hook provides:

```typescript
interface AuthContextType {
  user: User | null;           // Current user or null
  loading: boolean;            // Loading state
  login: (email, password) => Promise<void>;
  register: (data) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;  // Refresh user data
}

interface User {
  id: string;
  email: string;
  name: string;
  farmName?: string;
}
```

## 🚨 Error Handling

### Login Errors
- Invalid email/password → "Invalid email or password"
- Server error → "Internal server error"
- Validation error → Specific field errors

### Registration Errors
- Email already exists → "User with this email already exists"
- Password too short → "Password must be at least 6 characters"
- Validation errors → Specific field errors

### Protected Route Errors
- No token → Redirect to `/login`
- Invalid token → Redirect to `/login`
- Expired token → Redirect to `/login`

## 📝 Environment Variables

Required in `.env.local`:

```env
# MongoDB connection string
MONGODB_URI=mongodb://localhost:27017/irrismart

# JWT secret (MUST be changed in production!)
JWT_SECRET=your-super-secret-jwt-key-change-in-production-please

# Mapbox token
NEXT_PUBLIC_MAPBOX_TOKEN=your_token_here
```

## 🔧 Customization

### Change Token Expiration

Edit `lib/auth/jwt.ts`:

```typescript
const JWT_EXPIRES_IN = "7d";  // Change to "1d", "30d", etc.
```

### Add More User Fields

1. Update `lib/db/models/User.ts`:
```typescript
{
  // ... existing fields
  phoneNumber: {
    type: String,
    required: false,
  },
}
```

2. Update `lib/contexts/auth-context.tsx`:
```typescript
interface User {
  // ... existing fields
  phoneNumber?: string;
}
```

3. Update registration form in `app/(auth)/register/page.tsx`

### Customize Protected Routes

Edit `middleware.ts`:

```typescript
const publicRoutes = ["/login", "/register", "/about", "/contact"];
```

## ✅ Best Practices

1. **Never expose JWT_SECRET** - Keep it in `.env.local`, never commit it
2. **Use HTTPS in production** - Cookies with secure flag require HTTPS
3. **Implement rate limiting** - Prevent brute force attacks on login
4. **Add email verification** - Verify email addresses before full access
5. **Implement password reset** - Allow users to reset forgotten passwords
6. **Log authentication events** - Track login attempts and failures
7. **Add two-factor authentication** - Extra security layer for sensitive operations

## 🎯 Next Steps

- [ ] Add email verification
- [ ] Implement password reset flow
- [ ] Add social login (Google, Facebook)
- [ ] Implement refresh tokens
- [ ] Add rate limiting
- [ ] Set up session management
- [ ] Add user profile page
- [ ] Implement role-based access control (admin, user, etc.)

## 📚 Related Documentation

- [DATABASE_SETUP.md](./DATABASE_SETUP.md) - MongoDB setup and schema
- [MONGODB_QUICKSTART.md](./MONGODB_QUICKSTART.md) - Quick start guide
- [README.md](./README.md) - General project documentation

---

**Your authentication system is now fully set up and ready to use!** 🎉

