# Be-EcoFriendly - Frontend

Modern, responsive React frontend for the Be-EcoFriendly e-commerce platform featuring a beautiful eco-themed design with smooth animations.

## Features

- 🎨 **Beautiful UI** with Tailwind CSS and custom color palette
- ⚡ **Fast & Responsive** built with Vite and React
- 🔐 **Supabase Authentication** with JWT
- 🎭 **Smooth Animations** with Framer Motion
- 📱 **Fully Responsive** design (mobile, tablet, desktop)
- 🛒 **Shopping Cart** with real-time updates
- ❤️ **Wishlist** functionality
- 🔍 **Product Search & Filters**
- 👑 **Admin Dashboard** for product and order management
- 🌐 **React Query** for efficient data fetching

## Tech Stack

- **React 18** - UI library
- **Vite** - Build tool
- **Tailwind CSS** - Utility-first CSS
- **Framer Motion** - Animation library
- **React Router** - Client-side routing
- **React Query** - Data fetching & caching
- **React Hook Form** - Form handling
- **Axios** - HTTP client
- **Lucide React** - Icon library
- **React Hot Toast** - Toast notifications
- **Supabase** - Authentication & storage

## Color Palette

- **Deep Blue** (`#0F4C81`) - Primary color
- **Teal** (`#1F7A8C`) - Secondary color
- **Eco Green** (`#2FB973`) - Accent color
- **Soft Mint** (`#CFF6E4`) - Light accent
- **Light Background** (`#F6FBF9`) - Background

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Backend server running (see backend README)

## Installation

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
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

   Edit the `.env` file:

   ```env
   # Supabase Configuration
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-supabase-anon-key

   # API Base URL
   VITE_API_URL=http://localhost:5000/api
   ```

## Running the Application

### Development Mode:
```bash
npm run dev
```

The app will start on `http://localhost:5173`

### Build for Production:
```bash
npm run build
```

### Preview Production Build:
```bash
npm run preview
```

## Project Structure

```
frontend/
├── public/
├── src/
│   ├── components/
│   │   ├── common/
│   │   │   ├── Button.jsx
│   │   │   ├── Input.jsx
│   │   │   └── Loading.jsx
│   │   ├── layout/
│   │   │   ├── Navbar.jsx
│   │   │   └── Footer.jsx
│   │   └── product/
│   │       └── ProductCard.jsx
│   ├── context/
│   │   ├── AuthContext.jsx
│   │   └── CartContext.jsx
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Shop.jsx
│   │   └── auth/
│   │       ├── Login.jsx
│   │       └── Register.jsx
│   ├── config/
│   │   └── supabase.js
│   ├── utils/
│   │   └── api.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── .env.example
├── .gitignore
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js
└── vite.config.js
```

## Key Pages

### Public Pages
- **Home** (`/`) - Hero section, features, featured products
- **Shop** (`/shop`) - Product listing with search and filters
- **Product Details** (`/product/:id`) - Individual product page
- **Login** (`/login`) - User login
- **Register** (`/register`) - User registration

### Protected Pages
- **Cart** (`/cart`) - Shopping cart
- **Checkout** (`/checkout`) - Order checkout
- **Profile** (`/profile`) - User profile
- **Wishlist** (`/wishlist`) - Saved products
- **Orders** (`/orders`) - Order history

### Admin Pages
- **Admin Dashboard** (`/admin`) - Product & order management

## Key Features

### Authentication
- Supabase-based auth with JWT
- Auto-redirect on auth state changes
- Protected routes
- Role-based access (Admin/User)

### Shopping Cart
- Add/remove items
- Update quantities
- Real-time total calculation
- Persistent cart data
- Smooth animations

### Product Management (Admin)
- Create/Edit/Delete products
- Upload images to Supabase
- Manage stock and pricing
- Set featured products

### Responsive Design
- Mobile-first approach
- Breakpoints:
  - Mobile: < 640px
  - Tablet: 640px - 1024px
  - Desktop: > 1024px

## Animations

Framer Motion animations include:
- Page transitions
- Hover effects on cards
- Button interactions
- Modal animations
- Cart add animations
- Loading spinners

## State Management

- **React Query** - Server state
- **Context API** - Auth & Cart state
- **Local Storage** - Token persistence

## API Integration

All API calls are made through the `api.js` utility which:
- Adds auth tokens automatically
- Handles errors globally
- Redirects on 401 errors

Example usage:
```javascript
import api from './utils/api';

const response = await api.get('/products');
const data = response.data;
```

## Styling

### Tailwind Custom Classes

Custom utility classes defined in `index.css`:

```css
.btn-primary - Primary button
.btn-secondary - Secondary button
.btn-outline - Outline button
.input-field - Input field
.card - Card component
```

### Usage Example

```jsx
<button className="btn-primary">
  Click Me
</button>
```

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_SUPABASE_URL` | Supabase project URL | `https://xxx.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | Supabase anonymous key | `your_anon_key` |
| `VITE_API_URL` | Backend API URL | `http://localhost:5000/api` |

## Component Examples

### Using Button Component
```jsx
import Button from './components/common/Button';

<Button variant="primary" size="lg" onClick={handleClick}>
  Click Me
</Button>
```

### Using Input Component
```jsx
import Input from './components/common/Input';
import { Mail } from 'lucide-react';

<Input
  label="Email"
  type="email"
  icon={Mail}
  placeholder="your@email.com"
/>
```

## Context Usage

### Auth Context
```jsx
import { useAuth } from './context/AuthContext';

const { user, login, logout, isAuthenticated } = useAuth();
```

### Cart Context
```jsx
import { useCart } from './context/CartContext';

const { cart, addToCart, removeFromCart, cartItemsCount } = useCart();
```

## Deployment

### Build the app:
```bash
npm run build
```

The build output will be in the `dist` folder.

### Deploy to Vercel:
```bash
vercel deploy
```

### Deploy to Netlify:
```bash
netlify deploy --prod
```

## Performance Optimization

- Code splitting with React.lazy
- Image optimization
- React Query caching
- Memoization where needed
- Lazy loading components

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Troubleshooting

### Issue: API calls failing
- Check if backend server is running
- Verify `VITE_API_URL` is correct
- Check CORS configuration

### Issue: Supabase auth not working
- Verify Supabase credentials
- Check if email provider is enabled
- Ensure correct redirect URLs

### Issue: Styles not loading
- Run `npm install` again
- Clear browser cache
- Check Tailwind configuration

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

ISC

## Support

For issues or questions, please contact: info@be-ecofriendly.com
