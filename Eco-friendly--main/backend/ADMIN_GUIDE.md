# Admin Panel Access Guide

## How to Access the Admin Panel

1. **Register or Login** as a regular user through the frontend application
2. **Promote a user to admin** using the scripts provided below
3. **Access the admin panel** by navigating to `/admin` in your browser

## Available Scripts

### 1. List All Users
View all registered users and their roles:
```bash
cd backend
node listUsers.js
```

### 2. Make a User Admin
Promote a user to admin role:
```bash
cd backend
node makeAdmin.js user@example.com
```
Replace `user@example.com` with the email of the user you want to make an admin.

## Accessing the Admin Panel

Once you have promoted a user to admin:

1. Login with that user's credentials
2. Navigate to: http://localhost:5174/admin (or your frontend URL + /admin)
3. You should see the admin dashboard with options for:
   - Dashboard
   - Products Management
   - Orders Management
   - Reviews Management

## Admin Panel Features

- **Dashboard**: Overview of key metrics
- **Products**: Add, edit, delete products
- **Orders**: View and manage customer orders
- **Reviews**: Moderate product reviews

## Troubleshooting

If you can't access the admin panel:
1. Make sure you're logged in
2. Verify the user has 'admin' role in the database
3. Check browser console for any errors
4. Ensure the backend server is running