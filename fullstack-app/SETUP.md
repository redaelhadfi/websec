# Setup Instructions

## Initial Setup

### 1. Install MongoDB

#### macOS (using Homebrew):
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

#### Ubuntu/Linux:
```bash
sudo apt-get install mongodb
sudo systemctl start mongodb
```

#### Windows:
Download from https://www.mongodb.com/try/download/community

### 2. Verify MongoDB is running
```bash
mongosh
# Should connect successfully
```

### 3. Setup Backend
```bash
cd backend
npm install
npm run seed    # Seed database with sample data
npm run dev     # Start backend server on port 5000
```

### 4. Setup Frontend (in new terminal)
```bash
cd frontend
npm install
npm run dev     # Start frontend on port 5173
```

### 5. Access the Application
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

### 6. Login with Demo Accounts
- **Admin**: admin@example.com / admin123
- **User**: user@example.com / user123

## Alternative: Use MongoDB Atlas (Cloud)

If you prefer not to install MongoDB locally:

1. Create free account at https://www.mongodb.com/cloud/atlas
2. Create a new cluster (Free M0)
3. Create database user
4. Whitelist your IP: 0.0.0.0/0
5. Get connection string
6. Update `backend/.env`:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ecommerce
   ```
7. Run `npm run seed` and `npm run dev`

## Development Workflow

### Running Both Servers Concurrently
From root directory:
```bash
# Option 1: Use concurrently (if installed)
npm run dev

# Option 2: Manual (two terminals)
# Terminal 1:
cd backend && npm run dev

# Terminal 2:
cd frontend && npm run dev
```

## Testing the Application

### 1. Test Authentication
- Register a new account
- Login with credentials
- Verify JWT token in localStorage

### 2. Test Product CRUD (Admin)
- Login as admin
- Create a new product
- Edit existing product
- Delete a product

### 3. Test Search & Filters
- Search by keyword
- Filter by category
- Sort by price/name/date
- Test pagination

### 4. Test Dashboard (Admin)
- View statistics
- Check category distribution
- See low stock alerts
- View recent products

## Troubleshooting

### MongoDB Connection Error
```bash
# Check if MongoDB is running
brew services list  # macOS
sudo systemctl status mongodb  # Linux

# Restart MongoDB
brew services restart mongodb-community  # macOS
sudo systemctl restart mongodb  # Linux
```

### Port Already in Use
```bash
# Find process using port
lsof -ti:5000  # Backend
lsof -ti:5173  # Frontend

# Kill process
kill -9 <PID>
```

### CORS Errors
- Make sure backend is running
- Check `.env` files have correct URLs
- Verify CORS is enabled in backend

### Module Not Found
```bash
# Reinstall dependencies
cd backend && rm -rf node_modules package-lock.json && npm install
cd frontend && rm -rf node_modules package-lock.json && npm install
```

## Production Build

### Backend
```bash
cd backend
npm start  # Production mode
```

### Frontend
```bash
cd frontend
npm run build  # Creates dist/ folder
npm run preview  # Preview production build
```

## Environment Variables

### Backend (.env)
```env
MONGODB_URI=mongodb://localhost:27017/ecommerce
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
PORT=5000
NODE_ENV=development
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000
```

## Next Steps

1. ✅ Complete all setup steps above
2. ✅ Test all features
3. ✅ Customize for your needs
4. ✅ Deploy to production (see DEPLOYMENT.md)
5. ✅ Create video presentation (3-5 minutes)
