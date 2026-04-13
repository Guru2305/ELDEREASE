# 🗄️ MongoDB Atlas Setup Guide for ELDEREASE

This guide will help you set up MongoDB Atlas for your ELDEREASE application.

## 🚀 Quick Setup (5 minutes)

### Step 1: Run Setup Script
```bash
npm run setup:mongodb
```

### Step 2: Follow the Interactive Guide
The script will show you exactly what to do on MongoDB Atlas website.

### Step 3: Test Connection
```bash
npm run test:db
```

---

## 📋 Detailed Manual Setup

### 1. Create MongoDB Atlas Account

1. **Visit**: https://cloud.mongodb.com/
2. **Click "Start Free"**
3. **Sign up** with Google/GitHub or email
4. **Verify email** if required

### 2. Create Your First Cluster

1. **Click "Build a Database"**
2. **Choose M0 Sandbox** (FREE - 512MB)
3. **Cloud Provider**: AWS (recommended)
4. **Region**: Choose nearest to your users:
   - 🇮🇳 India: Mumbai
   - 🇺🇸 USA: Virginia East
   - 🇪🇺 Europe: Ireland
5. **Cluster Name**: `elderease-cluster`
6. **Click "Create Cluster"**

### 3. Configure Database User

1. **Go to "Database Access"** (left sidebar)
2. **Click "Add New Database User"**
3. **Authentication Method**: Password
4. **Username**: `elderease_user`
5. **Password**: Generate strong password (save it!)
6. **Database User Privileges**: 
   - ✅ Read and write to any database
7. **Click "Add User"**

### 4. Configure Network Access

1. **Go to "Network Access"** (left sidebar)
2. **Click "Add IP Address"**
3. **Choose "ALLOW ACCESS FROM ANYWHERE"**
4. **IP Address**: `0.0.0.0/0`
5. **Click "Confirm"**

### 5. Get Connection String

1. **Go to "Database"** (left sidebar)
2. **Click "Connect"** on your cluster
3. **Choose "Drivers"**
4. **Copy the connection string**

It looks like:
```
mongodb+srv://elderease_user:<password>@elderease-cluster.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

### 6. Update Environment Variables

Create `server/.env` file:
```bash
# Environment Variables
PORT=5000
MONGODB_URI=mongodb+srv://elderease_user:YOUR_ACTUAL_PASSWORD@elderease-cluster.xxxxx.mongodb.net/elderease?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-min-32-chars
JWT_EXPIRE=7d

# CORS Settings
FRONTEND_URL=http://localhost:3000
FRONTEND_URL_VOLUNTEER=http://localhost:3001
```

**Important**: Replace `YOUR_ACTUAL_PASSWORD` with the password you created.

---

## 🧪 Test Your Setup

### Method 1: Test Script
```bash
npm run test:db
```

### Method 2: Manual Test
```bash
cd server
npm run dev
```

Look for: `✅ MongoDB Connected: elderease-cluster.xxxxx.mongodb.net`

---

## 🔧 Advanced Configuration

### Connection String Options

```bash
# Basic connection
mongodb+srv://user:pass@cluster.mongodb.net/dbname

# With options
mongodb+srv://user:pass@cluster.mongodb.net/dbname?retryWrites=true&w=majority&appName=elderease

# Production ready
mongodb+srv://user:pass@cluster.mongodb.net/dbname?retryWrites=true&w=majority&maxIdleTimeMS=30000&serverSelectionTimeoutMS=5000
```

### Environment Variables Explained

```bash
MONGODB_URI=                    # Full connection string
MONGODB_DB_NAME=elderease        # Database name
JWT_SECRET=                     # JWT signing secret
JWT_EXPIRE=7d                   # Token expiration
FRONTEND_URL=                   # Allowed CORS origin
```

---

## 🚨 Troubleshooting

### Common Issues & Solutions

#### 1. Authentication Failed
```
Error: Authentication failed
```
**Solution**:
- Check username/password in connection string
- Ensure user has correct permissions
- Verify user is created in correct cluster

#### 2. IP Not Whitelisted
```
Error: IP not whitelisted
```
**Solution**:
- Add your IP to Network Access
- Or use "Allow from anywhere" (0.0.0.0/0)

#### 3. Connection Timeout
```
Error: Connection timeout
```
**Solution**:
- Check internet connection
- Verify cluster name is correct
- Ensure cluster is running

#### 4. Invalid Connection String
```
Error: Invalid connection string
```
**Solution**:
- Copy connection string from Atlas dashboard
- Replace `<password>` placeholder
- Ensure no extra spaces

---

## 📊 Database Collections

The setup will automatically create these collections:

### elders
```javascript
{
  firstName: String,
  lastName: String,
  email: String,
  password: String, // hashed
  phone: String,
  age: Number,
  address: {
    street: String,
    city: String,
    state: String,
    pincode: String
  },
  emergencyContacts: [{
    name: String,
    relation: String,
    phone: String
  }],
  medicalConditions: [{
    condition: String,
    severity: String,
    medications: [String]
  }]
}
```

### volunteers
```javascript
{
  firstName: String,
  lastName: String,
  email: String,
  password: String, // hashed
  phone: String,
  age: Number,
  skills: [String],
  ratings: {
    average: Number,
    totalRatings: Number,
    reviews: [Object]
  }
}
```

### bookings
```javascript
{
  elderId: ObjectId,
  volunteerId: ObjectId,
  serviceType: String,
  title: String,
  description: String,
  urgency: String,
  scheduledDate: Date,
  duration: Number,
  location: {
    address: String,
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  },
  status: String // pending, accepted, completed, cancelled
}
```

---

## 🌐 Production Considerations

### Security
- ✅ Use strong passwords
- ✅ Enable IP whitelisting
- ✅ Use SSL/TLS connections
- ✅ Regular password rotation

### Performance
- ✅ Choose nearest region
- ✅ Add indexes for queries
- ✅ Monitor connection usage
- ✅ Use connection pooling

### Monitoring
- ✅ Atlas Metrics Dashboard
- ✅ Real-time performance monitoring
- ✅ Alert setup for critical issues

---

## 📞 Support

### MongoDB Atlas Documentation
- 📚 [Getting Started](https://docs.mongodb.com/manual/getting-started/)
- 📚 [Connection Guide](https://docs.mongodb.com/manual/reference/connection-string/)
- 📚 [Atlas Documentation](https://docs.atlas.mongodb.com/)

### ELDEREASE Support
- 🐛 Report issues: GitHub Issues
- 💬 Discussion: GitHub Discussions
- 📧 Email: support@elderease.com

---

## 🎉 Success Checklist

- [ ] Created MongoDB Atlas account
- [ ] Built M0 Sandbox cluster
- [ ] Created database user (`elderease_user`)
- [ ] Configured network access
- [ ] Got connection string
- [ ] Updated `.env` file
- [ ] Tested connection successfully
- [ ] Server starts without errors
- [ ] Ready for development! 🚀

Once all items are checked, your MongoDB Atlas is ready for ELDEREASE!
