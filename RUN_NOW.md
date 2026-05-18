# 🚀 RUN NOW - Quick Commands

## ⚡ FASTEST WAY TO START

```bash
# 1. Update database with new emails
npm run prisma:seed

# 2. Start server
npm run dev

# 3. Open browser
# http://localhost:3000/login
```

---

## 🔑 LOGIN CREDENTIALS

### Admin (Full Access)
```
admin@gmail.com
Admin@123456
```

### Staff (Limited Access)
```
staff@hotmail.com
Staff@123456
```

### Customer (Own Resources Only)
```
an.customer@gmail.com
Customer@123456
```

---

## 🎯 PAGES TO TEST

### 1. Login
```
http://localhost:3000/login
✅ New emails (@gmail.com, @hotmail.com)
✅ Click-to-fill demo accounts
```

### 2. Products (NEW!)
```
http://localhost:3000/products
✅ Beautiful product cards
✅ RBAC enforcement
✅ ADMIN: Edit/Delete buttons
✅ CUSTOMER: Buy Now button only
```

### 3. Audit Logs (FIXED!)
```
http://localhost:3000/admin/audit
✅ Dark mode dropdowns (no white!)
✅ Filter by status/action
```

### 4. RBAC Matrix
```
http://localhost:3000/security/rbac-matrix
✅ Permission matrix
✅ OWASP ASVS compliance
```

### 5. Attack Simulation
```
http://localhost:3000/security/attack-simulation
✅ Live attack demos
✅ Terminal-style display
```

---

## 🧪 QUICK TEST

```bash
# Test 1: Login as ADMIN
1. Open /login
2. Click "ADMIN" card
3. Should auto-fill: admin@gmail.com
4. Login → /admin/dashboard

# Test 2: Products (ADMIN)
1. Navigate to /products
2. Should see "Add Product" button
3. Should see "Edit" and "Delete" on products

# Test 3: Products (CUSTOMER)
1. Logout
2. Login as: an.customer@gmail.com
3. Navigate to /products
4. Should NOT see "Add Product"
5. Should NOT see "Edit" or "Delete"
6. Should only see "Buy Now"

# Test 4: Audit Logs
1. Login as admin@gmail.com
2. Navigate to /admin/audit
3. Dropdowns should be DARK (not white!)
```

---

## 🐛 TROUBLESHOOTING

### Database Error
```bash
# Reset database
npx prisma db push --force-reset
npm run prisma:seed
```

### Port Already in Use
```bash
# Use different port
npm run dev -- -p 3001
```

### Prisma Client Error
```bash
npx prisma generate
```

### Old Emails Still Showing
```bash
# Clear database and reseed
npx prisma db push --force-reset
npm run prisma:seed
# Clear browser cookies
# Hard refresh (Ctrl+Shift+R)
```

---

## ✅ WHAT'S NEW

### 1. Realistic Emails
- ❌ Old: admin@example.com
- ✅ New: admin@gmail.com

### 2. Dark Mode Dropdowns
- ❌ Old: White background
- ✅ New: Dark background (#111827)

### 3. Professional Products Page
- ❌ Old: Basic unstyled list
- ✅ New: Beautiful cards with RBAC

---

## 🎬 DEMO IN 3 STEPS

```bash
# Step 1: Start
npm run prisma:seed && npm run dev

# Step 2: Login
# Open: http://localhost:3000/login
# Click: ADMIN card
# Auto-fills: admin@gmail.com

# Step 3: Show Features
# - /products (new professional design!)
# - /admin/audit (fixed dark dropdowns!)
# - /security/rbac-matrix (permission matrix)
```

---

## 📚 DOCUMENTATION

- `UI_POLISH_COMPLETE.md` - Complete changes
- `FINAL_UI_POLISH_SUMMARY.md` - Full summary
- `DEMO_UPDATED_QUICK_REF.md` - Demo script
- `RUN_NOW.md` - This file

---

## 🎉 READY!

Everything is set up and ready to demo!

**Good luck!** 🚀
