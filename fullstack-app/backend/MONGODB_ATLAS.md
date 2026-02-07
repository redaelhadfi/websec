# MongoDB Atlas Configuration

## API Keys (Stored Securely)
- **Public Key**: rqskuueo
- **Private Key**: acab6fcf-bae0-4f72-a2a0-88c9710ba41f

⚠️ **IMPORTANT**: Keep these credentials secure and never commit to Git!

## Setup Instructions

### 1. Get Your Connection String
1. Go to https://cloud.mongodb.com
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Copy the connection string (looks like):
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/
   ```

### 2. Configure Database Access
1. In Atlas, go to "Database Access"
2. Click "Add New Database User"
3. Create username and password
4. Grant "Read and write to any database" permissions

### 3. Configure Network Access
1. In Atlas, go to "Network Access"
2. Click "Add IP Address"
3. Choose "Allow Access from Anywhere" (0.0.0.0/0) for development
4. Or add your specific IP address

### 4. Update .env File
Replace in `backend/.env`:
```env
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/ecommerce?retryWrites=true&w=majority
```

**Replace**:
- `username` with your database username
- `password` with your database password
- `cluster0.xxxxx.mongodb.net` with your actual cluster URL

### 5. Test Connection
```bash
cd backend
npm run seed    # Seed database with sample data
npm run dev     # Start backend server
```

## Current Status
✅ MongoDB Atlas account created
✅ API keys saved
⏳ Waiting for connection string configuration

## Next Steps
1. Copy your MongoDB Atlas connection string
2. Replace the placeholder in `backend/.env`
3. Run `npm run seed` to populate the database
4. Start the servers: `npm run dev`
