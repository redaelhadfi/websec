# Vercel/Netlify Deployment Configuration for Frontend

## Option 1: Deploy on Vercel

1. **Push your code to GitHub**

2. **Deploy on Vercel**
   - Go to https://vercel.com
   - Click "New Project"
   - Import your GitHub repository
   - Select the `frontend` directory

3. **Configure Build Settings**
   - **Framework Preset**: Vite
   - **Root Directory**: frontend
   - **Build Command**: `npm run build`
   - **Output Directory**: dist
   - **Install Command**: `npm install`

4. **Add Environment Variable**
   ```
   VITE_API_URL=https://your-app-backend.onrender.com
   ```

5. **Deploy**
   - Click "Deploy"
   - Your site will be live at: https://your-app.vercel.app

## Option 2: Deploy on Netlify

1. **Push your code to GitHub**

2. **Deploy on Netlify**
   - Go to https://netlify.com
   - Click "Add new site" → "Import an existing project"
   - Connect your GitHub repository

3. **Configure Build Settings**
   - **Base directory**: frontend
   - **Build command**: `npm run build`
   - **Publish directory**: frontend/dist

4. **Add Environment Variable**
   - Go to Site settings → Environment variables
   - Add: `VITE_API_URL=https://your-app-backend.onrender.com`

5. **Deploy**
   - Click "Deploy site"
   - Your site will be live at: https://your-app.netlify.app

## Important Notes:

- Make sure to update CORS settings in backend to allow your frontend domain
- Wait for backend to be fully deployed before deploying frontend
- Free tier services may sleep after inactivity (first request may be slow)
