# Be-EcoFriendly 🌱

A modern, full-stack e-commerce platform for sustainable and eco-friendly products. Built with the MERN stack (MongoDB, Express, React, Node.js), featuring Supabase authentication, beautiful UI with Tailwind CSS, and smooth animations with Framer Motion.

![Be-EcoFriendly](https://img.shields.io/badge/Status-Production%20Ready-green)
![License](https://img.shields.io/badge/License-ISC-blue)

## 🌟 Features

### Customer Features
- 🛍️ **Product Browsing** - Search, filter, and browse eco-friendly products
- 🛒 **Shopping Cart** - Add, remove, and manage cart items
- ❤️ **Wishlist** - Save favorite products
- 🔐 **Authentication** - Secure login/signup with Supabase
- 📦 **Order Management** - Place and track orders
- ⭐ **Product Reviews** - Rate and review products
- 📱 **Responsive Design** - Optimized for all devices
- 🎨 **Beautiful UI** - Modern, clean design with eco-theme
- ✨ **Smooth Animations** - Engaging user experience

### Admin Features
- 📊 **Dashboard** - Manage products, orders, and users
- ➕ **Product Management** - Add, edit, delete products
- 🖼️ **Image Upload** - Upload product images to Supabase
- 📋 **Order Management** - View and update order status
- 📈 **Analytics** - Track sales and inventory

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern UI library
- **Vite** - Lightning-fast build tool
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Production-ready animation library
- **React Router** - Client-side routing
- **React Query** - Data fetching and caching
- **Axios** - HTTP client
- **React Hook Form** - Form validation
- **Lucide React** - Beautiful icons

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **JWT** - Authentication tokens
- **Bcrypt** - Password hashing

### Services
- **Supabase** - Authentication & image storage
- **MongoDB Atlas** - Cloud database (optional)

## 🎨 Design Theme

**Eco-Friendly Color Palette:**
- Deep Blue: `#0F4C81` - Primary
- Teal: `#1F7A8C` - Secondary
- Eco Green: `#2FB973` - Accent
- Soft Mint: `#CFF6E4` - Light Accent
- Light Background: `#F6FBF9` - Background

## 📁 Project Structure

```
be-ecofriendly/
├── backend/                 # Backend API
│   ├── config/             # Configuration files
│   ├── controllers/        # Route controllers
│   ├── middleware/         # Custom middleware
│   ├── models/            # Database models
│   ├── routes/            # API routes
│   ├── .env.example       # Environment variables template
│   ├── server.js          # Entry point
│   └── package.json       # Dependencies
│
├── frontend/              # React frontend
│   ├── public/           # Static files
│   ├── src/
│   │   ├── components/   # Reusable components
│   │   ├── context/      # React context
│   │   ├── pages/        # Page components
│   │   ├── utils/        # Utility functions
│   │   ├── config/       # Configuration
│   │   ├── App.jsx       # Root component
│   │   └── main.jsx      # Entry point
│   ├── .env.example      # Environment variables template
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── package.json
│
└── README.md             # This file
```

## 🚀 Quick Start

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- Supabase account (free tier works)
- npm or yarn

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/be-ecofriendly.git
cd be-ecofriendly
```

### 2. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your credentials
npm run dev
```

**Backend runs on:** `http://localhost:5000`

See [Backend README](./backend/README.md) for detailed setup.

### 3. Frontend Setup

```bash
cd ../frontend
npm install
cp .env.example .env
# Edit .env with your credentials
npm run dev
```

**Frontend runs on:** `http://localhost:5173`

See [Frontend README](./frontend/README.md) for detailed setup.

### 4. Supabase Setup

1. Create account at [supabase.com](https://supabase.com)
2. Create new project
3. Enable **Email Authentication**
4. Create storage bucket named **`products`**
5. Get API keys from Project Settings
6. Add keys to `.env` files

### 5. MongoDB Setup

**Local MongoDB:**
```bash
mongod --dbpath /path/to/data
```

**MongoDB Atlas:**
1. Create cluster at [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Get connection string
3. Add to `MONGODB_URI` in backend `.env`

## 📝 Environment Variables

### Backend (.env)
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/be-ecofriendly
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=7d
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-key
FRONTEND_URL=http://localhost:5173
```

### Frontend (.env)
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_API_URL=http://localhost:5000/api
```

## 🗄️ Database Models

### User
```javascript
{
  email, password, name, role,
  avatar, phone, address,
  wishlist: [ProductId]
}
```

### Product
```javascript
{
  name, description, price, originalPrice,
  category, images, stock, featured,
  ecoScore, tags, specifications,
  ratings: { average, count },
  reviews: [{ user, rating, comment }]
}
```

### Order
```javascript
{
  user, items, shippingAddress,
  paymentMethod, paymentStatus,
  itemsPrice, shippingPrice, taxPrice, totalPrice,
  orderStatus, isPaid, isDelivered
}
```

### Cart
```javascript
{
  user, 
  items: [{ product, quantity, price }],
  totalItems, totalPrice
}
```

## 🔐 API Endpoints

### Authentication
```
POST   /api/auth/register       Register new user
POST   /api/auth/login          Login user
GET    /api/auth/me             Get current user
PUT    /api/auth/profile        Update profile
POST   /api/auth/logout         Logout user
```

### Products
```
GET    /api/products            Get all products
GET    /api/products/:id        Get single product
POST   /api/products            Create product (Admin)
PUT    /api/products/:id        Update product (Admin)
DELETE /api/products/:id        Delete product (Admin)
POST   /api/products/:id/reviews  Add review
POST   /api/products/upload     Upload image (Admin)
```

### Cart
```
GET    /api/cart                Get cart
POST   /api/cart                Add to cart
PUT    /api/cart/:itemId        Update quantity
DELETE /api/cart/:itemId        Remove item
DELETE /api/cart                Clear cart
```

### Orders
```
POST   /api/orders              Create order
GET    /api/orders/myorders     Get user orders
GET    /api/orders/:id          Get order by ID
GET    /api/orders              Get all orders (Admin)
PUT    /api/orders/:id/status   Update status (Admin)
DELETE /api/orders/:id          Delete order (Admin)
```

### Wishlist
```
GET    /api/wishlist            Get wishlist
POST   /api/wishlist/:productId Add to wishlist
DELETE /api/wishlist/:productId Remove from wishlist
```

## 👤 Creating Admin User

After registering a user, update role in MongoDB:

```javascript
db.users.updateOne(
  { email: "admin@example.com" },
  { $set: { role: "admin" } }
)
```

Or use MongoDB Compass to update the role field to `"admin"`.

## 🎯 Key Features Implementation

### State Management
- **React Context** - Auth & Cart state
- **React Query** - Server state with caching
- **Local Storage** - Token persistence

### Animations
- Framer Motion for smooth transitions
- Hover effects on all interactive elements
- Page transition animations
- Cart add animations

### Security
- JWT token authentication
- Password hashing with bcrypt
- Protected API routes
- Role-based access control
- CORS configuration

## 🎨 UI Components

### Reusable Components
- `Button` - Multiple variants (primary, secondary, outline)
- `Input` - Form inputs with icons and validation
- `Loading` - Loading spinner component
- `ProductCard` - Product display card
- `Navbar` - Responsive navigation
- `Footer` - Site footer

### Pages
- Home - Hero, features, featured products
- Shop - Product listing with filters
- Product Details - Individual product view
- Cart - Shopping cart management
- Checkout - Order placement
- Profile - User profile management
- Admin - Dashboard for product/order management

## 📱 Responsive Design

Mobile-first approach with breakpoints:
- **Mobile:** < 640px
- **Tablet:** 640px - 1024px
- **Desktop:** > 1024px

## 🚀 Deployment

### Backend Deployment (Heroku/Railway)
```bash
cd backend
git push heroku main
```

### Frontend Deployment (Vercel/Netlify)
```bash
cd frontend
npm run build
vercel deploy
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📄 License

This project is licensed under the ISC License.

## 👨‍💻 Author

**Be-EcoFriendly Team**

## 📧 Contact

- Email: info@be-ecofriendly.com
- Website: [be-ecofriendly.com](https://be-ecofriendly.com)

## 🙏 Acknowledgments

- Supabase for authentication and storage
- MongoDB for database
- Tailwind CSS for styling
- Framer Motion for animations
- Lucide for beautiful icons

---

**Made with 💚 for a sustainable future**
#   E c o - f r i e n d l y -  
 