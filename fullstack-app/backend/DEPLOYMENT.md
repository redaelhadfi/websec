# Render Deployment Configuration for Backend

## Steps to Deploy Backend on Render:

1. **Push your code to GitHub**
   - Create a GitHub repository
   - Push your backend code

2. **Create a New Web Service on Render**
   - Go to https://render.com
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select the `backend` directory

3. **Configure the Web Service**
   - **Name**: your-app-backend
   - **Region**: Choose closest to your users
   - **Branch**: main
   - **Root Directory**: backend
   - **Runtime**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: Free

4. **Add Environment Variables**
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ecommerce
   JWT_SECRET=your_production_jwt_secret_change_this
   NODE_ENV=production
   PORT=5000
   ```

5. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment to complete
   - Note your backend URL: https://your-app-backend.onrender.com

## MongoDB Atlas Setup:

1. Create account at https://www.mongodb.com/cloud/atlas
2. Create a new cluster (Free M0)
3. Create database user
4. Whitelist IP: 0.0.0.0/0 (Allow from anywhere)
5. Get connection string and add to Render environment variables
