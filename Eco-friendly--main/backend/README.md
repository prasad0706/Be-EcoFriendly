# Be-EcoFriendly - Backend API

Backend server for the Be-EcoFriendly e-commerce platform built with Node.js, Express, MongoDB, and Supabase.

## Features

- **RESTful API** with Express.js
- **MongoDB** database with Mongoose ODM
- **Supabase** authentication and image storage
- **JWT** authentication and authorization
- **Role-based** access control (User/Admin)
- **Product management** with CRUD operations
- **Shopping cart** functionality
- **Order processing** and management
- **Wishlist** feature
- **Image upload** to Supabase Storage

## Tech Stack

- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **Supabase** - Authentication & Storage
- **JWT** - Token-based authentication
- **Bcrypt** - Password hashing
- **Multer** - File upload handling

## Prerequisites

Before running this project, ensure you have:

- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- Supabase account

## Installation

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create environment file:**
   ```bash
   cp .env.example .env
   ```

4. **Configure environment variables:**

   Edit the `.env` file with your credentials:

   ```env
   # Server Configuration
   PORT=5000
   NODE_ENV=development

   # MongoDB
   MONGODB_URI=mongodb://localhost:27017/be-ecofriendly
   # For MongoDB Atlas: mongodb+srv://<username>:<password>@cluster.mongodb.net/be-ecofriendly

   # JWT Secret
   JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
   JWT_EXPIRE=7d

   # Supabase Configuration
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_ANON_KEY=your-supabase-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

   # Frontend URL (for CORS)
   FRONTEND_URL=http://localhost:5173
   ```

## Running the Application

### Development Mode (with auto-reload):
```bash
npm run dev
```

### Production Mode:
```bash
npm start
```

The server will start on `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (Protected)
- `PUT /api/auth/profile` - Update user profile (Protected)
- `POST /api/auth/logout` - Logout user (Protected)

### Products
- `GET /api/products` - Get all products (with filters)
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (Admin)
- `PUT /api/products/:id` - Update product (Admin)
- `DELETE /api/products/:id` - Delete product (Admin)
- `POST /api/products/:id/reviews` - Add review (Protected)
- `POST /api/products/upload` - Upload image (Admin)

### Cart
- `GET /api/cart` - Get user cart (Protected)
- `POST /api/cart` - Add item to cart (Protected)
- `PUT /api/cart/:itemId` - Update cart item (Protected)
- `DELETE /api/cart/:itemId` - Remove item from cart (Protected)
- `DELETE /api/cart` - Clear cart (Protected)

### Orders
- `POST /api/orders` - Create order (Protected)
- `GET /api/orders/myorders` - Get user orders (Protected)
- `GET /api/orders/:id` - Get order by ID (Protected)
- `GET /api/orders` - Get all orders (Admin)
- `PUT /api/orders/:id/status` - Update order status (Admin)
- `DELETE /api/orders/:id` - Delete order (Admin)

### Wishlist
- `GET /api/wishlist` - Get user wishlist (Protected)
- `POST /api/wishlist/:productId` - Add to wishlist (Protected)
- `DELETE /api/wishlist/:productId` - Remove from wishlist (Protected)

## Database Models

### User
- Email, password, name, role
- Avatar, phone, address
- Wishlist references

### Product
- Name, description, price
- Category, images, stock
- Ratings, reviews, eco-score
- Tags, specifications

### Cart
- User reference
- Items array with product references
- Total items and price

### Order
- User reference, items
- Shipping address
- Payment details
- Order status, timestamps

## Supabase Setup

1. **Create a Supabase project** at [supabase.com](https://supabase.com)

2. **Enable Authentication:**
   - Go to Authentication > Settings
   - Enable Email provider

3. **Create Storage Bucket:**
   - Go to Storage
   - Create a new bucket named `products`
   - Set it to public or configure policies

4. **Get API Keys:**
   - Go to Project Settings > API
   - Copy the Project URL and anon/service role keys

## Project Structure

```
backend/
├── config/
│   ├── database.js      # MongoDB connection
│   └── supabase.js      # Supabase client
├── controllers/
│   ├── authController.js
│   ├── productController.js
│   ├── cartController.js
│   ├── orderController.js
│   └── wishlistController.js
├── middleware/
│   ├── auth.js          # JWT & role verification
│   └── errorHandler.js  # Error handling
├── models/
│   ├── User.js
│   ├── Product.js
│   ├── Cart.js
│   └── Order.js
├── routes/
│   ├── authRoutes.js
│   ├── productRoutes.js
│   ├── cartRoutes.js
│   ├── orderRoutes.js
│   └── wishlistRoutes.js
├── .env.example
├── .gitignore
├── package.json
└── server.js            # Entry point
```

## Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Server port | `5000` |
| `NODE_ENV` | Environment | `development` |
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/be-ecofriendly` |
| `JWT_SECRET` | Secret for JWT signing | `your_secret_key` |
| `JWT_EXPIRE` | Token expiration time | `7d` |
| `SUPABASE_URL` | Supabase project URL | `https://xxx.supabase.co` |
| `SUPABASE_ANON_KEY` | Supabase anonymous key | `your_anon_key` |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key | `your_service_key` |
| `FRONTEND_URL` | Frontend URL for CORS | `http://localhost:5173` |

## Creating an Admin User

After registration, manually update a user's role in MongoDB:

```javascript
db.users.updateOne(
  { email: "admin@example.com" },
  { $set: { role: "admin" } }
)
```

## Error Handling

The API uses consistent error responses:

```json
{
  "success": false,
  "message": "Error message here"
}
```

## Security

- Passwords are hashed using bcrypt
- JWT tokens for authentication
- Protected routes with middleware
- Role-based access control
- CORS configured for frontend
- Input validation

## License

ISC

## Support

For issues or questions, please contact: info@be-ecofriendly.com
