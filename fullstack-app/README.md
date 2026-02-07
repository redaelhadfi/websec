# Full Stack E-Commerce Product Management System

## 📋 Description
A modern full-stack web application for managing products with complete CRUD operations, authentication, search, filtering, and admin dashboard.

## 🚀 Features
- ✅ User Authentication (JWT-based)
- ✅ Role-based Access Control (Admin/User)
- ✅ Complete CRUD Operations
- ✅ Advanced Search & Filtering
- ✅ Sorting & Pagination
- ✅ Image Upload
- ✅ Admin Dashboard with Statistics
- ✅ Responsive Design
- ✅ Form Validation (Client & Server)

## 🛠️ Tech Stack

### Frontend
- React.js with Vite
- React Router v6
- TailwindCSS
- Axios
- React Hook Form

### Backend
- Node.js & Express
- MongoDB & Mongoose
- JWT Authentication
- Bcrypt for password hashing
- Multer for file uploads
- Express Validator

## 📁 Project Structure
```
fullstack-app/
├── backend/          # Express API
├── frontend/         # React Application
└── README.md
```

## 🔧 Installation & Setup

### Prerequisites
- Node.js (v16+)
- MongoDB
- npm or yarn

### Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Configure your MongoDB URI and JWT secret
npm run dev
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

## 🌐 API Endpoints

### Authentication
- POST `/api/auth/register` - Register new user
- POST `/api/auth/login` - Login user

### Products
- GET `/api/products` - Get all products (with pagination, search, filter)
- GET `/api/products/:id` - Get single product
- POST `/api/products` - Create product (Admin only)
- PUT `/api/products/:id` - Update product (Admin only)
- DELETE `/api/products/:id` - Delete product (Admin only)

### Users
- GET `/api/users/profile` - Get user profile
- GET `/api/users/stats` - Get statistics (Admin only)

## 🔐 Environment Variables

### Backend (.env)
```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:5000
```

## 📦 Deployment

### Backend (Render)
1. Push code to GitHub
2. Connect repository to Render
3. Add environment variables
4. Deploy

### Frontend (Vercel/Netlify)
1. Push code to GitHub
2. Connect repository to Vercel/Netlify
3. Set build command: `npm run build`
4. Set output directory: `dist`
5. Add environment variables
6. Deploy

## 👥 Default Users
- **Admin**: admin@example.com / admin123
- **User**: user@example.com / user123

## 📝 License
MIT

## 👨‍💻 Author
Developed for Full Stack Web Project
