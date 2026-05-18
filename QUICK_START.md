# 🚀 Quick Start Guide - Security Demonstration System

## 📋 Prerequisites

- Node.js 18+ installed
- PostgreSQL database running
- `.env` file configured

---

## ⚡ Quick Start (5 Minutes)

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Setup Database
```bash
# Generate Prisma Client
npx prisma generate

# Push schema to database
npx prisma db push

# Seed database with Vietnamese users
npm run prisma:seed
```

### Step 3: Run Development Server
```bash
npm run dev
```

### Step 4: Open Browser
Open http://localhost:3000

---

## 🔑 Demo Accounts

### ADMIN (Full Access)
- **Email**: `admin@example.com`
- **Password**: `Admin@123456`
- **Permissions**: 16 (all permissions)
- **Dashboard**: `/dashboard/admin`

### STAFF (Limited Access)
- **Email**: `staff@example.com`
- **Password**: `Staff@123456`
- **Permissions**: 7 (product & order management)
- **Dashboard**: `/dashboard/staff`

### CUSTOMER (Minimal Access)
- **Email**: `an.customer@example.com`
- **Password**: `Customer@123456`
- **Permissions**: 2 (view products, own orders)
- **Dashboard**: `/dashboard/customer`

---

## 🎯 Demo Flow

### 1. Login as ADMIN
```
1. Go to http://localhost:3000/login
2. Enter: admin@example.com / Admin@123456
3. Click "Sign In"
4. See WelcomeModal with 16 permissions
5. Auto-redirect to Admin Dashboard
6. Explore:
   - Statistics cards
   - Security alerts
   - Quick actions
   - Recent activity
7. Navigate to "RBAC Matrix" (/admin/security)
8. See permission matrix and authorization flow
```

### 2. Login as STAFF
```
1. Logout (if logged in)
2. Login with: staff@example.com / Staff@123456
3. See WelcomeModal with limited permissions
4. Redirect to Staff Dashboard
5. See "Limited Access" notice
6. Try to access /admin/security → 403 Forbidden
7. See animated error page
```

### 3. Login as CUSTOMER
```
1. Logout (if logged in)
2. Login with: an.customer@example.com / Customer@123456
3. See WelcomeModal with minimal permissions
4. Redirect to Customer Dashboard
5. See only own orders
6. Try to access /admin/users → 403 Forbidden
7. See animated error page
```

---

## 🎨 Key Features to Demo

### ✅ Login Experience
- Glassmorphism design
- Animated shield logo
- Security badges (ASVS L2, RBAC, Secure)
- Loading screen
- Password visibility toggle

### ✅ Welcome Modal
- User avatar with initials
- Role and permissions display
- Security level indicator
- ASVS Level 2 badge
- Smooth animations

### ✅ Role-Based Dashboards
- **Admin**: Full access, all statistics, security tools
- **Staff**: Product/Order management, limited access notice
- **Customer**: Own orders only, minimal permissions

### ✅ RBAC Visualization
- Permission matrix table (17 permissions × 3 roles)
- Green checkmarks for allowed
- Red X for denied
- Authorization flow diagram (7 steps)
- ASVS compliance note

### ✅ Error Pages
- 401 Unauthorized (animated)
- 403 Forbidden (shake animation)
- Security explanations
- Back to home links

---

## 🔍 Testing Checklist

### Admin Access ✅
- [ ] Login successful
- [ ] WelcomeModal shows 16 permissions
- [ ] Admin Dashboard loads
- [ ] Can access /admin/security
- [ ] Can access /admin/users
- [ ] Can access /admin/roles
- [ ] Can access /admin/audit
- [ ] Statistics cards show correct data
- [ ] Recent activity feed works

### Staff Access ✅
- [ ] Login successful
- [ ] WelcomeModal shows limited permissions
- [ ] Staff Dashboard loads
- [ ] Limited access notice visible
- [ ] Cannot access /admin/security (403)
- [ ] Cannot access /admin/roles (403)
- [ ] Can access /products
- [ ] Can access /orders

### Customer Access ✅
- [ ] Login successful
- [ ] WelcomeModal shows minimal permissions
- [ ] Customer Dashboard loads
- [ ] Customer access notice visible
- [ ] Cannot access /admin/* (403)
- [ ] Cannot access /dashboard/admin (403)
- [ ] Can access /products
- [ ] Can only see own orders

### Security Features ✅
- [ ] All authorization server-side
- [ ] 403 page shows for unauthorized access
- [ ] 401 page shows for unauthenticated access
- [ ] Audit logs record denied attempts
- [ ] Ownership validation works
- [ ] No client-side security bypass

---

## 📊 Routes Overview

### Public Routes
- `/` - Home page
- `/login` - Login page
- `/register` - Register page

### Protected Routes (All Users)
- `/account` - Account page (redirects to dashboard)
- `/products` - Product list

### Admin Only
- `/dashboard/admin` - Admin dashboard
- `/admin/security` - RBAC visualization
- `/admin/users` - User management
- `/admin/roles` - Role management
- `/admin/audit` - Audit logs

### Staff Only
- `/dashboard/staff` - Staff dashboard

### Customer Only
- `/dashboard/customer` - Customer dashboard
- `/orders` - My orders (own orders only)
- `/orders/[orderId]` - Order detail (own orders only)

---

## 🐛 Troubleshooting

### Issue: "Cannot connect to database"
**Solution**: Check `.env` file and ensure PostgreSQL is running
```bash
# Check .env
DATABASE_URL="postgresql://user:password@localhost:5432/dbname"
```

### Issue: "Prisma Client not generated"
**Solution**: Run prisma generate
```bash
npx prisma generate
```

### Issue: "No users in database"
**Solution**: Run seed script
```bash
npm run prisma:seed
```

### Issue: "Port 3000 already in use"
**Solution**: Kill process or use different port
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Or use different port
npm run dev -- -p 3001
```

### Issue: "Module not found"
**Solution**: Reinstall dependencies
```bash
rm -rf node_modules package-lock.json
npm install
```

---

## 📝 Environment Variables

Create `.env` file in root directory:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/rbac_db"

# JWT Secret (change in production!)
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"

# Node Environment
NODE_ENV="development"
```

---

## 🎓 For Presentation

### Opening (2 minutes)
1. Show login page design
2. Explain OWASP ASVS Level 2 compliance
3. Show security badges

### Demo 1: Admin (5 minutes)
1. Login as admin
2. Show WelcomeModal
3. Explore Admin Dashboard
4. Navigate to RBAC Matrix
5. Explain permission matrix
6. Show authorization flow

### Demo 2: Staff (3 minutes)
1. Login as staff
2. Show limited permissions
3. Show Staff Dashboard
4. Try to access admin route → 403
5. Explain server-side validation

### Demo 3: Customer (3 minutes)
1. Login as customer
2. Show minimal permissions
3. Show Customer Dashboard
4. Show only own orders
5. Try to access admin route → 403

### Closing (2 minutes)
1. Highlight key features
2. Emphasize security (server-side, audit logs)
3. Show ASVS compliance
4. Q&A

**Total Time: ~15 minutes**

---

## 🏆 Success Criteria

✅ All 3 roles can login
✅ Each role sees appropriate dashboard
✅ Permission matrix displays correctly
✅ Authorization flow diagram visible
✅ 403 pages work for unauthorized access
✅ Animations smooth and professional
✅ No TypeScript errors
✅ No console errors
✅ Responsive design works
✅ Dark theme consistent

---

## 📞 Need Help?

Check these files:
- `IMPLEMENTATION_COMPLETE.md` - Full implementation details
- `SECURITY_DEMO_SYSTEM_GUIDE.md` - Original requirements
- `README.md` - Project overview
- `RBAC_ASVS_LEVEL2_REPORT.md` - Security compliance report

---

**Ready to demo! 🚀**
