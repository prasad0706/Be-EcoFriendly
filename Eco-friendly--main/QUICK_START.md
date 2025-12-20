# 🚀 Quick Start Guide - Be-EcoFriendly

Get your Be-EcoFriendly e-commerce platform up and running in minutes!

## ⚡ Prerequisites Check

Before starting, ensure you have:
- ✅ Node.js (v14+) installed → `node --version`
- ✅ MongoDB installed or Atlas account
- ✅ Supabase account (free tier is fine)
- ✅ Git installed

## 📦 Step 1: Clone & Navigate

```bash
git clone <your-repo-url>
cd be-ecofriendly
```

## 🔧 Step 2: Backend Setup (5 minutes)

### 2.1 Install Dependencies
```bash
cd backend
npm install
```

### 2.2 Configure Environment
```bash
# Copy the example file
cp .env.example .env

# Edit .env file with your credentials
# On Windows: notepad .env
# On Mac/Linux: nano .env
```

**Minimum required .env configuration:**
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/be-ecofriendly
JWT_SECRET=your_random_secret_key_here
JWT_EXPIRE=7d
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
FRONTEND_URL=http://localhost:5173
```

### 2.3 Start MongoDB

**Option A - Local MongoDB:**
```bash
mongod
```

**Option B - MongoDB Atlas:**
Use your Atlas connection string in `MONGODB_URI`

### 2.4 Seed Sample Data (Optional)
```bash
npm run seed
```
This adds 8 sample products to your database.

### 2.5 Start Backend Server
```bash
npm run dev
```

✅ **Backend should now be running on http://localhost:5000**

## 🎨 Step 3: Frontend Setup (3 minutes)

### 3.1 Open New Terminal & Navigate
```bash
cd frontend
```

### 3.2 Install Dependencies
```bash
npm install
```

### 3.3 Configure Environment
```bash
# Copy the example file
cp .env.example .env

# Edit .env file
# On Windows: notepad .env
# On Mac/Linux: nano .env
```

**Required .env configuration:**
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
VITE_API_URL=http://localhost:5000/api
```

### 3.4 Start Frontend
```bash
npm run dev
```

✅ **Frontend should now be running on http://localhost:5173**

## 🔐 Step 4: Supabase Setup (2 minutes)

### 4.1 Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project"
3. Create a new project (wait ~2 minutes for setup)

### 4.2 Enable Email Authentication
1. Go to **Authentication** → **Settings**
2. Enable **Email** provider
3. (Optional) Disable email confirmation for testing

### 4.3 Create Storage Bucket
1. Go to **Storage**
2. Click "New bucket"
3. Name it **`products`**
4. Make it **public** or configure policies

### 4.4 Get API Keys
1. Go to **Project Settings** → **API**
2. Copy:
   - **Project URL** → Use as `SUPABASE_URL`
   - **anon public** → Use as `SUPABASE_ANON_KEY`
   - **service_role** → Use as `SUPABASE_SERVICE_ROLE_KEY`
3. Update both `.env` files with these values

## ✨ Step 5: Test the Application

### 5.1 Open Your Browser
Navigate to: **http://localhost:5173**

### 5.2 Create an Account
1. Click "Sign Up" or "Register"
2. Fill in your details:
   - Name: Test User
   - Email: test@example.com
   - Password: test123
3. Click "Create Account"

### 5.3 Browse Products
- View the home page
- Click "Shop" to see all products
- Try searching and filtering

### 5.4 Test Shopping Cart
- Click "Add to Cart" on any product
- View cart icon (should show count)
- Navigate to cart page

## 👑 Step 6: Create Admin User (Optional)

### 6.1 Using MongoDB Compass
1. Connect to your database
2. Find the `users` collection
3. Find your user by email
4. Edit the document
5. Change `role` from `"user"` to `"admin"`
6. Save

### 6.2 Using MongoDB Shell
```javascript
use be-ecofriendly
db.users.updateOne(
  { email: "test@example.com" },
  { $set: { role: "admin" } }
)
```

### 6.3 Verify Admin Access
- Logout and login again
- You should see "Admin Dashboard" in the menu

## 🎯 What You Should See

### ✅ Home Page
- Beautiful hero section with green gradient
- Feature cards
- Featured products grid
- Newsletter signup

### ✅ Shop Page
- Product grid with filters
- Search functionality
- Category filters
- Sort options

### ✅ Product Cards
- Product image
- Eco score bar
- Price (with discount if applicable)
- "Add to Cart" button
- Star ratings

### ✅ Navbar
- Be-EcoFriendly logo
- Navigation links
- Shopping cart icon with count
- User menu (when logged in)

## 🐛 Troubleshooting

### Backend won't start
**Error: "ECONNREFUSED MongoDB"**
- ✓ Check if MongoDB is running
- ✓ Verify `MONGODB_URI` in .env

**Error: "Missing environment variables"**
- ✓ Ensure `.env` file exists in backend folder
- ✓ Check all required variables are set

### Frontend won't start
**Error: "Cannot find module"**
```bash
rm -rf node_modules package-lock.json
npm install
```

**Error: "VITE_* is undefined"**
- ✓ Ensure `.env` file exists in frontend folder
- ✓ Restart the dev server after changing .env

### Can't login/register
**Supabase errors**
- ✓ Check Supabase credentials in .env
- ✓ Verify email provider is enabled in Supabase
- ✓ Check browser console for errors

### CORS errors
- ✓ Ensure backend is running on port 5000
- ✓ Check `FRONTEND_URL` in backend .env
- ✓ Restart backend server

## 📝 Development Workflow

### Daily Development
1. **Start MongoDB** (if local)
2. **Terminal 1 - Backend:**
   ```bash
   cd backend
   npm run dev
   ```
3. **Terminal 2 - Frontend:**
   ```bash
   cd frontend
   npm run dev
   ```

### Making Changes
- **Backend changes:** Server auto-restarts (nodemon)
- **Frontend changes:** Page auto-refreshes (Vite HMR)

### Adding Products
- **Via Admin Panel:** Login as admin → Dashboard → Add Product
- **Via Seed Script:** `cd backend && npm run seed`

## 🎨 Customization Tips

### Change Colors
Edit `frontend/tailwind.config.js`:
```javascript
colors: {
  primary: '#YOUR_COLOR',
  green: '#YOUR_COLOR',
  // ...
}
```

### Add More Sample Products
Edit `backend/seedProducts.js` and run:
```bash
npm run seed
```

### Modify Logo
Update the `<Leaf />` icon in `frontend/src/components/layout/Navbar.jsx`

## 🚀 Next Steps

1. **Explore the Code** - Check out the project structure
2. **Read Documentation** - See README files for details
3. **Add Features** - Product details page, checkout, etc.
4. **Deploy** - Use Vercel (frontend) + Railway (backend)

## 📚 Additional Resources

- [Backend Documentation](./backend/README.md)
- [Frontend Documentation](./frontend/README.md)
- [Project Summary](./PROJECT_SUMMARY.md)
- [Supabase Docs](https://supabase.com/docs)
- [Tailwind CSS](https://tailwindcss.com)
- [Framer Motion](https://www.framer.com/motion)

## 💡 Pro Tips

1. **Use MongoDB Compass** - Visual interface for database
2. **Install React DevTools** - Debug React components
3. **Use Postman** - Test API endpoints
4. **Enable Supabase Logs** - Debug auth issues
5. **Check Browser Console** - Frontend errors appear here

## ✅ Success Checklist

- [ ] Backend server running on port 5000
- [ ] Frontend running on port 5173
- [ ] MongoDB connected successfully
- [ ] Can register a new user
- [ ] Can login successfully
- [ ] Products appear on home page
- [ ] Can add products to cart
- [ ] Cart icon shows correct count

## 🎉 You're All Set!

Your Be-EcoFriendly e-commerce platform is now running!

**Happy coding! 💚**

---

Need help? Check the documentation or contact: info@be-ecofriendly.com
