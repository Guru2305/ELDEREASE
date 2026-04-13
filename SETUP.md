# ELDEREASE - Elder Care Management System

A comprehensive MERN stack application for connecting elders with volunteers for various assistance services.

## 🏗️ Architecture

- **Frontend**: React + TypeScript + Vite + TailwindCSS
- **Backend**: Node.js + Express + MongoDB
- **Authentication**: JWT with role-based access
- **Real-time**: WebSocket integration for live notifications

## 📋 Features

### Elder Management System
- ✅ Profile management with medical conditions
- ✅ Emergency contacts setup
- ✅ Service booking (medical, transport, grocery, etc.)
- ✅ Real-time tracking of volunteer location
- ✅ Feedback and rating system

### Volunteer Management System
- ✅ Skills-based matching
- ✅ Availability scheduling
- ✅ Background check verification
- ✅ Ratings and reviews
- ✅ Earnings tracking

### Booking System
- ✅ Create, accept, reject bookings
- ✅ Real-time status updates
- ✅ Location-based matching
- ✅ Emergency priority handling
- ✅ Payment processing

## 🚀 Quick Start

### Prerequisites
- Node.js (v18+)
- MongoDB (local or Atlas)
- Git

### 1. Clone & Install

```bash
git clone <your-repo-url>
cd ELDEREASE-main

# Install frontend dependencies
npm install

# Install backend dependencies
npm run server:install
```

### 2. Environment Setup

#### Frontend (.env)
```bash
cp .env.example .env
# Edit .env with your values
```

#### Backend (server/.env)
```bash
cd server
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret
```

### 3. Start Development

```bash
# Start both frontend and backend
npm start

# Or start separately:
# Frontend: npm run dev (port 3000)
# Backend: npm run server (port 5000)
```

### 4. Access URLs

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **API Health**: http://localhost:5000/api/health

## 🔧 Configuration

### MongoDB Setup

#### Local MongoDB
```bash
# Start MongoDB service
mongod

# Create database
use elderease
```

#### MongoDB Atlas
1. Create free cluster at https://cloud.mongodb.com/
2. Get connection string
3. Add to `server/.env`:
```bash
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/elderease
```

### Environment Variables

#### Frontend (.env)
```bash
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=ELDEREASE
VITE_NODE_ENV=development
```

#### Backend (server/.env)
```bash
PORT=5000
MONGODB_URI=mongodb://localhost:27017/elderease
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRE=7d
FRONTEND_URL=http://localhost:3000
FRONTEND_URL_VOLUNTEER=http://localhost:3001
```

## 📱 Multi-Domain Setup

### Option 1: Different Ports (Development)
```bash
# Terminal 1 - Elder UI
PORT=3000 npm run dev

# Terminal 2 - Volunteer UI  
PORT=3001 npm run dev

# Terminal 3 - Backend
cd server && npm run dev
```

### Option 2: Different Domains (Production)
- Configure DNS for elder.yourdomain.com
- Configure DNS for volunteer.yourdomain.com
- Update CORS settings in server/.env

## 🚀 Deployment

### Vercel (Recommended)

1. **Install Vercel CLI**
```bash
npm i -g vercel
```

2. **Deploy**
```bash
vercel --prod
```

3. **Environment Variables**
- Set in Vercel dashboard:
  - `MONGODB_URI`
  - `JWT_SECRET`
  - `NODE_ENV=production`

### Render

1. **Install Render CLI**
```bash
npm i -g @render/cli
```

2. **Deploy**
```bash
render deploy
```

3. **Configure Services**
- Frontend: Static site
- Backend: Node.js service
- MongoDB: Render MongoDB

### Docker (Optional)

```bash
# Build
docker build -t elderease .

# Run
docker run -p 3000:3000 -p 5000:5000 elderease
```

## 🔐 Authentication

### JWT Token Structure
```json
{
  "id": "user_id",
  "role": "elder|volunteer",
  "iat": 1234567890,
  "exp": 1234567890
}
```

### Role-Based Access
- **Elder**: Can create bookings, view own profile
- **Volunteer**: Can accept bookings, update location
- **Admin**: Can manage all users and bookings

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/me` - Update profile

### Elders
- `GET /api/elders/profile` - Get elder profile
- `PUT /api/elders/profile` - Update profile
- `GET /api/elders/bookings` - Get elder bookings
- `GET /api/elders/stats` - Get elder statistics

### Volunteers
- `GET /api/volunteers/profile` - Get volunteer profile
- `PUT /api/volunteers/profile` - Update profile
- `PUT /api/volunteers/online-status` - Update online status
- `GET /api/volunteers/bookings` - Get volunteer bookings
- `GET /api/volunteers/nearby-bookings` - Get nearby bookings

### Bookings
- `POST /api/bookings` - Create booking
- `GET /api/bookings` - Get bookings
- `GET /api/bookings/:id` - Get booking by ID
- `PUT /api/bookings/:id/accept` - Accept booking
- `PUT /api/bookings/:id/reject` - Reject booking
- `PUT /api/bookings/:id/complete` - Complete booking
- `PUT /api/bookings/:id/cancel` - Cancel booking

## 🧪 Testing

### Frontend Tests
```bash
npm run test
```

### Backend Tests
```bash
cd server
npm run test
```

### API Testing
```bash
# Health check
curl http://localhost:5000/api/health

# Register elder
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"role":"elder","firstName":"John","lastName":"Doe","email":"john@example.com","password":"123456","phone":"1234567890","age":70,"address":{"street":"123 Main St","city":"Bangalore","state":"Karnataka","pincode":"560001"},"emergencyContacts":[{"name":"Jane Doe","relation":"daughter","phone":"9876543210"}]}'
```

## 🐛 Troubleshooting

### Common Issues

#### 1. MongoDB Connection Error
```bash
# Check MongoDB is running
mongod --version

# Check connection string
echo $MONGODB_URI
```

#### 2. CORS Error
```bash
# Check frontend URL in server/.env
cat server/.env | grep FRONTEND_URL
```

#### 3. JWT Token Error
```bash
# Check JWT secret is set
echo $JWT_SECRET
```

#### 4. Port Already in Use
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Kill process on port 5000
lsof -ti:5000 | xargs kill -9
```

## 📝 Development Notes

### File Structure
```
ELDEREASE-main/
├── src/                    # Frontend source
│   ├── components/         # React components
│   ├── pages/             # Page components
│   ├── services/          # API services
│   └── App.tsx            # Main app component
├── server/                 # Backend source
│   ├── models/            # MongoDB models
│   ├── routes/            # API routes
│   ├── controllers/       # Route controllers
│   ├── middleware/        # Express middleware
│   └── server.js          # Server entry point
├── package.json           # Frontend dependencies
├── server/package.json    # Backend dependencies
└── README.md             # This file
```

### Contributing
1. Fork the repository
2. Create feature branch
3. Make changes
4. Test thoroughly
5. Submit pull request

## 📞 Support

For issues and questions:
- Create GitHub issue
- Email: support@elderease.com
- Documentation: https://docs.elderease.com

## 📄 License

MIT License - see LICENSE file for details
