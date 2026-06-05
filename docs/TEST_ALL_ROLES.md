# 🧪 Test All Roles - Quick Guide

## ⚡ Quick Test (3 Minutes)

### Setup
```
1. Open browser: http://localhost:3000/login
2. Open Console (F12)
3. Ready to test!
```

---

## 🎯 Test 1: STAFF Login

### Steps
```
1. Click "STAFF" demo account button
2. Click "Sign In"
3. Watch console logs
```

### Expected Console Output
```
[LOGIN] Submitting login for: staff@example.com
[LOGIN API] Redirect to: /staff/dashboard
[LOGIN] Login successful!
[STAFF DASHBOARD] Loading...
[STAFF DASHBOARD] User: staff@example.com Roles: ['STAFF']
[STAFF DASHBOARD] Stats loaded: {...}
```

### Expected Result
- ✅ URL changes to `/staff/dashboard`
- ✅ Staff Dashboard loads
- ✅ Shows 3 stat cards:
  - Total Products
  - Total Orders
  - Pending Orders
- ✅ Shows "Limited Access" notice
- ✅ Shows Product Management section
- ✅ Shows Order Management section
- ✅ No loading freeze
- ✅ No errors

---

## 🎯 Test 2: ADMIN Login

### Steps
```
1. Logout (if logged in)
2. Click "ADMIN" demo account button
3. Click "Sign In"
```

### Expected Console Output
```
[LOGIN] Submitting login for: admin@example.com
[LOGIN API] Redirect to: /admin/dashboard
[LOGIN] Login successful!
[ADMIN DASHBOARD] Loading...
[ADMIN DASHBOARD] User: admin@example.com Roles: ['ADMIN']
[ADMIN DASHBOARD] Stats loaded: {...}
```

### Expected Result
- ✅ URL changes to `/admin/dashboard`
- ✅ Admin Dashboard loads
- ✅ Shows 4 stat cards:
  - Total Users
  - Total Roles
  - Total Permissions
  - Access Denied
- ✅ Shows Security Alert (if denied attempts > 0)
- ✅ Shows Quick Actions
- ✅ Shows Recent Activity
- ✅ No errors

---

## 🎯 Test 3: CUSTOMER Login

### Steps
```
1. Logout (if logged in)
2. Click "CUSTOMER" demo account button
3. Click "Sign In"
```

### Expected Console Output
```
[LOGIN] Submitting login for: an.customer@example.com
[LOGIN API] Redirect to: /account
[LOGIN] Login successful!
```

### Expected Result
- ✅ URL changes to `/account`
- ✅ Redirects to customer dashboard (if exists)
- ✅ Or shows account page
- ✅ No errors

---

## 🎯 Test 4: ADMIN Access Staff Dashboard

### Steps
```
1. Login as ADMIN
2. Manually go to: http://localhost:3000/staff/dashboard
```

### Expected Result
- ✅ ADMIN can access (no 403)
- ✅ Staff Dashboard loads
- ✅ Shows staff stats
- ✅ Console shows: [STAFF DASHBOARD] User: admin@example.com Roles: ['ADMIN']

---

## ✅ Success Checklist

### Visual Checks
- [ ] Login page loads
- [ ] Demo accounts clickable
- [ ] Loading screen appears briefly
- [ ] Redirects to correct dashboard
- [ ] Dashboard loads completely
- [ ] Stats display correctly
- [ ] No white screen
- [ ] No infinite loading

### Console Checks
- [ ] No red errors
- [ ] Shows debug logs
- [ ] Shows correct redirect URL
- [ ] Shows user roles
- [ ] Shows stats loaded

### Functional Checks
- [ ] Can login with all 3 accounts
- [ ] Each redirects to correct URL
- [ ] Can logout and login again
- [ ] ADMIN can access staff dashboard
- [ ] Wrong password shows error

---

## 🔍 What to Look For

### In Browser
✅ **STAFF** → `/staff/dashboard`
✅ **ADMIN** → `/admin/dashboard`
✅ **CUSTOMER** → `/account`

### In Console
✅ `[LOGIN API] Redirect to: /staff/dashboard`
✅ `[STAFF DASHBOARD] Loading...`
✅ `[STAFF DASHBOARD] Stats loaded: {...}`

### In Network Tab (F12 → Network)
✅ POST `/api/auth/login` → 200 OK
✅ GET `/staff/dashboard` → 200 OK
✅ No 404 errors

---

## 🐛 If Something Goes Wrong

### Problem: Still redirects to `/dashboard/staff`
**Solution**:
```bash
# Clear cache
rm -rf .next
npm run dev

# Hard refresh browser
Ctrl + Shift + R
```

### Problem: 404 Not Found
**Solution**:
```bash
# Check file exists
ls src/app/staff/dashboard/page.tsx
ls src/app/admin/dashboard/page.tsx

# Restart server
npm run dev
```

### Problem: Dashboard shows 0 stats
**Solution**:
```bash
# Check database
npx prisma studio

# Reseed
npm run prisma:seed
```

### Problem: 403 Forbidden
**Solution**:
```bash
# Check user role in console
# Login again
# Check requireRole allows ADMIN
```

---

## 📊 Expected Stats

### Staff Dashboard
```
Total Products: 6 (from seed)
Total Orders: 0 (or actual count)
Pending Orders: 0 (or actual count)
```

### Admin Dashboard
```
Total Users: 14 (from seed)
Total Roles: 3 (ADMIN, STAFF, CUSTOMER)
Total Permissions: 17
Access Denied: 0 (or actual count)
```

---

## 🎯 Quick Test Script

### 1-Minute Test
```
1. Login as STAFF
2. Should go to /staff/dashboard
3. Dashboard should load
✅ PASS
```

### 3-Minute Test
```
1. Test STAFF login → /staff/dashboard
2. Logout
3. Test ADMIN login → /admin/dashboard
4. Logout
5. Test CUSTOMER login → /account
✅ PASS
```

### 5-Minute Test
```
1. Test all 3 logins
2. Test ADMIN access to /staff/dashboard
3. Check console for errors
4. Check stats display
5. Test logout/login again
✅ PASS
```

---

## 🎉 All Tests Pass?

**Congratulations! All dashboards working! 🎊**

### What's Working:
- ✅ Staff dashboard at `/staff/dashboard`
- ✅ Admin dashboard at `/admin/dashboard`
- ✅ Customer at `/account`
- ✅ Consistent route structure
- ✅ Error handling
- ✅ ADMIN can access all
- ✅ No loading freeze
- ✅ No 404 errors

### Ready for:
- ✅ Demo
- ✅ Presentation
- ✅ Production

---

## 📝 Route Reference

```
STAFF    → /staff/dashboard
ADMIN    → /admin/dashboard
CUSTOMER → /account

Old (broken):
STAFF    → /dashboard/staff ❌
ADMIN    → /dashboard/admin ❌
CUSTOMER → /dashboard/customer ❌
```

---

**Open http://localhost:3000/login and test all roles! 🚀**

**Everything should work perfectly! ✅**
